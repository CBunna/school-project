# 🔧 Fix CORS Issue - Frontend Can't Connect to Backend

## The Problem

Your backend is running and database is connected, BUT your frontend gets "Failed to fetch".

This is a **CORS (Cross-Origin Resource Sharing)** issue.

---

## Quick Fix

### Go to Render Backend Settings

1. Visit: https://dashboard.render.com
2. Click on **beskydy-backend** (your Web Service)
3. Click **"Environment"** tab
4. Find the variable: **FRONTEND_URL**

### Update FRONTEND_URL

**Current value might be:**
```
FRONTEND_URL = https://your-frontend-url.onrender.com
```

**Change it to:**
```
FRONTEND_URL = https://beskydy-frontend.onrender.com
```

### Save and Redeploy

1. Click **"Save Changes"**
2. Backend will auto-redeploy (wait 2-3 minutes)
3. Test again

---

## Verify It's Fixed

After backend redeploys, open browser console (F12) on your frontend and try:

```javascript
fetch('https://beskydy-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

**If you see:**
```json
{"status":"OK","database":{"status":"connected"}}
```

Then CORS is fixed! ✅

**If you still see error:**
CORS is still blocking - check FRONTEND_URL again.

---

## Alternative: Allow All Origins (Testing Only)

If you just want to test quickly, you can temporarily allow all origins:

**In Render Backend Environment:**
```
FRONTEND_URL = *
```

⚠️ **Warning:** Don't use `*` in production! Only for testing.

---

## The Technical Explanation

Your backend checks the `Origin` header of incoming requests.

When frontend at `https://beskydy-frontend.onrender.com` calls backend, the backend checks:

```javascript
// In backend CORS config
origin: process.env.FRONTEND_URL
```

If `FRONTEND_URL` doesn't match the actual frontend domain, the request is blocked.

**Solution:** Make sure they match exactly!

---

## Current Status

Backend: ✅ Running  
Database: ✅ Connected  
CORS: ❌ Blocking requests  

**Fix:** Update `FRONTEND_URL` environment variable to match your frontend domain.
