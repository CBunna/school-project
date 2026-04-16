# 🚨 Complete Fix for "Failed to fetch" Error

You're seeing this error because your frontend can't reach the backend API.

---

## Error Analysis

```
❌ Backend health check failed: TypeError: Failed to fetch
❌ API Error: Error fetching favorites
```

**This means:** Frontend is trying to connect to backend, but can't reach it.

**Possible causes:**
1. Backend URL in js/api.js is wrong
2. Backend on Render is not running
3. CORS is blocking the request

---

## Fix It (Follow in Order)

### Step 1: Check Your Backend URL

**What's configured now:**

Your `js/api.js` line 9 says:
```javascript
'https://beskydy-backend.onrender.com/api'
```

**What you need to do:**

1. Go to https://dashboard.render.com
2. Click on your **Web Service** (backend)
3. Copy the exact URL at the top

**It should look like:**
```
https://beskydy-backend-XXXXX.onrender.com
```

**Is it different from `beskydy-backend.onrender.com`?**

If YES → You need to update js/api.js!

---

### Step 2: Test Backend Directly

Open a new terminal and test if your backend is actually running:

```bash
# Replace with YOUR actual backend URL from Render dashboard
curl https://your-backend-url.onrender.com/api/health
```

**Expected Success:**
```json
{"status":"OK","database":{"status":"connected"}}
```

**If you get error:**
Your backend is NOT running properly. Go to Step 3.

**If you get success:**
Your backend IS running. Go to Step 4.

---

### Step 3: Fix Backend (If Not Running)

Your backend might not be running because:

**Problem A: Wrong Root Directory**

1. Go to Render → Your Web Service → Settings
2. Find "Root Directory"
3. Set it to: `backend`
4. Save changes
5. Wait 3 minutes for redeploy

**Problem B: Missing Environment Variables**

1. Go to Render → Your Web Service → Environment
2. Make sure you have ALL of these:

```
NODE_ENV = production
PORT = 10000
DB_HOST = (get from PostgreSQL service "Internal Database URL")
DB_PORT = 5432
DB_USER = beskydy_user
DB_PASSWORD = (from PostgreSQL Internal Database URL)
DB_NAME = beskydy_db
JWT_SECRET = any-random-string-123456
FRONTEND_URL = https://your-frontend-url.onrender.com
```

3. Save and wait for redeploy

**Problem C: Database Not Initialized**

```bash
# Get credentials from Render PostgreSQL → Info → Internal Database URL
PGPASSWORD=your-password psql -h your-hostname -U beskydy_user beskydy_db < backend/database/schema.sql
```

**After fixing, test again:**
```bash
curl https://your-backend-url.onrender.com/api/health
```

Should return `{"status":"OK"}`

---

### Step 4: Update Frontend API URL

**If your backend URL is different from what's in js/api.js:**

**Method 1: I'll do it for you**

Just tell me:
"My backend URL is https://XXXXX.onrender.com"

And I'll update the file.

**Method 2: You update it manually**

1. Open `js/api.js`
2. Change line 9:

```javascript
// OLD:
: 'https://beskydy-backend.onrender.com/api';

// NEW (use YOUR backend URL):
: 'https://your-actual-backend-xyz.onrender.com/api';
```

3. Save the file

---

### Step 5: Update CORS

Your backend needs to allow your frontend domain.

1. Go to Render → Backend Web Service → Environment
2. Update `FRONTEND_URL` to match where your frontend is hosted:

**If using GitHub Pages:**
```
FRONTEND_URL = https://username.github.io
```

**If using Render Static Site:**
```
FRONTEND_URL = https://your-frontend.onrender.com
```

**If testing locally:**
```
FRONTEND_URL = http://localhost:8080
```

3. Save and wait for backend to redeploy

---

### Step 6: Deploy Updated Frontend

**Commit your changes:**
```bash
git add js/api.js
git commit -m "Fix backend API URL"
git push origin main
```

**Wait for deployment:**
- GitHub Pages: 2-3 minutes
- Render Static Site: 3-5 minutes

---

### Step 7: Test Again

1. Visit your frontend URL
2. Open browser console (F12)
3. Look for:
   ```
   🌐 API_BASE_URL: https://your-backend-url.onrender.com/api
   ```
4. Try logging in as user
5. Should work! ✅

---

## Quick Checklist

- [ ] Backend URL in Render dashboard noted
- [ ] Backend responds to /api/health (test with curl)
- [ ] Backend Root Directory = `backend`
- [ ] Backend has all environment variables
- [ ] js/api.js line 9 has correct backend URL
- [ ] Backend FRONTEND_URL matches where frontend is hosted
- [ ] Frontend redeployed with changes
- [ ] Can login successfully

---

## Still Stuck?

### Check Backend Logs

1. Go to Render → Web Service → Logs
2. Look for errors like:
   - "Cannot find module" → Root Directory wrong
   - "ECONNREFUSED" → Database credentials wrong
   - "relation does not exist" → Database not initialized

### Check Browser Console

1. Press F12 → Console tab
2. Look for the API_BASE_URL log
3. Try to fetch manually:
   ```javascript
   fetch('https://your-backend-url.onrender.com/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

If that works → CORS issue
If that fails → Backend not running

---

## What to Tell Me

To help you faster, tell me:

1. **Your backend URL** from Render dashboard
2. **Result of:** `curl https://your-backend-url.onrender.com/api/health`
3. **Where is your frontend hosted?** (GitHub Pages / Render / localhost)

Then I can fix it immediately! 🚀
