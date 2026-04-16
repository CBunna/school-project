# 🔧 Fix Frontend "Backend Not Running" Error

This error means your frontend is trying to connect to the wrong backend URL.

---

## The Problem

Your frontend is configured with:
```javascript
'https://beskydy-backend.onrender.com/api'
```

But your actual backend URL is probably different!

---

## The Fix (2 Steps)

### Step 1: Get Your Backend URL

1. Go to https://dashboard.render.com
2. Click on your **Web Service** (the backend one)
3. At the top of the page, copy the URL

It will look like:
```
https://beskydy-backend-abc123.onrender.com
```

**Copy this entire URL!**

---

### Step 2: Update js/api.js

**Option A: Manual Edit**

1. Open `js/api.js` in your editor
2. Go to **line 9**
3. Replace the URL with yours:

**Before:**
```javascript
: 'https://beskydy-backend.onrender.com/api';  // Production on Render
```

**After:**
```javascript
: 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api';  // Production on Render
```

**Option B: Use Command (if on Mac/Linux)**

Run this command (replace with YOUR backend URL):

```bash
# Replace YOUR-BACKEND-URL with your actual Render URL
sed -i '' 's|https://beskydy-backend.onrender.com|https://YOUR-BACKEND-URL.onrender.com|g' js/api.js
```

---

### Step 3: Commit and Push

```bash
git add js/api.js
git commit -m "Update backend API URL for production"
git push origin main
```

---

### Step 4: Redeploy Frontend

**If using GitHub Pages:**
- Wait 2-3 minutes, it auto-deploys

**If using Render Static Site:**
- Go to your frontend service on Render
- Click "Manual Deploy" → "Deploy latest commit"

---

## Verify It Works

1. Visit your frontend URL
2. Open browser console (F12 → Console)
3. Look for this log:
   ```
   🌐 API_BASE_URL: https://YOUR-BACKEND-URL.onrender.com/api
   ```
4. Try logging in again
5. Should work now! ✅

---

## Still Not Working?

### Check Backend is Running

```bash
curl https://YOUR-BACKEND-URL.onrender.com/api/health
```

Should return:
```json
{"status":"OK","database":{"status":"connected"}}
```

**If you get error:**
- Backend is not running
- Go back to [RENDER-CHECKLIST.md](RENDER-CHECKLIST.md)
- Fix backend first, then fix frontend

### Check CORS Settings

Your backend needs to allow your frontend domain.

In Render backend environment variables, check:
```
FRONTEND_URL = https://your-frontend-url.onrender.com
```

Or for GitHub Pages:
```
FRONTEND_URL = https://username.github.io
```

---

## Quick Summary

1. Get backend URL from Render dashboard
2. Update `js/api.js` line 9 with that URL
3. Commit and push
4. Wait for frontend to redeploy
5. Test login again

Done! 🎉
