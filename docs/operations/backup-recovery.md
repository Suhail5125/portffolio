# Backup and Recovery Documentation

This document provides comprehensive guidance on backing up and recovering your Portfolio Application data. Regular backups are essential for protecting against data loss, hardware failures, human errors, and security incidents.

## Table of Contents

- [Overview](#overview)
- [Backup Strategy](#backup-strategy)
- [PostgreSQL Database Backup](#postgresql-database-backup)
- [Database Restore](#database-restore)
- [User Data Export](#user-data-export)
- [User Data Import](#user-data-import)
- [Automated Backup Setup](#automated-backup-setup)
- [Disaster Recovery](#disaster-recovery)
- [Backup Verification](#backup-verification)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

### What Gets Backed Up

The Portfolio Application stores data in several locations:

1. **PostgreSQL Database** (Primary data store)
   - User accounts and credentials
   - Projects and project details
   - Skills and skill categories
   - Contact messages
   - About page content
   - Session data

2. **Uploaded Files** (File system)
   - Project images
   - Profile photos
   - Other media assets

3. **Configuration** (Environment variables)
   - Database connection strings
   - Session secrets
   - API keys and credentials

### Backup Types

- **Full Backup**: Complete database dump including all tables and data
- **Incremental Backup**: Only changes since last backup (requires WAL archiving)
- **Logical Backup**: SQL dump that can be restored to any PostgreSQL version
- **Physical Backup**: Binary copy of database files (faster but version-specific)

This guide focuses on **logical backups** using `pg_dump` for maximum compatibility and ease of use.


## Backup Strategy

### Recommended Backup Schedule

#### Production Environment

| Backup Type | Frequency | Retention | Priority |
|-------------|-----------|-----------|----------|
| Full Database | Daily at 2 AM | 30 days | High |
| Full Database | Weekly (Sunday) | 12 weeks | High |
| Full Database | Monthly (1st) | 12 months | Medium |
| Uploaded Files | Daily at 3 AM | 30 days | Medium |
| Configuration | On change | Indefinite | High |

#### Development Environment

| Backup Type | Frequency | Retention | Priority |
|-------------|-----------|-----------|----------|
| Full Database | Weekly | 4 weeks | Low |
| Uploaded Files | As needed | 2 weeks | Low |

### Storage Recommendations

1. **Local Backups**: Store on the same server for quick recovery
   - Fast restore times
   - No network dependency
   - Risk: Lost if server fails

2. **Remote Backups**: Store on separate server or cloud storage
   - Protection against server failure
   - Geographic redundancy
   - Slightly slower restore times

3. **3-2-1 Rule** (Recommended for production):
   - **3** copies of your data
   - **2** different storage media
   - **1** copy off-site

### Backup Storage Locations

**Local Storage**:
```bash
/home/portfolio/backups/
├── daily/
├── weekly/
├── monthly/
└── uploads/
```

**Cloud Storage Options**:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Backblaze B2
- DigitalOcean Spaces


## PostgreSQL Database Backup

### Method 1: Using pg_dump (Recommended)

`pg_dump` creates a logical backup that can be restored to any PostgreSQL version.

#### Basic Backup Command

```bash
# Backup to SQL file
pg_dump -U portfolio_user -h localhost -d portfolio > backup.sql

# Backup with compression (recommended)
pg_dump -U portfolio_user -h localhost -d portfolio | gzip > backup.sql.gz

# Backup with timestamp
pg_dump -U portfolio_user -h localhost -d portfolio | gzip > portfolio_$(date +%Y%m%d_%H%M%S).sql.gz
```

#### Using DATABASE_URL Environment Variable

```bash
# If DATABASE_URL is set in your environment
pg_dump $DATABASE_URL > backup.sql

# With compression
pg_dump $DATABASE_URL | gzip > backup.sql.gz
```

#### Backup with Custom Format (Faster Restore)

```bash
# Custom format allows parallel restore and selective restore
pg_dump -U portfolio_user -h localhost -d portfolio -Fc -f backup.dump

# Custom format with compression level 9
pg_dump -U portfolio_user -h localhost -d portfolio -Fc -Z 9 -f backup.dump
```

#### Backup Specific Tables

```bash
# Backup only specific tables
pg_dump -U portfolio_user -h localhost -d portfolio -t projects -t skills > partial_backup.sql

# Exclude specific tables (e.g., sessions)
pg_dump -U portfolio_user -h localhost -d portfolio -T sessions > backup_no_sessions.sql
```

### Method 2: Using pg_dumpall (All Databases)

```bash
# Backup all databases and global objects (roles, tablespaces)
pg_dumpall -U postgres -h localhost > all_databases.sql

# With compression
pg_dumpall -U postgres -h localhost | gzip > all_databases.sql.gz
```

### Method 3: Platform-Specific Backups

#### Railway

```bash
# Get database credentials from Railway dashboard
# Use pg_dump with connection string
pg_dump "postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway" | gzip > railway_backup.sql.gz
```

#### Render

```bash
# Use Internal or External Database URL from Render dashboard
pg_dump "postgresql://user:password@dpg-abc123.oregon-postgres.render.com/portfolio_db" | gzip > render_backup.sql.gz

# Or use Render's built-in backup feature (automatic)
# Dashboard → Database → Backups
```

#### VPS (Self-Hosted)

```bash
# Local backup on VPS
pg_dump -U portfolio_user -h localhost -d portfolio | gzip > /home/portfolio/backups/backup_$(date +%Y%m%d).sql.gz
```

### Backup Script

Create a reusable backup script:

```bash
#!/bin/bash
# File: backup-database.sh

# Configuration
BACKUP_DIR="/home/portfolio/backups/daily"
DB_NAME="portfolio"
DB_USER="portfolio_user"
DB_HOST="localhost"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Starting backup of $DB_NAME database..."
pg_dump -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "Backup size: $BACKUP_SIZE"
    
    # Delete backups older than retention period
    echo "Cleaning up old backups (older than $RETENTION_DAYS days)..."
    find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    
    echo "Backup process completed successfully"
    exit 0
else
    echo "ERROR: Backup failed!"
    exit 1
fi
```

Make the script executable:

```bash
chmod +x backup-database.sh
```

Run the backup:

```bash
./backup-database.sh
```


## Database Restore

### Before Restoring

**⚠️ WARNING**: Restoring a backup will **overwrite all existing data** in the target database. Always:

1. Create a backup of the current database before restoring
2. Verify the backup file is not corrupted
3. Test restore on a non-production database first
4. Stop the application to prevent data inconsistencies

### Method 1: Restore from SQL Dump

#### Restore Uncompressed SQL File

```bash
# Restore to existing database
psql -U portfolio_user -h localhost -d portfolio < backup.sql

# Using DATABASE_URL
psql $DATABASE_URL < backup.sql
```

#### Restore Compressed SQL File

```bash
# Decompress and restore
gunzip -c backup.sql.gz | psql -U portfolio_user -h localhost -d portfolio

# Or using zcat
zcat backup.sql.gz | psql -U portfolio_user -h localhost -d portfolio

# Using DATABASE_URL
gunzip -c backup.sql.gz | psql $DATABASE_URL
```

#### Restore to New Database

```bash
# Create new database
createdb -U portfolio_user -h localhost portfolio_restored

# Restore backup to new database
gunzip -c backup.sql.gz | psql -U portfolio_user -h localhost -d portfolio_restored

# Verify data
psql -U portfolio_user -h localhost -d portfolio_restored -c "SELECT COUNT(*) FROM projects;"

# If verified, rename databases
psql -U postgres -h localhost -c "ALTER DATABASE portfolio RENAME TO portfolio_old;"
psql -U postgres -h localhost -c "ALTER DATABASE portfolio_restored RENAME TO portfolio;"

# Drop old database after verification
psql -U postgres -h localhost -c "DROP DATABASE portfolio_old;"
```

### Method 2: Restore from Custom Format

```bash
# Restore custom format backup
pg_restore -U portfolio_user -h localhost -d portfolio backup.dump

# Restore with parallel jobs (faster)
pg_restore -U portfolio_user -h localhost -d portfolio -j 4 backup.dump

# Restore only specific tables
pg_restore -U portfolio_user -h localhost -d portfolio -t projects -t skills backup.dump

# Clean database before restore (drop existing objects)
pg_restore -U portfolio_user -h localhost -d portfolio --clean backup.dump

# Create database and restore
pg_restore -U portfolio_user -h localhost -d postgres --create backup.dump
```

### Method 3: Restore All Databases

```bash
# Restore all databases from pg_dumpall
gunzip -c all_databases.sql.gz | psql -U postgres -h localhost
```

### Restore Script

Create a restore script with safety checks:

```bash
#!/bin/bash
# File: restore-database.sh

# Configuration
BACKUP_FILE="$1"
DB_NAME="portfolio"
DB_USER="portfolio_user"
DB_HOST="localhost"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Check if backup file provided
if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 /path/to/backup.sql.gz"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Confirm restore
echo "⚠️  WARNING: This will overwrite all data in the '$DB_NAME' database!"
echo "Backup file: $BACKUP_FILE"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Create safety backup of current database
echo "Creating safety backup of current database..."
SAFETY_BACKUP="/tmp/${DB_NAME}_pre_restore_${TIMESTAMP}.sql.gz"
pg_dump -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" | gzip > "$SAFETY_BACKUP"

if [ $? -eq 0 ]; then
    echo "Safety backup created: $SAFETY_BACKUP"
else
    echo "ERROR: Failed to create safety backup. Aborting restore."
    exit 1
fi

# Restore database
echo "Starting restore from $BACKUP_FILE..."

if [[ "$BACKUP_FILE" == *.gz ]]; then
    # Compressed file
    gunzip -c "$BACKUP_FILE" | psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME"
else
    # Uncompressed file
    psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" < "$BACKUP_FILE"
fi

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "✅ Restore completed successfully!"
    echo "Safety backup saved at: $SAFETY_BACKUP"
    echo "You can delete it after verifying the restore."
    exit 0
else
    echo "❌ ERROR: Restore failed!"
    echo "Your data is safe. Safety backup available at: $SAFETY_BACKUP"
    exit 1
fi
```

Make the script executable:

```bash
chmod +x restore-database.sh
```

Run the restore:

```bash
./restore-database.sh /path/to/backup.sql.gz
```

### Post-Restore Steps

After restoring a database:

1. **Verify Data Integrity**:
   ```bash
   # Check table counts
   psql -U portfolio_user -h localhost -d portfolio -c "
   SELECT 'users' as table, COUNT(*) FROM users
   UNION ALL
   SELECT 'projects', COUNT(*) FROM projects
   UNION ALL
   SELECT 'skills', COUNT(*) FROM skills
   UNION ALL
   SELECT 'contact_messages', COUNT(*) FROM contact_messages;
   "
   ```

2. **Update Database Statistics**:
   ```bash
   psql -U portfolio_user -h localhost -d portfolio -c "ANALYZE;"
   ```

3. **Restart Application**:
   ```bash
   # PM2
   pm2 restart portfolio
   
   # Systemd
   sudo systemctl restart portfolio
   
   # Docker
   docker-compose restart
   ```

4. **Test Application**:
   - Visit health endpoint: `/api/health`
   - Test login functionality
   - Verify projects are displayed
   - Check admin panel access


## User Data Export

Export specific user data for compliance, migration, or backup purposes.

### Export All Data (JSON Format)

Create an export script:

```bash
#!/bin/bash
# File: export-user-data.sh

DB_USER="portfolio_user"
DB_HOST="localhost"
DB_NAME="portfolio"
EXPORT_DIR="./exports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$EXPORT_DIR"

echo "Exporting user data..."

# Export users (excluding passwords)
psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
COPY (
  SELECT id, username, created_at
  FROM users
) TO STDOUT WITH CSV HEADER
" > "$EXPORT_DIR/users_${TIMESTAMP}.csv"

# Export projects
psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
COPY (
  SELECT id, title, description, image_url, project_url, github_url, 
         technologies, featured, display_order, created_at, updated_at
  FROM projects
  ORDER BY display_order
) TO STDOUT WITH CSV HEADER
" > "$EXPORT_DIR/projects_${TIMESTAMP}.csv"

# Export skills
psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
COPY (
  SELECT id, name, category, proficiency, icon, display_order, created_at
  FROM skills
  ORDER BY display_order
) TO STDOUT WITH CSV HEADER
" > "$EXPORT_DIR/skills_${TIMESTAMP}.csv"

# Export contact messages
psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
COPY (
  SELECT id, name, email, message, is_read, created_at
  FROM contact_messages
  ORDER BY created_at DESC
) TO STDOUT WITH CSV HEADER
" > "$EXPORT_DIR/contact_messages_${TIMESTAMP}.csv"

# Export about content
psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
COPY (
  SELECT id, content, profile_image_url, resume_url, updated_at
  FROM about
) TO STDOUT WITH CSV HEADER
" > "$EXPORT_DIR/about_${TIMESTAMP}.csv"

echo "Export completed successfully!"
echo "Files saved to: $EXPORT_DIR"
ls -lh "$EXPORT_DIR"/*_${TIMESTAMP}.csv
```

### Export as JSON

```bash
#!/bin/bash
# File: export-json.sh

DB_USER="portfolio_user"
DB_HOST="localhost"
DB_NAME="portfolio"
OUTPUT_FILE="portfolio_export_$(date +%Y%m%d_%H%M%S).json"

echo "Exporting data to JSON..."

psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -t -c "
SELECT json_build_object(
  'export_date', NOW(),
  'users', (SELECT json_agg(row_to_json(u)) FROM (
    SELECT id, username, created_at FROM users
  ) u),
  'projects', (SELECT json_agg(row_to_json(p)) FROM (
    SELECT * FROM projects ORDER BY display_order
  ) p),
  'skills', (SELECT json_agg(row_to_json(s)) FROM (
    SELECT * FROM skills ORDER BY display_order
  ) s),
  'contact_messages', (SELECT json_agg(row_to_json(c)) FROM (
    SELECT * FROM contact_messages ORDER BY created_at DESC
  ) c),
  'about', (SELECT row_to_json(a) FROM (
    SELECT * FROM about LIMIT 1
  ) a)
);
" > "$OUTPUT_FILE"

echo "Export completed: $OUTPUT_FILE"
```

### Export Uploaded Files

```bash
#!/bin/bash
# File: export-uploads.sh

UPLOAD_DIR="./uploads"
BACKUP_DIR="./backups/uploads"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="uploads_${TIMESTAMP}.tar.gz"

echo "Backing up uploaded files..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create compressed archive
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$(dirname $UPLOAD_DIR)" "$(basename $UPLOAD_DIR)"

if [ $? -eq 0 ]; then
    echo "✅ Upload files backed up successfully!"
    echo "Archive: $BACKUP_DIR/$ARCHIVE_NAME"
    echo "Size: $(du -h "$BACKUP_DIR/$ARCHIVE_NAME" | cut -f1)"
else
    echo "❌ ERROR: Failed to backup upload files"
    exit 1
fi
```

### Export Specific User Data (GDPR Compliance)

```bash
#!/bin/bash
# File: export-user-gdpr.sh
# Export all data for a specific user (for GDPR data portability requests)

USER_ID="$1"
OUTPUT_FILE="user_${USER_ID}_data_$(date +%Y%m%d_%H%M%S).json"

if [ -z "$USER_ID" ]; then
    echo "Usage: $0 <user_id>"
    exit 1
fi

psql -U portfolio_user -h localhost -d portfolio -t -c "
SELECT json_build_object(
  'user', (SELECT row_to_json(u) FROM (
    SELECT id, username, created_at FROM users WHERE id = $USER_ID
  ) u),
  'projects_created', (SELECT json_agg(row_to_json(p)) FROM (
    SELECT * FROM projects WHERE created_by = $USER_ID
  ) p),
  'export_date', NOW()
);
" > "$OUTPUT_FILE"

echo "User data exported: $OUTPUT_FILE"
```


## User Data Import

Import previously exported data back into the database.

### Import from CSV Files

```bash
#!/bin/bash
# File: import-user-data.sh

DB_USER="portfolio_user"
DB_HOST="localhost"
DB_NAME="portfolio"
IMPORT_DIR="./exports"

echo "Importing user data from CSV files..."

# Import projects
if [ -f "$IMPORT_DIR/projects.csv" ]; then
    echo "Importing projects..."
    psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
    COPY projects(id, title, description, image_url, project_url, github_url, 
                  technologies, featured, display_order, created_at, updated_at)
    FROM STDIN WITH CSV HEADER
    " < "$IMPORT_DIR/projects.csv"
    echo "✅ Projects imported"
fi

# Import skills
if [ -f "$IMPORT_DIR/skills.csv" ]; then
    echo "Importing skills..."
    psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
    COPY skills(id, name, category, proficiency, icon, display_order, created_at)
    FROM STDIN WITH CSV HEADER
    " < "$IMPORT_DIR/skills.csv"
    echo "✅ Skills imported"
fi

# Import contact messages
if [ -f "$IMPORT_DIR/contact_messages.csv" ]; then
    echo "Importing contact messages..."
    psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
    COPY contact_messages(id, name, email, message, is_read, created_at)
    FROM STDIN WITH CSV HEADER
    " < "$IMPORT_DIR/contact_messages.csv"
    echo "✅ Contact messages imported"
fi

# Reset sequences to avoid ID conflicts
echo "Resetting sequences..."
psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -c "
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));
SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));
SELECT setval('contact_messages_id_seq', (SELECT MAX(id) FROM contact_messages));
"

echo "Import completed successfully!"
```

### Import from JSON

```bash
#!/bin/bash
# File: import-json.sh

JSON_FILE="$1"
DB_USER="portfolio_user"
DB_HOST="localhost"
DB_NAME="portfolio"

if [ -z "$JSON_FILE" ] || [ ! -f "$JSON_FILE" ]; then
    echo "Usage: $0 <json_file>"
    exit 1
fi

echo "Importing data from JSON file: $JSON_FILE"

# Create temporary SQL file
TEMP_SQL="/tmp/import_$(date +%Y%m%d_%H%M%S).sql"

# Convert JSON to SQL INSERT statements using Node.js
node << 'EOF' > "$TEMP_SQL"
const fs = require('fs');
const data = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));

// Import projects
if (data.projects) {
  data.projects.forEach(p => {
    console.log(`INSERT INTO projects (title, description, image_url, project_url, github_url, technologies, featured, display_order) VALUES (
      '${p.title.replace(/'/g, "''")}',
      '${p.description.replace(/'/g, "''")}',
      '${p.image_url}',
      ${p.project_url ? `'${p.project_url}'` : 'NULL'},
      ${p.github_url ? `'${p.github_url}'` : 'NULL'},
      ARRAY[${p.technologies.map(t => `'${t}'`).join(',')}],
      ${p.featured},
      ${p.display_order}
    );`);
  });
}

// Import skills
if (data.skills) {
  data.skills.forEach(s => {
    console.log(`INSERT INTO skills (name, category, proficiency, icon, display_order) VALUES (
      '${s.name.replace(/'/g, "''")}',
      '${s.category}',
      ${s.proficiency},
      ${s.icon ? `'${s.icon}'` : 'NULL'},
      ${s.display_order}
    );`);
  });
}
EOF

# Execute SQL
psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -f "$TEMP_SQL"

# Clean up
rm "$TEMP_SQL"

echo "Import completed!"
```

### Import Uploaded Files

```bash
#!/bin/bash
# File: import-uploads.sh

ARCHIVE_FILE="$1"
UPLOAD_DIR="./uploads"

if [ -z "$ARCHIVE_FILE" ] || [ ! -f "$ARCHIVE_FILE" ]; then
    echo "Usage: $0 <archive_file>"
    echo "Example: $0 uploads_20240115_120000.tar.gz"
    exit 1
fi

echo "Restoring uploaded files from: $ARCHIVE_FILE"

# Create backup of current uploads
if [ -d "$UPLOAD_DIR" ]; then
    echo "Creating backup of current uploads..."
    mv "$UPLOAD_DIR" "${UPLOAD_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
fi

# Extract archive
tar -xzf "$ARCHIVE_FILE" -C "$(dirname $UPLOAD_DIR)"

if [ $? -eq 0 ]; then
    echo "✅ Upload files restored successfully!"
else
    echo "❌ ERROR: Failed to restore upload files"
    exit 1
fi
```

### Merge Data (Avoid Duplicates)

```bash
#!/bin/bash
# File: merge-data.sh
# Import data while avoiding duplicates

DB_USER="portfolio_user"
DB_HOST="localhost"
DB_NAME="portfolio"
IMPORT_FILE="$1"

if [ -z "$IMPORT_FILE" ]; then
    echo "Usage: $0 <csv_file>"
    exit 1
fi

echo "Merging data from: $IMPORT_FILE"

# Example: Merge projects (update if exists, insert if new)
psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" << EOF
CREATE TEMP TABLE temp_projects (LIKE projects INCLUDING ALL);

COPY temp_projects(id, title, description, image_url, project_url, github_url, 
                   technologies, featured, display_order, created_at, updated_at)
FROM '$IMPORT_FILE' WITH CSV HEADER;

-- Update existing records
UPDATE projects p
SET 
  title = tp.title,
  description = tp.description,
  image_url = tp.image_url,
  project_url = tp.project_url,
  github_url = tp.github_url,
  technologies = tp.technologies,
  featured = tp.featured,
  display_order = tp.display_order,
  updated_at = NOW()
FROM temp_projects tp
WHERE p.id = tp.id;

-- Insert new records
INSERT INTO projects (title, description, image_url, project_url, github_url, 
                     technologies, featured, display_order, created_at, updated_at)
SELECT title, description, image_url, project_url, github_url, 
       technologies, featured, display_order, created_at, updated_at
FROM temp_projects tp
WHERE NOT EXISTS (SELECT 1 FROM projects p WHERE p.id = tp.id);

DROP TABLE temp_projects;
EOF

echo "Merge completed!"
```


## Automated Backup Setup

### Cron Jobs (Linux/macOS)

#### Daily Database Backup

```bash
# Edit crontab
crontab -e

# Add daily backup at 2:00 AM
0 2 * * * /home/portfolio/scripts/backup-database.sh >> /home/portfolio/logs/backup.log 2>&1

# Add weekly backup at 3:00 AM on Sundays
0 3 * * 0 /home/portfolio/scripts/backup-database.sh weekly >> /home/portfolio/logs/backup.log 2>&1

# Add monthly backup at 4:00 AM on the 1st
0 4 1 * * /home/portfolio/scripts/backup-database.sh monthly >> /home/portfolio/logs/backup.log 2>&1

# Backup uploaded files daily at 3:00 AM
0 3 * * * /home/portfolio/scripts/export-uploads.sh >> /home/portfolio/logs/backup.log 2>&1
```

#### View Cron Jobs

```bash
# List current cron jobs
crontab -l

# View cron log
grep CRON /var/log/syslog
```

### Systemd Timer (Linux)

Create a systemd service and timer for more control:

#### Create Service File

```bash
# Create service file
sudo nano /etc/systemd/system/portfolio-backup.service
```

Add:

```ini
[Unit]
Description=Portfolio Database Backup
After=postgresql.service

[Service]
Type=oneshot
User=portfolio
ExecStart=/home/portfolio/scripts/backup-database.sh
StandardOutput=append:/home/portfolio/logs/backup.log
StandardError=append:/home/portfolio/logs/backup.log
```

#### Create Timer File

```bash
# Create timer file
sudo nano /etc/systemd/system/portfolio-backup.timer
```

Add:

```ini
[Unit]
Description=Portfolio Database Backup Timer
Requires=portfolio-backup.service

[Timer]
OnCalendar=daily
OnCalendar=02:00
Persistent=true

[Install]
WantedBy=timers.target
```

#### Enable and Start Timer

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable timer
sudo systemctl enable portfolio-backup.timer

# Start timer
sudo systemctl start portfolio-backup.timer

# Check timer status
sudo systemctl status portfolio-backup.timer

# List all timers
sudo systemctl list-timers

# Manually trigger backup
sudo systemctl start portfolio-backup.service
```

### Windows Task Scheduler

#### Create Backup Script (PowerShell)

```powershell
# File: backup-database.ps1

$BackupDir = "C:\portfolio\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\portfolio_$Timestamp.sql"
$DatabaseUrl = $env:DATABASE_URL

# Create backup directory
New-Item -ItemType Directory -Force -Path $BackupDir

# Run pg_dump
& "C:\Program Files\PostgreSQL\14\bin\pg_dump.exe" $DatabaseUrl | Out-File -FilePath $BackupFile

# Compress backup
Compress-Archive -Path $BackupFile -DestinationPath "$BackupFile.zip"
Remove-Item $BackupFile

# Delete old backups (older than 30 days)
Get-ChildItem -Path $BackupDir -Filter "*.zip" | 
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | 
    Remove-Item

Write-Host "Backup completed: $BackupFile.zip"
```

#### Schedule with Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Name: "Portfolio Database Backup"
4. Trigger: Daily at 2:00 AM
5. Action: Start a program
   - Program: `powershell.exe`
   - Arguments: `-File C:\portfolio\scripts\backup-database.ps1`
6. Finish

### Cloud Backup Automation

#### AWS S3 Backup

```bash
#!/bin/bash
# File: backup-to-s3.sh

BACKUP_DIR="/home/portfolio/backups/daily"
S3_BUCKET="s3://my-portfolio-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="portfolio_${TIMESTAMP}.sql.gz"

# Create local backup
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "$S3_BUCKET/daily/"

# Upload to S3 with lifecycle policy (auto-delete after 30 days)
aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "$S3_BUCKET/daily/" \
    --storage-class STANDARD_IA

# Keep weekly backups
if [ $(date +%u) -eq 7 ]; then
    aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "$S3_BUCKET/weekly/"
fi

# Keep monthly backups
if [ $(date +%d) -eq 01 ]; then
    aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "$S3_BUCKET/monthly/"
fi

echo "Backup uploaded to S3: $BACKUP_FILE"
```

#### Google Cloud Storage Backup

```bash
#!/bin/bash
# File: backup-to-gcs.sh

BACKUP_DIR="/home/portfolio/backups/daily"
GCS_BUCKET="gs://my-portfolio-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="portfolio_${TIMESTAMP}.sql.gz"

# Create local backup
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# Upload to Google Cloud Storage
gsutil cp "$BACKUP_DIR/$BACKUP_FILE" "$GCS_BUCKET/daily/"

echo "Backup uploaded to GCS: $BACKUP_FILE"
```

#### Backblaze B2 Backup

```bash
#!/bin/bash
# File: backup-to-b2.sh

BACKUP_DIR="/home/portfolio/backups/daily"
B2_BUCKET="my-portfolio-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="portfolio_${TIMESTAMP}.sql.gz"

# Create local backup
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# Upload to Backblaze B2
b2 upload-file "$B2_BUCKET" "$BACKUP_DIR/$BACKUP_FILE" "daily/$BACKUP_FILE"

echo "Backup uploaded to B2: $BACKUP_FILE"
```

### Backup Monitoring

#### Email Notifications

```bash
#!/bin/bash
# File: backup-with-notification.sh

BACKUP_SCRIPT="/home/portfolio/scripts/backup-database.sh"
EMAIL="admin@example.com"

# Run backup
$BACKUP_SCRIPT

# Check exit code
if [ $? -eq 0 ]; then
    echo "Backup completed successfully" | mail -s "✅ Portfolio Backup Success" $EMAIL
else
    echo "Backup failed! Please check logs." | mail -s "❌ Portfolio Backup Failed" $EMAIL
fi
```

#### Slack Notifications

```bash
#!/bin/bash
# File: backup-with-slack.sh

SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
BACKUP_SCRIPT="/home/portfolio/scripts/backup-database.sh"

# Run backup
$BACKUP_SCRIPT

# Check exit code and send notification
if [ $? -eq 0 ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"✅ Portfolio database backup completed successfully"}' \
        $SLACK_WEBHOOK
else
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"❌ Portfolio database backup FAILED! Check logs immediately."}' \
        $SLACK_WEBHOOK
fi
```

### Backup Health Checks

```bash
#!/bin/bash
# File: verify-backups.sh

BACKUP_DIR="/home/portfolio/backups/daily"
MAX_AGE_HOURS=26  # Alert if no backup in last 26 hours

# Find most recent backup
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ")

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ ERROR: No backups found in $BACKUP_DIR"
    exit 1
fi

# Check backup age
BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 3600 ))

if [ $BACKUP_AGE -gt $MAX_AGE_HOURS ]; then
    echo "⚠️  WARNING: Latest backup is $BACKUP_AGE hours old"
    echo "Latest backup: $LATEST_BACKUP"
    exit 1
else
    echo "✅ Backup is current (${BACKUP_AGE} hours old)"
    echo "Latest backup: $LATEST_BACKUP"
fi

# Verify backup is not corrupted
echo "Verifying backup integrity..."
gunzip -t "$LATEST_BACKUP"

if [ $? -eq 0 ]; then
    echo "✅ Backup file is valid"
else
    echo "❌ ERROR: Backup file is corrupted!"
    exit 1
fi
```


## Disaster Recovery

### Disaster Recovery Plan

A comprehensive disaster recovery plan ensures business continuity in case of catastrophic failures.

#### Recovery Time Objective (RTO)

**RTO**: Maximum acceptable time to restore service after a disaster

Recommended targets:
- **Critical Production**: 1-4 hours
- **Non-Critical Production**: 24 hours
- **Development**: 48 hours

#### Recovery Point Objective (RPO)

**RPO**: Maximum acceptable data loss measured in time

Recommended targets:
- **Critical Production**: 1 hour (hourly backups)
- **Non-Critical Production**: 24 hours (daily backups)
- **Development**: 7 days (weekly backups)

### Disaster Scenarios and Recovery Procedures

#### Scenario 1: Database Corruption

**Symptoms**:
- Application errors accessing database
- PostgreSQL crashes or won't start
- Data inconsistencies

**Recovery Steps**:

1. **Stop the application**:
   ```bash
   pm2 stop portfolio
   ```

2. **Assess the damage**:
   ```bash
   # Check PostgreSQL logs
   sudo tail -f /var/log/postgresql/postgresql-14-main.log
   
   # Try to connect
   psql -U portfolio_user -d portfolio -h localhost
   ```

3. **Restore from most recent backup**:
   ```bash
   # Create new database
   createdb -U postgres portfolio_new
   
   # Restore backup
   gunzip -c /home/portfolio/backups/daily/portfolio_latest.sql.gz | \
       psql -U postgres -d portfolio_new
   
   # Verify data
   psql -U postgres -d portfolio_new -c "SELECT COUNT(*) FROM projects;"
   ```

4. **Switch to restored database**:
   ```bash
   # Rename databases
   psql -U postgres -c "ALTER DATABASE portfolio RENAME TO portfolio_corrupted;"
   psql -U postgres -c "ALTER DATABASE portfolio_new RENAME TO portfolio;"
   ```

5. **Restart application**:
   ```bash
   pm2 start portfolio
   ```

6. **Verify functionality**:
   ```bash
   curl https://yourdomain.com/api/health
   ```

**Estimated Recovery Time**: 30-60 minutes

---

#### Scenario 2: Complete Server Failure

**Symptoms**:
- Server is unreachable
- Hardware failure
- Data center outage

**Recovery Steps**:

1. **Provision new server**:
   - Deploy new VPS or cloud instance
   - Install required software (Node.js, PostgreSQL, Nginx)

2. **Restore database**:
   ```bash
   # Download backup from cloud storage
   aws s3 cp s3://my-backups/portfolio_latest.sql.gz .
   
   # Create database
   createdb portfolio
   
   # Restore
   gunzip -c portfolio_latest.sql.gz | psql -d portfolio
   ```

3. **Deploy application**:
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production values
   
   # Start with PM2
   pm2 start ecosystem.config.js
   ```

4. **Restore uploaded files**:
   ```bash
   # Download from cloud storage
   aws s3 sync s3://my-backups/uploads/ ./uploads/
   ```

5. **Configure Nginx and SSL**:
   ```bash
   # Copy Nginx configuration
   sudo cp nginx.conf /etc/nginx/sites-available/portfolio
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   
   # Obtain SSL certificate
   sudo certbot --nginx -d yourdomain.com
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

6. **Update DNS** (if IP changed):
   - Point domain to new server IP
   - Wait for DNS propagation

**Estimated Recovery Time**: 2-4 hours

---

#### Scenario 3: Accidental Data Deletion

**Symptoms**:
- User reports missing data
- Projects, skills, or content deleted accidentally

**Recovery Steps**:

1. **Identify what was deleted and when**:
   ```bash
   # Check application logs
   pm2 logs portfolio --lines 1000 | grep DELETE
   ```

2. **Find appropriate backup**:
   ```bash
   # List backups
   ls -lh /home/portfolio/backups/daily/
   
   # Choose backup from before deletion
   BACKUP_FILE="/home/portfolio/backups/daily/portfolio_20240115_020000.sql.gz"
   ```

3. **Restore to temporary database**:
   ```bash
   # Create temporary database
   createdb portfolio_recovery
   
   # Restore backup
   gunzip -c $BACKUP_FILE | psql -d portfolio_recovery
   ```

4. **Extract deleted data**:
   ```bash
   # Export deleted records
   psql -d portfolio_recovery -c "
   COPY (SELECT * FROM projects WHERE id IN (1, 2, 3))
   TO '/tmp/deleted_projects.csv' WITH CSV HEADER;
   "
   ```

5. **Import into production database**:
   ```bash
   # Import recovered data
   psql -d portfolio -c "
   COPY projects FROM '/tmp/deleted_projects.csv' WITH CSV HEADER;
   "
   ```

6. **Verify recovery**:
   ```bash
   # Check data is restored
   psql -d portfolio -c "SELECT id, title FROM projects WHERE id IN (1, 2, 3);"
   ```

7. **Clean up**:
   ```bash
   # Drop temporary database
   dropdb portfolio_recovery
   rm /tmp/deleted_projects.csv
   ```

**Estimated Recovery Time**: 15-30 minutes

---

#### Scenario 4: Ransomware Attack

**Symptoms**:
- Files encrypted
- Ransom note displayed
- Database inaccessible

**Recovery Steps**:

1. **Isolate the server immediately**:
   ```bash
   # Disconnect from network
   sudo ip link set eth0 down
   
   # Or shutdown
   sudo shutdown -h now
   ```

2. **Do NOT pay the ransom**

3. **Assess the damage**:
   - Determine what was encrypted
   - Check if backups are affected
   - Verify off-site backups are intact

4. **Provision clean server**:
   - Deploy new server from scratch
   - Do NOT restore from potentially infected backups

5. **Restore from verified clean backup**:
   ```bash
   # Use backup from before infection
   # Verify backup date is before attack
   
   # Restore database
   gunzip -c clean_backup.sql.gz | psql -d portfolio
   
   # Restore files
   tar -xzf clean_uploads.tar.gz
   ```

6. **Implement security measures**:
   ```bash
   # Update all software
   sudo apt update && sudo apt upgrade -y
   
   # Change all passwords
   # Rotate all secrets
   # Enable 2FA
   # Review access logs
   ```

7. **Monitor for suspicious activity**:
   ```bash
   # Check for unauthorized access
   sudo last
   sudo lastb
   
   # Review logs
   sudo journalctl -xe
   ```

**Estimated Recovery Time**: 4-8 hours

---

### Disaster Recovery Checklist

#### Preparation (Do Now)

- [ ] Set up automated daily backups
- [ ] Configure off-site backup storage
- [ ] Test backup restoration monthly
- [ ] Document recovery procedures
- [ ] Store credentials securely (password manager)
- [ ] Maintain list of critical contacts
- [ ] Keep infrastructure documentation updated
- [ ] Set up monitoring and alerts
- [ ] Create runbook for common scenarios
- [ ] Train team on recovery procedures

#### During Disaster

- [ ] Assess the situation calmly
- [ ] Notify stakeholders
- [ ] Stop the application if needed
- [ ] Isolate affected systems
- [ ] Document everything
- [ ] Follow recovery procedures
- [ ] Verify each step before proceeding
- [ ] Keep communication channels open

#### After Recovery

- [ ] Verify all functionality
- [ ] Test critical user flows
- [ ] Monitor for issues
- [ ] Document what happened
- [ ] Conduct post-mortem
- [ ] Update recovery procedures
- [ ] Implement preventive measures
- [ ] Communicate with users

### Emergency Contacts

Keep this information readily accessible:

```
Database Administrator: [Name] - [Phone] - [Email]
System Administrator: [Name] - [Phone] - [Email]
Hosting Provider Support: [Phone] - [Email] - [Portal URL]
DNS Provider Support: [Phone] - [Email]
Backup Storage Support: [Phone] - [Email]
```

### Recovery Testing Schedule

Regular testing ensures your recovery procedures work:

| Test Type | Frequency | Description |
|-----------|-----------|-------------|
| Backup Verification | Daily | Automated check that backups completed |
| Restore Test | Monthly | Restore backup to test environment |
| Full DR Drill | Quarterly | Complete disaster recovery simulation |
| Documentation Review | Quarterly | Update procedures and contacts |


## Backup Verification

Regular verification ensures your backups are valid and restorable.

### Automated Verification Script

```bash
#!/bin/bash
# File: verify-backup.sh

BACKUP_FILE="$1"
TEST_DB="portfolio_verify_test"

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

echo "Verifying backup: $BACKUP_FILE"

# Step 1: Check file integrity
echo "1. Checking file integrity..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -t "$BACKUP_FILE"
    if [ $? -ne 0 ]; then
        echo "❌ FAILED: Backup file is corrupted"
        exit 1
    fi
    echo "✅ File integrity check passed"
else
    echo "✅ Uncompressed file, skipping integrity check"
fi

# Step 2: Check file size
echo "2. Checking file size..."
FILE_SIZE=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE")
MIN_SIZE=1024  # 1KB minimum

if [ $FILE_SIZE -lt $MIN_SIZE ]; then
    echo "❌ FAILED: Backup file is too small ($FILE_SIZE bytes)"
    exit 1
fi
echo "✅ File size check passed ($(numfmt --to=iec-i --suffix=B $FILE_SIZE))"

# Step 3: Create test database
echo "3. Creating test database..."
dropdb --if-exists $TEST_DB 2>/dev/null
createdb $TEST_DB

if [ $? -ne 0 ]; then
    echo "❌ FAILED: Could not create test database"
    exit 1
fi
echo "✅ Test database created"

# Step 4: Restore backup to test database
echo "4. Restoring backup to test database..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | psql -d $TEST_DB -q
else
    psql -d $TEST_DB -q < "$BACKUP_FILE"
fi

if [ $? -ne 0 ]; then
    echo "❌ FAILED: Could not restore backup"
    dropdb $TEST_DB
    exit 1
fi
echo "✅ Backup restored successfully"

# Step 5: Verify table structure
echo "5. Verifying table structure..."
TABLES=$(psql -d $TEST_DB -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

if [ $TABLES -lt 5 ]; then
    echo "❌ FAILED: Expected at least 5 tables, found $TABLES"
    dropdb $TEST_DB
    exit 1
fi
echo "✅ Table structure verified ($TABLES tables found)"

# Step 6: Verify data exists
echo "6. Verifying data exists..."
USERS=$(psql -d $TEST_DB -t -c "SELECT COUNT(*) FROM users;")
PROJECTS=$(psql -d $TEST_DB -t -c "SELECT COUNT(*) FROM projects;")
SKILLS=$(psql -d $TEST_DB -t -c "SELECT COUNT(*) FROM skills;")

echo "   - Users: $USERS"
echo "   - Projects: $PROJECTS"
echo "   - Skills: $SKILLS"

if [ $USERS -eq 0 ]; then
    echo "⚠️  WARNING: No users found in backup"
fi

echo "✅ Data verification completed"

# Step 7: Clean up
echo "7. Cleaning up..."
dropdb $TEST_DB
echo "✅ Test database removed"

echo ""
echo "========================================="
echo "✅ BACKUP VERIFICATION SUCCESSFUL"
echo "========================================="
echo "Backup file: $BACKUP_FILE"
echo "File size: $(numfmt --to=iec-i --suffix=B $FILE_SIZE)"
echo "Tables: $TABLES"
echo "Records: Users=$USERS, Projects=$PROJECTS, Skills=$SKILLS"
echo "========================================="

exit 0
```

### Monthly Restore Test

```bash
#!/bin/bash
# File: monthly-restore-test.sh

BACKUP_DIR="/home/portfolio/backups/daily"
TEST_DB="portfolio_monthly_test"
REPORT_FILE="/home/portfolio/logs/restore_test_$(date +%Y%m%d).log"

echo "Monthly Restore Test - $(date)" | tee $REPORT_FILE
echo "=========================================" | tee -a $REPORT_FILE

# Find most recent backup
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ")

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ ERROR: No backup found" | tee -a $REPORT_FILE
    exit 1
fi

echo "Testing backup: $LATEST_BACKUP" | tee -a $REPORT_FILE

# Run verification
./verify-backup.sh "$LATEST_BACKUP" | tee -a $REPORT_FILE

# Send email notification
if [ $? -eq 0 ]; then
    echo "✅ Monthly restore test PASSED" | mail -s "Monthly Restore Test: SUCCESS" admin@example.com
else
    echo "❌ Monthly restore test FAILED" | mail -s "Monthly Restore Test: FAILED" admin@example.com
fi
```

### Backup Integrity Monitoring

```bash
#!/bin/bash
# File: monitor-backup-integrity.sh

BACKUP_DIR="/home/portfolio/backups"
ALERT_EMAIL="admin@example.com"

echo "Backup Integrity Monitor - $(date)"
echo "========================================="

# Check daily backups
echo "Checking daily backups..."
DAILY_COUNT=$(find "$BACKUP_DIR/daily" -name "*.sql.gz" -mtime -1 | wc -l)

if [ $DAILY_COUNT -eq 0 ]; then
    echo "❌ ALERT: No daily backup found in last 24 hours" | mail -s "Backup Alert: Missing Daily Backup" $ALERT_EMAIL
else
    echo "✅ Daily backup exists"
fi

# Check weekly backups
echo "Checking weekly backups..."
WEEKLY_COUNT=$(find "$BACKUP_DIR/weekly" -name "*.sql.gz" -mtime -8 | wc -l)

if [ $WEEKLY_COUNT -eq 0 ]; then
    echo "⚠️  WARNING: No weekly backup found in last 8 days"
else
    echo "✅ Weekly backup exists"
fi

# Check backup sizes
echo "Checking backup sizes..."
LATEST_BACKUP=$(find "$BACKUP_DIR/daily" -name "*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ")

if [ -n "$LATEST_BACKUP" ]; then
    CURRENT_SIZE=$(stat -c%s "$LATEST_BACKUP")
    PREVIOUS_BACKUP=$(find "$BACKUP_DIR/daily" -name "*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -2 | head -1 | cut -f2- -d" ")
    
    if [ -n "$PREVIOUS_BACKUP" ]; then
        PREVIOUS_SIZE=$(stat -c%s "$PREVIOUS_BACKUP")
        SIZE_DIFF=$(( (CURRENT_SIZE - PREVIOUS_SIZE) * 100 / PREVIOUS_SIZE ))
        
        if [ $SIZE_DIFF -lt -50 ]; then
            echo "❌ ALERT: Backup size decreased by more than 50%" | mail -s "Backup Alert: Size Anomaly" $ALERT_EMAIL
        else
            echo "✅ Backup size is normal"
        fi
    fi
fi

# Check disk space
echo "Checking disk space..."
DISK_USAGE=$(df -h "$BACKUP_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $DISK_USAGE -gt 90 ]; then
    echo "❌ ALERT: Backup disk usage is at ${DISK_USAGE}%" | mail -s "Backup Alert: Low Disk Space" $ALERT_EMAIL
else
    echo "✅ Disk space is adequate (${DISK_USAGE}% used)"
fi

echo "========================================="
echo "Integrity check completed"
```


## Best Practices

### Backup Best Practices

1. **Follow the 3-2-1 Rule**
   - Keep **3** copies of your data
   - Store on **2** different media types
   - Keep **1** copy off-site

2. **Automate Everything**
   - Automated backups reduce human error
   - Schedule backups during low-traffic periods
   - Automate verification and monitoring

3. **Test Regularly**
   - Test restores monthly at minimum
   - Verify backup integrity automatically
   - Document and time your recovery procedures

4. **Encrypt Sensitive Backups**
   ```bash
   # Encrypt backup with GPG
   pg_dump $DATABASE_URL | gzip | gpg --encrypt --recipient admin@example.com > backup.sql.gz.gpg
   
   # Decrypt and restore
   gpg --decrypt backup.sql.gz.gpg | gunzip | psql $DATABASE_URL
   ```

5. **Version Your Backups**
   - Keep multiple versions (daily, weekly, monthly)
   - Don't overwrite backups immediately
   - Implement retention policies

6. **Monitor Backup Health**
   - Set up alerts for failed backups
   - Monitor backup sizes for anomalies
   - Track backup completion times

7. **Document Everything**
   - Document backup procedures
   - Document restore procedures
   - Keep emergency contact information updated

8. **Secure Backup Storage**
   - Restrict access to backup files
   - Use strong passwords for backup encryption
   - Audit backup access regularly

9. **Separate Backup Infrastructure**
   - Don't store backups only on the same server
   - Use different cloud providers for redundancy
   - Protect against correlated failures

10. **Include Configuration**
    - Back up environment variables (securely)
    - Back up server configurations
    - Back up deployment scripts

### Security Best Practices

1. **Protect Backup Files**
   ```bash
   # Set restrictive permissions
   chmod 600 backup.sql.gz
   chown portfolio:portfolio backup.sql.gz
   ```

2. **Encrypt Backups in Transit**
   ```bash
   # Use SCP with encryption
   scp backup.sql.gz user@backup-server:/backups/
   
   # Use rsync over SSH
   rsync -avz -e ssh backup.sql.gz user@backup-server:/backups/
   ```

3. **Rotate Credentials**
   - Change database passwords periodically
   - Rotate backup encryption keys
   - Update access credentials regularly

4. **Audit Backup Access**
   ```bash
   # Log backup operations
   echo "$(date): Backup created by $(whoami)" >> /var/log/backup-audit.log
   ```

5. **Sanitize Sensitive Data**
   ```bash
   # Remove sensitive data from backups if needed
   pg_dump $DATABASE_URL | \
       sed 's/password_hash/REDACTED/g' | \
       gzip > sanitized_backup.sql.gz
   ```

### Performance Best Practices

1. **Schedule During Off-Peak Hours**
   - Run backups when traffic is lowest
   - Typically 2-4 AM local time
   - Avoid peak business hours

2. **Use Compression**
   ```bash
   # Compression reduces storage and transfer time
   pg_dump $DATABASE_URL | gzip -9 > backup.sql.gz
   ```

3. **Parallel Backups for Large Databases**
   ```bash
   # Use custom format with parallel jobs
   pg_dump -Fc -j 4 $DATABASE_URL -f backup.dump
   ```

4. **Incremental Backups for Very Large Databases**
   ```bash
   # Set up WAL archiving for point-in-time recovery
   # Edit postgresql.conf:
   # wal_level = replica
   # archive_mode = on
   # archive_command = 'cp %p /backup/wal/%f'
   ```

5. **Monitor Backup Performance**
   ```bash
   # Time backup operations
   time pg_dump $DATABASE_URL | gzip > backup.sql.gz
   ```

### Compliance Best Practices

1. **Data Retention Policies**
   - Define how long to keep backups
   - Comply with legal requirements (GDPR, HIPAA, etc.)
   - Document retention policies

2. **Data Privacy**
   - Encrypt backups containing personal data
   - Limit access to authorized personnel
   - Implement data anonymization where appropriate

3. **Audit Trail**
   - Log all backup and restore operations
   - Track who accessed backups
   - Maintain records for compliance

4. **Right to Erasure (GDPR)**
   ```bash
   # Remove user data from backups
   # This is complex - consider:
   # - Marking backups containing deleted user data
   # - Implementing backup expiration
   # - Using point-in-time recovery instead of full backups
   ```

### Cost Optimization

1. **Lifecycle Policies**
   ```bash
   # AWS S3 lifecycle policy example
   aws s3api put-bucket-lifecycle-configuration \
       --bucket my-backups \
       --lifecycle-configuration file://lifecycle.json
   
   # lifecycle.json:
   # {
   #   "Rules": [{
   #     "Id": "Move to Glacier after 30 days",
   #     "Status": "Enabled",
   #     "Transitions": [{
   #       "Days": 30,
   #       "StorageClass": "GLACIER"
   #     }],
   #     "Expiration": {
   #       "Days": 365
   #     }
   #   }]
   # }
   ```

2. **Compression**
   - Use maximum compression for long-term storage
   - Balance compression time vs. storage cost

3. **Deduplication**
   - Use incremental backups to reduce storage
   - Implement deduplication at storage level

4. **Storage Tiering**
   - Hot storage: Recent backups (fast access)
   - Warm storage: Weekly backups (moderate access)
   - Cold storage: Monthly backups (archive)


## Troubleshooting

### Common Backup Issues

#### Issue: pg_dump fails with "permission denied"

**Cause**: Insufficient database permissions

**Solution**:
```bash
# Grant necessary permissions
psql -U postgres -d portfolio -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO portfolio_user;"
psql -U postgres -d portfolio -c "GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO portfolio_user;"

# Or use postgres superuser for backups
pg_dump -U postgres -d portfolio > backup.sql
```

---

#### Issue: Backup file is empty or very small

**Cause**: Database connection failed or database is empty

**Solution**:
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check if tables exist
psql $DATABASE_URL -c "\dt"

# Check table row counts
psql $DATABASE_URL -c "
SELECT schemaname, tablename, n_live_tup 
FROM pg_stat_user_tables 
ORDER BY n_live_tup DESC;
"

# Verify backup command
pg_dump $DATABASE_URL 2>&1 | tee backup.log
```

---

#### Issue: "out of memory" during backup

**Cause**: Large database or insufficient system memory

**Solution**:
```bash
# Use custom format (more memory efficient)
pg_dump -Fc $DATABASE_URL -f backup.dump

# Or backup specific tables separately
pg_dump -t large_table $DATABASE_URL > large_table.sql
pg_dump -T large_table $DATABASE_URL > other_tables.sql

# Increase system swap space
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

#### Issue: Backup takes too long

**Cause**: Large database or slow disk I/O

**Solution**:
```bash
# Use parallel dump (custom format only)
pg_dump -Fc -j 4 $DATABASE_URL -f backup.dump

# Exclude large unnecessary tables
pg_dump -T sessions -T logs $DATABASE_URL > backup.sql

# Use faster compression
pg_dump $DATABASE_URL | gzip -1 > backup.sql.gz  # Fast compression

# Or no compression for speed
pg_dump $DATABASE_URL > backup.sql
```

---

#### Issue: Cannot restore - "database is being accessed by other users"

**Cause**: Active connections to the database

**Solution**:
```bash
# Terminate all connections
psql -U postgres -c "
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'portfolio'
  AND pid <> pg_backend_pid();
"

# Then restore
psql -U postgres -d portfolio < backup.sql

# Or restore to a new database
createdb portfolio_new
psql -U postgres -d portfolio_new < backup.sql
```

---

#### Issue: Restore fails with "relation already exists"

**Cause**: Restoring to a database that already has objects

**Solution**:
```bash
# Option 1: Drop and recreate database
dropdb portfolio
createdb portfolio
psql -d portfolio < backup.sql

# Option 2: Use --clean flag with custom format
pg_restore --clean -d portfolio backup.dump

# Option 3: Restore to new database
createdb portfolio_new
psql -d portfolio_new < backup.sql
```

---

#### Issue: Backup script fails silently

**Cause**: Errors not being captured or logged

**Solution**:
```bash
# Add error handling to script
#!/bin/bash
set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# Redirect errors to log
pg_dump $DATABASE_URL 2>&1 | tee backup.log

# Check exit code
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "Backup failed!" | mail -s "Backup Error" admin@example.com
    exit 1
fi
```

---

#### Issue: Cron job doesn't run

**Cause**: Incorrect cron syntax or environment issues

**Solution**:
```bash
# Check cron logs
grep CRON /var/log/syslog

# Test script manually first
/home/portfolio/scripts/backup-database.sh

# Use full paths in cron
0 2 * * * /usr/bin/pg_dump $DATABASE_URL > /home/portfolio/backups/backup.sql 2>&1

# Set environment variables in crontab
0 2 * * * export DATABASE_URL="postgresql://..."; /home/portfolio/scripts/backup-database.sh

# Or source .env file
0 2 * * * cd /home/portfolio && source .env && ./scripts/backup-database.sh
```

---

#### Issue: Backup file is corrupted

**Cause**: Disk errors, interrupted backup, or storage issues

**Solution**:
```bash
# Test file integrity
gunzip -t backup.sql.gz

# If corrupted, use previous backup
ls -lt /home/portfolio/backups/

# Check disk for errors
sudo fsck /dev/sda1

# Verify backup immediately after creation
pg_dump $DATABASE_URL | tee >(gzip > backup.sql.gz) | psql -d test_db
```

---

### Common Restore Issues

#### Issue: Restore is very slow

**Cause**: Large database or slow disk I/O

**Solution**:
```bash
# Use parallel restore (custom format only)
pg_restore -j 4 -d portfolio backup.dump

# Disable triggers during restore
pg_restore --disable-triggers -d portfolio backup.dump

# Increase maintenance_work_mem
psql -d portfolio -c "SET maintenance_work_mem = '1GB';"

# Drop indexes before restore, recreate after
# (Manual process, requires planning)
```

---

#### Issue: Foreign key constraint violations during restore

**Cause**: Data restored in wrong order

**Solution**:
```bash
# Disable triggers during restore
pg_restore --disable-triggers -d portfolio backup.dump

# Or restore with --no-owner --no-privileges
pg_restore --no-owner --no-privileges -d portfolio backup.dump

# For SQL dumps, wrap in transaction
psql -d portfolio << EOF
BEGIN;
SET CONSTRAINTS ALL DEFERRED;
\i backup.sql
COMMIT;
EOF
```

---

#### Issue: "role does not exist" during restore

**Cause**: Backup contains role references that don't exist

**Solution**:
```bash
# Create missing roles
createuser portfolio_user

# Or restore without owner information
pg_restore --no-owner -d portfolio backup.dump

# For SQL dumps, edit the file
sed -i 's/OWNER TO old_user/OWNER TO new_user/g' backup.sql
```

---

### Getting Help

If you encounter issues not covered here:

1. **Check PostgreSQL logs**:
   ```bash
   sudo tail -f /var/log/postgresql/postgresql-14-main.log
   ```

2. **Check application logs**:
   ```bash
   pm2 logs portfolio
   ```

3. **Test database connectivity**:
   ```bash
   psql $DATABASE_URL -c "SELECT version();"
   ```

4. **Verify disk space**:
   ```bash
   df -h
   ```

5. **Check backup file permissions**:
   ```bash
   ls -lh /path/to/backup.sql.gz
   ```

6. **Consult PostgreSQL documentation**:
   - [pg_dump documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
   - [pg_restore documentation](https://www.postgresql.org/docs/current/app-pgrestore.html)

---

## Additional Resources

### Documentation

- [PostgreSQL Backup and Restore](https://www.postgresql.org/docs/current/backup.html)
- [pg_dump Manual](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore Manual](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [Continuous Archiving and Point-in-Time Recovery](https://www.postgresql.org/docs/current/continuous-archiving.html)

### Tools

- **pgBackRest**: Advanced backup and restore tool
- **Barman**: Backup and Recovery Manager for PostgreSQL
- **WAL-E**: Continuous archiving for PostgreSQL
- **pg_probackup**: Backup and recovery manager

### Cloud Backup Services

- **AWS RDS Automated Backups**: Built-in backup for RDS PostgreSQL
- **Google Cloud SQL Backups**: Automated backups for Cloud SQL
- **Azure Database for PostgreSQL Backup**: Automated backup service
- **Render PostgreSQL Backups**: Automatic daily backups
- **Railway PostgreSQL Backups**: Automatic backup feature

---

## Summary

This document covered:

✅ **Backup Strategy**: Recommended schedules and retention policies
✅ **PostgreSQL Backup**: Multiple methods using pg_dump and platform-specific tools
✅ **Database Restore**: Step-by-step restore procedures with safety checks
✅ **User Data Export**: Exporting data in CSV and JSON formats
✅ **User Data Import**: Importing and merging data
✅ **Automated Backups**: Cron jobs, systemd timers, and cloud automation
✅ **Disaster Recovery**: Comprehensive recovery procedures for various scenarios
✅ **Backup Verification**: Automated testing and monitoring
✅ **Best Practices**: Security, performance, and compliance guidelines
✅ **Troubleshooting**: Solutions for common backup and restore issues

### Quick Reference

**Create Backup**:
```bash
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
```

**Restore Backup**:
```bash
gunzip -c backup.sql.gz | psql $DATABASE_URL
```

**Verify Backup**:
```bash
gunzip -t backup.sql.gz && echo "Backup is valid"
```

**Automate Daily Backups**:
```bash
# Add to crontab
0 2 * * * /home/portfolio/scripts/backup-database.sh
```

---

**Remember**: The best backup is the one you test regularly. Schedule monthly restore tests to ensure your disaster recovery procedures work when you need them.

**Last Updated**: 2024
**Version**: 1.0.0

