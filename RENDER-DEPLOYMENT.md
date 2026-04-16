# 🚀 Deploying to Render.com

This guide shows how to deploy the Beskydy Tourism Website to Render.com for free.

---

## Prerequisites

- GitHub account with your code pushed
- Render.com account (free)

---

## Deployment Options

You have **2 options** for deployment:

### Option 1: Backend Only on Render (Recommended)
- Deploy backend API on Render
- Host frontend on GitHub Pages (free, faster)
- Best performance and cost

### Option 2: Full Stack on Render
- Deploy both backend and frontend on Render
- Everything in one place
- Easier to manage

---

## Option 1: Backend on Render + Frontend on GitHub Pages

### Step 1: Create PostgreSQL Database on Render

1. Go to https://render.com/
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `beskydy-postgres`
   - **Database**: `beskydy_db`
   - **User**: `beskydy_user`
   - **Region**: Frankfurt (or closest to you)
   - **Plan**: Free
4. Click "Create Database"
5. **IMPORTANT**: Copy the following credentials:
   - Internal Database URL
   - Hostname
   - Port
   - Database
   - Username
   - Password

6. Initialize database schema:
   - Go to "Connect" tab
   - Click "PSQL Command"
   - Copy the command and run locally:
   ```bash
   PGPASSWORD=<password> psql -h <hostname> -U <username> <database> < backend/database/schema.sql
   ```

### Step 2: Deploy Backend to Render

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `beskydy-backend`
   - **Region**: Frankfurt (same as database)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables:
   Click "Advanced" → "Add Environment Variable":
   
   ```
   NODE_ENV = production
   PORT = 10000
   DB_HOST = <your-postgres-hostname>
   DB_PORT = 5432
   DB_USER = beskydy_user
   DB_PASSWORD = <your-postgres-password>
   DB_NAME = beskydy_db
   JWT_SECRET = <generate-random-string>
   FRONTEND_URL = https://<your-github-username>.github.io/<repo-name>
   ```

5. Click "Create Web Service"
6. Wait for deployment (3-5 minutes)
7. **Copy your backend URL**: `https://beskydy-backend-xxxx.onrender.com`

### Step 3: Deploy Frontend to GitHub Pages

1. Update `js/config.js` (or create it):
   ```javascript
   const API_BASE_URL = 'https://beskydy-backend-xxxx.onrender.com';
   ```

2. Update all API calls in `js/api.js`:
   ```javascript
   const API_URL = API_BASE_URL || 'http://localhost:3001';
   ```

3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Configure for production"
   git push origin main
   ```

4. Enable GitHub Pages:
   - Go to repository Settings
   - Click "Pages"
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Click Save

5. Wait 2-3 minutes
6. Visit: `https://<username>.github.io/<repo-name>`

---

## Option 2: Full Stack on Render

### Step 1: Create PostgreSQL Database

Same as Option 1, Step 1.

### Step 2: Deploy Backend

Same as Option 1, Step 2.

### Step 3: Deploy Frontend as Static Site

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `beskydy-frontend`
   - **Branch**: main
   - **Build Command**: `echo "No build needed"`
   - **Publish Directory**: `.`

4. Add Environment Variable:
   ```
   BACKEND_URL = https://beskydy-backend-xxxx.onrender.com
   ```

5. Update `js/config.js`:
   ```javascript
   const API_BASE_URL = 'https://beskydy-backend-xxxx.onrender.com';
   ```

6. Click "Create Static Site"

---

## Verify Deployment

### Test Backend

```bash
curl https://beskydy-backend-xxxx.onrender.com/api/health
```

Should return:
```json
{"status":"OK","database":{"status":"connected"}}
```

### Test API Endpoints

```bash
# Get accommodation
curl https://beskydy-backend-xxxx.onrender.com/api/accommodation

# Get activities
curl https://beskydy-backend-xxxx.onrender.com/api/activities
```

### Test Frontend

1. Visit your frontend URL
2. Browse accommodation, activities, attractions
3. Login with: `admin@beskydy.cz` / `adminpass123`
4. Try admin dashboard

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Backends spin down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- 750 hours/month (enough for 1 service running 24/7)
- Database: 1GB storage, 97 hours/month of activity

**GitHub Pages:**
- 100GB bandwidth/month
- Fast CDN delivery
- No cold starts

### CORS Configuration

Make sure backend allows your frontend domain:

In [backend/.env](backend/.env):
```
FRONTEND_URL=https://your-frontend-url.onrender.com
```

Or for GitHub Pages:
```
FRONTEND_URL=https://username.github.io
```

### Database Persistence

Free PostgreSQL on Render:
- Database persists
- Automatic backups (paid plans)
- Data is safe

---

## Troubleshooting

### Backend shows "Application failed to respond"

**Check:**
1. Environment variables are set correctly
2. Database connection string is correct
3. PORT is set to 10000
4. Build logs for errors

### CORS errors in frontend

**Fix:**
1. Update `FRONTEND_URL` in backend environment variables
2. Redeploy backend
3. Clear browser cache

### Database connection failed

**Check:**
1. Database hostname is internal URL (not external)
2. Port is 5432
3. Database is running (Render dashboard)
4. Credentials are correct

### Images not loading

**Fix:**
1. Check image paths in database are relative: `../../images/`
2. Verify images are committed to GitHub
3. Check browser console for 404 errors

---

## Update After Changes

### Update Backend:
```bash
git add backend/
git commit -m "Update backend"
git push origin main
```
Render auto-deploys on push.

### Update Frontend:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
GitHub Pages auto-deploys on push (2-3 min).

---

## Cost Estimation

**Free Option (Recommended):**
- Backend: Render Free (with cold starts)
- Database: Render PostgreSQL Free (1GB)
- Frontend: GitHub Pages Free
- **Total: $0/month**

**Paid Option (No Cold Starts):**
- Backend: Render Starter ($7/month)
- Database: Render PostgreSQL Starter ($7/month)
- Frontend: GitHub Pages Free
- **Total: $14/month**

---

## Production Checklist

Before going live:

- [ ] Change JWT_SECRET to strong random string
- [ ] Update FRONTEND_URL to production URL
- [ ] Initialize database with schema.sql
- [ ] Test all API endpoints
- [ ] Test authentication (login/register)
- [ ] Test admin dashboard
- [ ] Test image loading
- [ ] Test booking functionality
- [ ] Check browser console for errors
- [ ] Test on mobile devices

---

## Quick Deploy Commands

```bash
# 1. Commit your code
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Initialize Render database (one time)
PGPASSWORD=<password> psql -h <hostname> -U <username> <database> < backend/database/schema.sql

# 3. That's it! Render auto-deploys your backend
# 4. GitHub Pages auto-deploys your frontend
```

---

## URLs After Deployment

**Production URLs:**
- Backend API: `https://beskydy-backend-xxxx.onrender.com`
- Frontend: `https://username.github.io/repo-name`
- Admin Dashboard: `https://username.github.io/repo-name/pages/admin/admin-dashboard.html`

**Test Accounts:**
- Admin: `admin@beskydy.cz` / `adminpass123`
- User: `user@beskydy.cz` / `userpass123`

---

## Need Help?

1. Check Render logs: Dashboard → Your Service → Logs
2. Check browser console: F12 → Console tab
3. Test API directly with curl
4. Verify environment variables are set

---

**🎉 Your app is now live and accessible worldwide!**
