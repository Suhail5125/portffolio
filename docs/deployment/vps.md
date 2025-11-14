# Deploying to a VPS (Virtual Private Server)

This guide walks you through deploying the portfolio website to a VPS (Virtual Private Server) such as DigitalOcean, Linode, Vultr, or AWS EC2. This approach gives you complete control over your infrastructure and is ideal for production deployments where you need flexibility and customization.

## Prerequisites

Before you begin, ensure you have:

- ✅ A VPS with Ubuntu 20.04+ or Debian 11+ (minimum 1GB RAM, 1 CPU core)
- ✅ Root or sudo access to the server
- ✅ A domain name pointed to your server's IP address
- ✅ SSH access configured
- ✅ Basic familiarity with Linux command line
- ✅ Your portfolio code in a Git repository

## Overview

VPS deployment involves:
1. Server setup and security hardening
2. Installing Node.js, PostgreSQL, and PM2
3. Configuring Nginx as a reverse proxy
4. Deploying the application
5. Setting up SSL with Let's Encrypt
6. Configuring monitoring and logging

## Step 1: Initial Server Setup

### 1.1 Connect to Your Server

```bash
# SSH into your server
ssh root@your-server-ip

# Or if using a non-root user
ssh username@your-server-ip
```

### 1.2 Update System Packages

```bash
# Update package list
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential
```

### 1.3 Create Application User

For security, run the application as a non-root user:

```bash
# Create a new user
sudo adduser portfolio

# Add user to sudo group (optional, for administrative tasks)
sudo usermod -aG sudo portfolio

# Switch to the new user
su - portfolio
```

### 1.4 Configure Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (important - don't lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check firewall status
sudo ufw status
```

## Step 2: Install Node.js

### 2.1 Install Node.js via NodeSource

```bash
# Download and run NodeSource setup script for Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### 2.2 Install PM2 Process Manager

PM2 keeps your application running and restarts it if it crashes:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

## Step 3: Install and Configure PostgreSQL

### 3.1 Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo systemctl status postgresql
```

### 3.2 Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run these commands:
```

```sql
-- Create database
CREATE DATABASE portfolio;

-- Create user with password
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your-secure-password-here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;

-- Grant schema privileges (PostgreSQL 15+)
\c portfolio
GRANT ALL ON SCHEMA public TO portfolio_user;

-- Exit PostgreSQL
\q
```

### 3.3 Configure PostgreSQL for Local Connections

```bash
# Edit pg_hba.conf to allow password authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Find the line:
# local   all             all                                     peer
# Change to:
# local   all             all                                     md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3.4 Test Database Connection

```bash
# Test connection
psql -U portfolio_user -d portfolio -h localhost

# If successful, you'll see the PostgreSQL prompt
# Exit with \q
```

## Step 4: Deploy Application Code

### 4.1 Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone https://github.com/your-username/your-portfolio.git portfolio

# Navigate to project directory
cd portfolio
```

### 4.2 Install Dependencies

```bash
# Install Node.js dependencies
npm install

# This may take a few minutes
```

### 4.3 Create Environment File

```bash
# Create .env file
nano .env
```

Add the following configuration:

```bash
# Database
DATABASE_URL=postgresql://portfolio_user:your-secure-password-here@localhost:5432/portfolio

# Session Secret (generate a random 32+ character string)
SESSION_SECRET=your-super-secret-session-key-min-32-chars-here

# Server
NODE_ENV=production
PORT=5000

# Security
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

**Generate a secure SESSION_SECRET**:
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.4 Build Application

```bash
# Build the application
npm run build

# This compiles TypeScript and builds the frontend
```

### 4.5 Run Database Migrations

```bash
# Push database schema
npm run db:push

# Verify tables were created
psql -U portfolio_user -d portfolio -h localhost -c "\dt"
```

### 4.6 Seed Initial Data (Optional)

```bash
# If you have a seed script
npm run db:seed

# Or manually create admin user through the application
```

## Step 5: Configure PM2

### 5.1 Create PM2 Ecosystem File

```bash
# Create PM2 configuration
nano ecosystem.config.js
```

Add the following configuration:

```javascript
module.exports = {
  apps: [{
    name: 'portfolio',
    script: 'npm',
    args: 'start',
    cwd: '/home/portfolio/portfolio',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/home/portfolio/logs/err.log',
    out_file: '/home/portfolio/logs/out.log',
    log_file: '/home/portfolio/logs/combined.log',
    time: true
  }]
};
```

### 5.2 Create Logs Directory

```bash
# Create logs directory
mkdir -p ~/logs
```

### 5.3 Start Application with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs portfolio

# Monitor in real-time
pm2 monit
```

### 5.4 Configure PM2 Startup

Make PM2 start automatically on server reboot:

```bash
# Generate startup script
pm2 startup

# This will output a command to run with sudo
# Copy and run that command, it will look like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u portfolio --hp /home/portfolio

# Save current PM2 process list
pm2 save
```

### 5.5 Verify Application is Running

```bash
# Test locally
curl http://localhost:5000/api/health

# Should return JSON with status: "healthy"
```

## Step 6: Install and Configure Nginx

### 6.1 Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 6.2 Create Nginx Configuration

```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/portfolio
```

Add the following configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logging
    access_log /var/log/nginx/portfolio_access.log;
    error_log /var/log/nginx/portfolio_error.log;
    
    # Proxy settings
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:5000;
        access_log off;
    }
}
```

**Important**: Replace `yourdomain.com` with your actual domain name.

### 6.3 Enable Site Configuration

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

### 6.4 Temporary HTTP Configuration

Before setting up SSL, temporarily modify the config to work with HTTP:

```bash
# Edit the configuration
sudo nano /etc/nginx/sites-available/portfolio
```

Comment out the HTTPS server block and use only:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Reload Nginx
sudo systemctl reload nginx
```

## Step 7: Configure SSL with Let's Encrypt

### 7.1 Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate

```bash
# Run Certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)
```

Certbot will automatically:
- Obtain SSL certificates
- Configure Nginx with SSL settings
- Set up automatic renewal

### 7.3 Verify SSL Configuration

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Test SSL certificate
curl https://yourdomain.com/api/health
```

### 7.4 Test Automatic Renewal

```bash
# Dry run renewal
sudo certbot renew --dry-run

# If successful, certificates will auto-renew before expiration
```

### 7.5 Check Certificate Expiration

```bash
# View certificate details
sudo certbot certificates
```

Certificates automatically renew 30 days before expiration.

## Step 8: Deployment Script

### 8.1 Create Deployment Script

Create a script to automate future deployments:

```bash
# Create deploy script
nano ~/deploy.sh
```

Add the following:

```bash
#!/bin/bash

# Portfolio Deployment Script
set -e

echo "🚀 Starting deployment..."

# Navigate to project directory
cd ~/portfolio

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:push

# Restart application
echo "🔄 Restarting application..."
pm2 restart portfolio

# Check application status
echo "✅ Checking application status..."
pm2 status portfolio

echo "🎉 Deployment complete!"
echo "🌐 Visit: https://yourdomain.com"
```

### 8.2 Make Script Executable

```bash
# Make script executable
chmod +x ~/deploy.sh
```

### 8.3 Use Deployment Script

```bash
# Run deployment
./deploy.sh
```

## Step 9: Monitoring and Logging

### 9.1 PM2 Monitoring

```bash
# View application status
pm2 status

# View logs
pm2 logs portfolio

# View last 100 lines
pm2 logs portfolio --lines 100

# Monitor resources
pm2 monit

# View detailed info
pm2 info portfolio
```

### 9.2 Nginx Logs

```bash
# View access logs
sudo tail -f /var/log/nginx/portfolio_access.log

# View error logs
sudo tail -f /var/log/nginx/portfolio_error.log

# Search for errors
sudo grep "error" /var/log/nginx/portfolio_error.log
```

### 9.3 System Monitoring

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Or use htop (install first: sudo apt install htop)
htop
```

### 9.4 Database Monitoring

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# View active connections
psql -U portfolio_user -d portfolio -h localhost -c "SELECT count(*) FROM pg_stat_activity;"

# View database size
psql -U portfolio_user -d portfolio -h localhost -c "SELECT pg_size_pretty(pg_database_size('portfolio'));"
```

### 9.5 Set Up Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/portfolio
```

Add:

```
/home/portfolio/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 portfolio portfolio
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 9.6 Configure Monitoring Alerts

Install and configure monitoring tools:

```bash
# Install monitoring tools (optional)
sudo apt install -y monitoring-plugins

# Or use external services:
# - UptimeRobot (https://uptimerobot.com)
# - Pingdom (https://www.pingdom.com)
# - Datadog (https://www.datadog.com)
```

## Step 10: Backup and Recovery

### 10.1 Database Backup Script

```bash
# Create backup script
nano ~/backup-db.sh
```

Add:

```bash
#!/bin/bash

# Database Backup Script
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/portfolio_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
echo "Creating database backup..."
pg_dump -U portfolio_user -h localhost portfolio > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "Backup created: ${BACKUP_FILE}.gz"

# Delete backups older than 30 days
find $BACKUP_DIR -name "portfolio_*.sql.gz" -mtime +30 -delete

echo "Old backups cleaned up"
```

```bash
# Make executable
chmod +x ~/backup-db.sh
```

### 10.2 Schedule Automatic Backups

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/portfolio/backup-db.sh >> /home/portfolio/logs/backup.log 2>&1
```

### 10.3 Restore from Backup

```bash
# Decompress backup
gunzip ~/backups/portfolio_20240115_020000.sql.gz

# Restore database
psql -U portfolio_user -h localhost portfolio < ~/backups/portfolio_20240115_020000.sql
```

### 10.4 Application Backup

```bash
# Backup application files
tar -czf ~/backups/portfolio_app_$(date +%Y%m%d).tar.gz ~/portfolio

# Backup environment file (be careful with this!)
cp ~/portfolio/.env ~/backups/.env.backup
```

## Troubleshooting

### Application Won't Start

**Problem**: PM2 shows application as "errored" or constantly restarting

**Solutions**:

```bash
# Check PM2 logs
pm2 logs portfolio --lines 50

# Common issues:
# 1. Port already in use
sudo lsof -i :5000
# Kill process if needed
sudo kill -9 <PID>

# 2. Database connection failed
# Verify DATABASE_URL in .env
# Test database connection
psql -U portfolio_user -d portfolio -h localhost

# 3. Missing dependencies
cd ~/portfolio
npm install

# 4. Build failed
npm run build

# Restart after fixing
pm2 restart portfolio
```

### Nginx 502 Bad Gateway

**Problem**: Nginx returns 502 error

**Solutions**:

```bash
# Check if application is running
pm2 status

# Check application logs
pm2 logs portfolio

# Verify application is listening on correct port
sudo netstat -tlnp | grep 5000

# Check Nginx error logs
sudo tail -f /var/log/nginx/portfolio_error.log

# Test Nginx configuration
sudo nginx -t

# Restart services
pm2 restart portfolio
sudo systemctl restart nginx
```

### SSL Certificate Issues

**Problem**: SSL certificate not working or expired

**Solutions**:

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# If renewal fails, check Nginx configuration
sudo nginx -t

# Verify domain DNS points to server
dig yourdomain.com

# Check firewall allows HTTPS
sudo ufw status
```

### Database Connection Errors

**Problem**: Application can't connect to database

**Solutions**:

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U portfolio_user -d portfolio -h localhost

# Check pg_hba.conf authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Verify DATABASE_URL in .env
cat ~/portfolio/.env | grep DATABASE_URL

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### High Memory Usage

**Problem**: Server running out of memory

**Solutions**:

```bash
# Check memory usage
free -h

# Check which process uses most memory
ps aux --sort=-%mem | head

# Restart application to free memory
pm2 restart portfolio

# Configure PM2 memory limit
# Edit ecosystem.config.js
max_memory_restart: '400M'

# Consider upgrading server or optimizing application
```

### Disk Space Full

**Problem**: Server running out of disk space

**Solutions**:

```bash
# Check disk usage
df -h

# Find large files
sudo du -h / | sort -rh | head -20

# Clean up common culprits:
# 1. Old logs
sudo journalctl --vacuum-time=7d
pm2 flush

# 2. Old backups
rm ~/backups/portfolio_*.sql.gz.old

# 3. Package manager cache
sudo apt clean
sudo apt autoclean

# 4. Old kernels
sudo apt autoremove
```

### Port Already in Use

**Problem**: Can't start application, port 5000 in use

**Solutions**:

```bash
# Find process using port
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>

# Or change port in .env and ecosystem.config.js
PORT=5001

# Restart application
pm2 restart portfolio
```

## Security Best Practices

### 1. SSH Security

```bash
# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Use SSH keys instead of passwords
# Disable password authentication
# Set: PasswordAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### 2. Firewall Configuration

```bash
# Only allow necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Fail2Ban (Brute Force Protection)

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Regular Updates

```bash
# Update system regularly
sudo apt update && sudo apt upgrade -y

# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 5. Database Security

```bash
# Use strong passwords
# Limit database access to localhost only
# Regular backups
# Keep PostgreSQL updated
sudo apt update && sudo apt upgrade postgresql
```

### 6. Application Security

```bash
# Keep dependencies updated
cd ~/portfolio
npm audit
npm audit fix

# Use environment variables for secrets
# Never commit .env file
# Rotate SESSION_SECRET periodically
```

## Performance Optimization

### 1. Enable Gzip Compression

```bash
# Edit Nginx configuration
sudo nano /etc/nginx/nginx.conf
```

Add in http block:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

### 2. Configure Nginx Caching

```bash
# Add to Nginx configuration
sudo nano /etc/nginx/sites-available/portfolio
```

Add before server block:

```nginx
# Cache configuration
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
```

### 3. Database Connection Pooling

Already configured in the application, but verify settings in your code.

### 4. PM2 Cluster Mode

For multi-core servers:

```javascript
// ecosystem.config.js
instances: 'max', // Use all CPU cores
exec_mode: 'cluster'
```

### 5. Monitor Performance

```bash
# Install monitoring tools
sudo apt install -y sysstat

# View system statistics
sar -u 1 10  # CPU usage
sar -r 1 10  # Memory usage
sar -n DEV 1 10  # Network usage
```

## Scaling

### Vertical Scaling

Upgrade your VPS to a larger instance:
- More CPU cores
- More RAM
- More disk space
- Better network bandwidth

### Horizontal Scaling

For high traffic, consider:
1. **Load Balancer**: Distribute traffic across multiple servers
2. **Database Replication**: Read replicas for better performance
3. **CDN**: CloudFlare or similar for static assets
4. **Caching Layer**: Redis for session storage and caching

## Additional Resources

- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)

## Support

If you encounter issues:

1. Check application logs: `pm2 logs portfolio`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/portfolio_error.log`
3. Check system logs: `sudo journalctl -xe`
4. Test health endpoint: `curl http://localhost:5000/api/health`
5. Verify all services are running: `pm2 status`, `sudo systemctl status nginx postgresql`

## Next Steps

After successful deployment:
1. ✅ Set up monitoring and alerts
2. ✅ Configure automated backups
3. ✅ Test disaster recovery procedure
4. ✅ Set up CI/CD pipeline (optional)
5. ✅ Configure CDN for static assets (optional)
6. ✅ Implement additional security measures
7. ✅ Share your portfolio with the world!

---

**Congratulations!** Your portfolio is now live on your VPS with full control and flexibility. 🎉
