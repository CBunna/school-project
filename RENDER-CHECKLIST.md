# ✅ Render Deployment Checklist

Follow this step-by-step to get everything working.

---

## Step 1: Check Database Status

**Go to:** https://dashboard.render.com → PostgreSQL service

**Look for:**
- Status should be: **🟢 Available**
- If not "Available", wait 2-5 minutes or create a new one

---

## Step 2: Get Database Credentials

**In your PostgreSQL service:**

1. Click "**Info**" tab
2. Find "**Internal Database URL**"
3. Copy the entire URL (looks like):
   ```
   postgresql://beskydy_user:abc123@dpg-xyz-a.render.com/beskydy_db
   ```

**Write down these parts:**
```
Hostname: dpg-xyz-a.frankfurt-postgres.render.com
Port: 5432
Username: beskydy_user
Password: abc123
Database: beskydy_db
```

---

## Step 3: Initialize Database (First Time Only)

**From your computer terminal:**

```bash
# Replace with YOUR credentials from Step 2
PGPASSWORD=abc123 psql -h dpg-xyz-a.frankfurt-postgres.render.com -U beskydy_user beskydy_db < backend/database/schema.sql
```

**Expected output:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
...
INSERT 0 2
INSERT 0 5
INSERT 0 6
...
```

**Skip this if you already initialized before!**

---

## Step 4: Configure Backend Web Service

**Go to:** Dashboard → Your Web Service → **Settings**

### A. Root Directory
```
Root Directory: backend
```
(This is THE MOST IMPORTANT setting!)

### B. Build & Start Commands
```
Build Command: npm install
Start Command: npm start
```

### C. Environment Variables

Click "**Environment**" tab and add/update:

```
NODE_ENV = production
PORT = 10000
DB_HOST = dpg-xyz-a.frankfurt-postgres.render.com
DB_PORT = 5432
DB_USER = beskydy_user
DB_PASSWORD = abc123
DB_NAME = beskydy_db
JWT_SECRET = your-random-secret-string-12345
FRONTEND_URL = https://your-frontend-url.onrender.com
```

**Important:** Use values from Step 2!

### D. Save and Deploy

Click "**Save Changes**" → Backend will redeploy automatically

---

## Step 5: Wait for Deployment

**Watch the logs:**

Good signs:
```
✓ Build succeeded
✓ Starting server...
🏔️ Beskydy Tourism API Server
Server running on port 10000
✓ Connected to PostgreSQL database
```

Bad signs:
```
✗ Error: Cannot find module 'express'
   → Root Directory is wrong! Set to 'backend'

✗ Error: ECONNREFUSED
   → Database credentials wrong! Check Step 2

✗ Error: relation "users" does not exist
   → Database not initialized! Run Step 3
```

---

## Step 6: Test Backend

**Copy your backend URL** (from Render dashboard)

Example: `https://beskydy-backend-abc.onrender.com`

**Test 1: Health Check**
```bash
curl https://beskydy-backend-abc.onrender.com/api/health
```

**Expected:**
```json
{"status":"OK","database":{"status":"connected"}}
```

**Test 2: Get Data**
```bash
curl https://beskydy-backend-abc.onrender.com/api/accommodation
```

**Expected:**
```json
{"accommodation":[...], "count": 5}
```

---

## Step 7: Update Frontend

**In your code, update `js/api.js` line 9:**

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : 'https://beskydy-backend-abc.onrender.com/api';  // ← Your backend URL here
```

**Commit and push:**
```bash
git add js/api.js
git commit -m "Update API URL for production"
git push origin main
```

---

## Step 8: Deploy Frontend

### Option A: GitHub Pages (Recommended - Free & Fast)

1. Go to GitHub repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **/ (root)**
5. Click **Save**
6. Wait 2-3 minutes
7. Visit: `https://username.github.io/repo-name`

### Option B: Render Static Site

1. Dashboard → **New +** → **Static Site**
2. Connect your repo
3. Settings:
   ```
   Name: beskydy-frontend
   Root Directory: . (leave empty)
   Build Command: echo "No build needed"
   Publish Directory: .
   ```
4. Deploy

---

## Step 9: Test Everything

**Visit your frontend URL:**

✅ Accommodation page loads with data  
✅ Activities page loads with data  
✅ Images display correctly  
✅ Login works (admin@beskydy.cz / adminpass123)  
✅ Admin dashboard loads  
✅ Can create new bookings  

---

## Troubleshooting

### Backend still shows error

**Check:**
- [ ] Root Directory = `backend`
- [ ] Environment variables all set correctly
- [ ] Database status = "Available"
- [ ] Used **Internal** Database URL (not external)

### Frontend shows CORS error

**Fix:** Update `FRONTEND_URL` in backend environment variables to match your frontend URL

### Database connection failed

**Check backend logs for error:**
- "ECONNREFUSED" → Wrong hostname
- "password authentication failed" → Wrong password
- "database does not exist" → Wrong database name
- "relation does not exist" → Run schema.sql (Step 3)

### Images not loading

**Check:**
- [ ] Images committed to GitHub
- [ ] Database image paths are `../../images/filename`

---

## Summary

**Three services needed:**

1. **PostgreSQL Database** (always running, no manual start)
   - Status: Available
   - Initialized with schema.sql

2. **Backend Web Service**
   - Root Directory: `backend`
   - Environment variables set
   - Connected to database

3. **Frontend** (GitHub Pages or Render Static Site)
   - API URL updated
   - Deployed and accessible

---

**Done!** 🎉 Your app is now live!

**Backend:** `https://your-backend.onrender.com`  
**Frontend:** `https://username.github.io/repo-name`  
**Admin:** Login with `admin@beskydy.cz` / `adminpass123`
