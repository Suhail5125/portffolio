# PostgreSQL Setup Script for Windows
# This script helps you set up PostgreSQL for the portfolio application

Write-Host "🚀 Portfolio Database Setup Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking for PostgreSQL installation..." -ForegroundColor Yellow
$psqlExists = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlExists) {
    Write-Host "❌ PostgreSQL is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please choose an installation method:" -ForegroundColor Yellow
    Write-Host "1. Install PostgreSQL locally (recommended for development)"
    Write-Host "   Download from: https://www.postgresql.org/download/windows/"
    Write-Host ""
    Write-Host "2. Use Docker (if you have Docker Desktop installed)"
    Write-Host "   Run: docker run --name portfolio-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portfolio -p 5432:5432 -d postgres:14"
    Write-Host ""
    Write-Host "3. Use a cloud database (Neon, Supabase, Railway)"
    Write-Host "   See setup-postgres.md for detailed instructions"
    Write-Host ""
    Write-Host "After installing PostgreSQL, run this script again." -ForegroundColor Green
    exit 1
}

Write-Host "✅ PostgreSQL is installed" -ForegroundColor Green
Write-Host ""

# Get PostgreSQL version
$version = psql --version
Write-Host "Version: $version" -ForegroundColor Cyan
Write-Host ""

# Prompt for database credentials
Write-Host "Database Configuration" -ForegroundColor Yellow
Write-Host "=====================" -ForegroundColor Yellow
Write-Host ""

$username = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($username)) {
    $username = "postgres"
}

$password = Read-Host "Enter PostgreSQL password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

$host_input = Read-Host "Enter PostgreSQL host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($host_input)) {
    $host_input = "localhost"
}

$port = Read-Host "Enter PostgreSQL port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($port)) {
    $port = "5432"
}

$dbname = Read-Host "Enter database name (default: portfolio)"
if ([string]::IsNullOrWhiteSpace($dbname)) {
    $dbname = "portfolio"
}

Write-Host ""
Write-Host "Creating database '$dbname'..." -ForegroundColor Yellow

# Set PGPASSWORD environment variable for this session
$env:PGPASSWORD = $passwordPlain

# Try to create database
$createDbResult = createdb -U $username -h $host_input -p $port $dbname 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database '$dbname' created successfully" -ForegroundColor Green
} else {
    if ($createDbResult -like "*already exists*") {
        Write-Host "ℹ️  Database '$dbname' already exists" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Failed to create database: $createDbResult" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please create the database manually:" -ForegroundColor Yellow
        Write-Host "psql -U $username -h $host_input -p $port" -ForegroundColor Cyan
        Write-Host "CREATE DATABASE $dbname;" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

# Create connection string
$connectionString = "postgresql://${username}:${passwordPlain}@${host_input}:${port}/${dbname}"

# Read current .env file
$envContent = Get-Content .env -Raw -ErrorAction SilentlyContinue

if ($envContent) {
    # Update DATABASE_URL if it exists
    if ($envContent -match "DATABASE_URL=.*") {
        $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=$connectionString"
    } else {
        # Add DATABASE_URL if it doesn't exist
        $envContent += "`nDATABASE_URL=$connectionString"
    }
} else {
    # Create new .env file
    $envContent = @"
# Database Configuration
DATABASE_URL=$connectionString

# Session Secret (for secure cookie sessions)
SESSION_SECRET=portfolio-dev-secret-key-12345-change-in-production

# Server Port
PORT=5000
"@
}

# Write updated .env file
Set-Content -Path .env -Value $envContent

Write-Host "✅ .env file updated" -ForegroundColor Green
Write-Host ""

# Clear password from environment
$env:PGPASSWORD = $null

Write-Host "Pushing database schema..." -ForegroundColor Yellow
npm run db:push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push database schema" -ForegroundColor Red
    Write-Host "Please check your connection string and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Database schema created" -ForegroundColor Green
Write-Host ""

Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
npm run db:seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Database seeded successfully" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start the development server: npm run dev" -ForegroundColor Cyan
Write-Host "2. Visit: http://localhost:5000" -ForegroundColor Cyan
Write-Host "3. Admin login: http://localhost:5000/admin/login" -ForegroundColor Cyan
Write-Host "   Username: admin" -ForegroundColor Cyan
Write-Host "   Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Remember to change the admin password!" -ForegroundColor Yellow
