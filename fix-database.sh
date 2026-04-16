#!/bin/bash

# Beskydy Database Fix Script
# Fixes image paths in production database

echo "🔧 Fixing Beskydy Database Image Paths..."
echo ""

# Database credentials from Render
DB_HOST="dpg-d7flqdflk1mc73dh3e4g-a.oregon-postgres.render.com"
DB_USER="beskydy_tourism_user"
DB_NAME="beskydy_tourism"
DB_PASSWORD="badwRB2p9YbBe04tvT2UYVFHnAQniD2M"

echo "📍 Connecting to database..."

# Fix image paths
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER $DB_NAME << 'SQL'
-- Update accommodation image paths
UPDATE accommodation SET image_url = REPLACE(image_url, '../images/', '../../images/');

-- Update activities image paths
UPDATE activities SET image_url = REPLACE(image_url, '../images/', '../../images/');

-- Update attractions image paths
UPDATE attractions SET image_url = REPLACE(image_url, '../images/', '../../images/');

-- Show results
SELECT 'Accommodation images updated:' as status, COUNT(*) as count FROM accommodation;
SELECT 'Activities images updated:' as status, COUNT(*) as count FROM activities;
SELECT 'Attractions images updated:' as status, COUNT(*) as count FROM attractions;

-- Verify sample
SELECT id, name, image_url FROM accommodation LIMIT 2;
SQL

echo ""
echo "✅ Database image paths fixed!"
echo ""
echo "🔍 Verify by visiting:"
echo "   https://beskydy-frontend.onrender.com/pages/public/accommodation.html"
echo ""
