# 🔧 Fix Render Deployment Error

**Error you're seeing:**
```
⚠️ Backend Server Not Running
Please start the backend server: cd backend && npm run dev
```

This happens because Render is trying to serve the **frontend** instead of the **backend**.

---

## Quick Fix (3 Steps)

### Step 1: Configure Render for Backend

In your Render dashboard:

1. **Service Type**: Web Service (not Static Site)
2. **Root Directory**: `backend`  ← **IMPORTANT!**
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### Step 2: Set Environment Variables

In Render dashboard, add these environment variables:

```
NODE_ENV = production
PORT = 10000
DB_HOST = your-postgres-hostname.render.com
DB_PORT = 5432
DB_USER = beskydy_user
DB_PASSWORD = your-database-password
DB_NAME = beskydy_db
JWT_SECRET = your-random-secret-key-123456
FRONTEND_URL = https://your-frontend-url.onrender.com
```

### Step 3: Create PostgreSQL Database

1. In Render, click "New +" → "PostgreSQL"
2. Name: `beskydy-postgres`
3. Plan: Free
4. Click Create
5. Copy the **Internal Database URL** credentials
6. Use these in Step 2 above

---

## Initialize Database

After database is created:

```bash
# Get the PSQL command from Render dashboard (Connect tab)
# Then run:
PGPASSWORD=<password> psql -h <hostname> -U <username> <database> < backend/database/schema.sql
```

---

## Verify It Works

After deployment:

```bash
curl https://your-backend-url.onrender.com/api/health
```

Should return:
```json
{"status":"OK","database":{"status":"connected"}}
```

---

## If You Want Frontend on Render Too

Create a **separate** Static Site service:

1. Click "New +" → "Static Site"
2. **Root Directory**: `.` (root)
3. **Build Command**: `echo "No build needed"`
4. **Publish Directory**: `.`

Update `js/api.js` line 9 with your backend URL:
```javascript
: 'https://your-backend-url.onrender.com/api';
```

---

## Recommended: Frontend on GitHub Pages

**Better option** (faster, free, no cold starts):

1. Push code to GitHub
2. Go to repo Settings → Pages
3. Source: Deploy from branch
4. Branch: main
5. Done!

Your site will be at: `https://username.github.io/repo-name`

---

## The Key Points

✅ **Backend = Web Service** with `rootDir: backend`  
✅ **Frontend = Static Site** with `rootDir: .` (or use GitHub Pages)  
✅ **Database = PostgreSQL** service  
✅ **Don't mix them up!**

---

**For complete guide, see [RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md)**
