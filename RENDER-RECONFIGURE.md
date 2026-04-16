# 🔧 Reconfigure Your Existing Render Deployment

You already have services on Render, just need to fix the configuration.

---

## What You Already Have

✅ PostgreSQL database (already created)  
✅ Web service (but configured wrong)

---

## Fix Your Existing Web Service

### Step 1: Update Web Service Settings

1. Go to Render Dashboard: https://dashboard.render.com
2. Click on your existing web service
3. Go to "Settings" tab
4. Update these settings:

**Critical Setting:**
```
Root Directory: backend
```
(Currently it's probably empty or `.` - change it to `backend`)

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### Step 2: Verify Environment Variables

Still in Settings, scroll to "Environment Variables" and make sure you have:

```
NODE_ENV = production
PORT = 10000
DB_HOST = <your-postgres-internal-hostname>
DB_PORT = 5432
DB_USER = beskydy_user
DB_PASSWORD = <your-postgres-password>
DB_NAME = beskydy_db
JWT_SECRET = <some-random-string>
FRONTEND_URL = <your-frontend-url>
```

**To get database credentials:**
1. Click on your PostgreSQL database service
2. Go to "Info" tab
3. Copy "Internal Database URL" details:
   - Hostname (internal)
   - Port (5432)
   - Username
   - Password
   - Database name

### Step 3: Deploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Or just save settings and it will auto-deploy

---

## Check If Database Has Data

Your database should already have the schema if you initialized it before.

**To verify:**

```bash
# Use the PSQL command from Render dashboard
PGPASSWORD=<password> psql -h <hostname> -U <username> <database> -c "SELECT COUNT(*) FROM accommodation;"
```

**If it returns a count (like 5):** ✅ Database is ready!

**If it returns error "relation does not exist":** You need to run schema:

```bash
PGPASSWORD=<password> psql -h <hostname> -U <username> <database> < backend/database/schema.sql
```

---

## After Reconfiguring

1. Wait 2-3 minutes for deployment
2. Test your backend:

```bash
curl https://your-backend-url.onrender.com/api/health
```

Should return:
```json
{"status":"OK","database":{"status":"connected"}}
```

3. Test data:
```bash
curl https://your-backend-url.onrender.com/api/accommodation
```

Should return accommodation list!

---

## For Frontend

If you also deployed frontend on Render:

1. Keep it as **Static Site** (separate service)
2. Make sure `js/api.js` line 9 has your backend URL
3. Redeploy frontend

**Or use GitHub Pages (better):**
- Free, faster, no cold starts
- Just enable in repo Settings → Pages

---

## Summary: What to Change

### In Render Web Service Settings:
- ✅ Root Directory: `backend` (not empty!)
- ✅ Start Command: `npm start`
- ✅ Environment variables all set
- ✅ Manual deploy

### Database:
- ✅ Already exists - just verify it has data
- ✅ If empty, run schema.sql once

### Frontend:
- ✅ Update `js/api.js` with your backend URL
- ✅ Deploy to GitHub Pages (recommended)

---

**That's it! No need to recreate anything - just reconfigure!**
