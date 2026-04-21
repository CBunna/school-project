#!/bin/bash

echo "🔧 Fixing hardcoded API URLs in public pages..."

# Define the dynamic API URL script
API_URL_SCRIPT='
        // Detect environment and use correct API URL
        const API_BASE_URL = window.location.hostname === '\''localhost'\'' || window.location.hostname === '\''127.0.0.1'\''
            ? '\''http://localhost:3001/api'\''
            : '\''https://beskydy-backend.onrender.com/api'\'';
        console.log('\''🌐 API_BASE_URL:'\'', API_BASE_URL);
'

# Fix accommodation.html
sed -i '' 's|http://localhost:3001/api|${API_BASE_URL}|g' pages/public/accommodation.html

# Fix activities.html  
sed -i '' 's|http://localhost:3001/api|${API_BASE_URL}|g' pages/public/activities.html

# Fix contact.html
sed -i '' 's|http://localhost:3001/api|${API_BASE_URL}|g' pages/public/contact.html

# Fix gallery.html
sed -i '' 's|http://localhost:3001/api|${API_BASE_URL}|g' pages/public/gallery.html

echo "✅ Fixed API URLs in all public pages"
echo ""
echo "Files updated:"
echo "  - pages/public/accommodation.html"
echo "  - pages/public/activities.html"
echo "  - pages/public/contact.html"
echo "  - pages/public/gallery.html"
