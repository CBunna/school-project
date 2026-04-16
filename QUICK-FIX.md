# ⚡ QUICK FIX - 2 Minutes

## The Problem

Render is looking for your backend in the **root folder**, but it's in the **backend folder**.

```
❌ What Render sees now:
frontend-project/
├── index.html          ← Render tries to run this (wrong!)
├── pages/
├── css/
└── backend/
    └── server.js       ← Your backend is here!
```

---

## The Solution (1 Setting Change!)

Go to your Render web service → **Settings** → Update:

```
Root Directory: backend
```

That's it! Now Render will see:

```
✅ What Render sees after fix:
backend/
├── server.js          ← Render runs this (correct!)
├── package.json
├── controllers/
└── routes/
```

---

## Step-by-Step

### 1. Go to Render Dashboard
https://dashboard.render.com

### 2. Click Your Web Service
(The one showing the error)

### 3. Click "Settings"

### 4. Find "Root Directory"
Currently: (empty) or `.`

**Change to:** `backend`

### 5. Click "Save Changes"

Render will automatically redeploy!

### 6. Wait 2-3 Minutes

Watch the logs. You should see:
```
Building...
Installing dependencies...
Starting server...
🏔️ Beskydy Tourism API Server
Server running on port 10000
✓ Connected to PostgreSQL database
```

### 7. Test It

```bash
curl https://your-service-name.onrender.com/api/health
```

Should return:
```json
{"status":"OK","database":{"status":"connected"}}
```

---

## If You See Database Errors

Your database exists, but might need the schema:

```bash
# Get PSQL command from Render database dashboard
PGPASSWORD=<password> psql -h <hostname> -U <username> <database> < backend/database/schema.sql
```

---

## Environment Variables You Need

Make sure these are set (in Settings → Environment):

```
NODE_ENV = production
PORT = 10000
DB_HOST = (get from database "Internal Database URL")
DB_PORT = 5432
DB_USER = (get from database)
DB_PASSWORD = (get from database)
DB_NAME = (get from database)
JWT_SECRET = any-random-string-here-123456789
FRONTEND_URL = https://your-frontend.onrender.com
```

---

## Done! 🎉

Your backend should now be running correctly.

**Next:** Update your frontend's `js/api.js` line 9 with your backend URL, then deploy frontend to GitHub Pages.

**For complete details:** See [RENDER-RECONFIGURE.md](RENDER-RECONFIGURE.md)
