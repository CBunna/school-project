# ⚡ Quick Deploy to Render - 5 Minutes

## Step 1: Push to GitHub (2 min)

```bash
git add .
git commit -m "Ready for deployment"
git push -u origin main
```

## Step 2: Deploy on Render (3 min)

### A. Create Database
1. Go to https://render.com (sign up with GitHub)
2. Click "New +" → "PostgreSQL"
3. Settings:
   - Name: `beskydy-db`
   - Database: `beskydy_tourism`
   - Plan: **Free**
4. Click "Create Database"
5. **Save the "Internal Database URL"** (you'll need it)

### B. Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Settings:
   - Name: `beskydy-backend`
   - Environment: **Node**
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. **Add Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 3001
   DATABASE_URL = [paste your Internal Database URL here]
   JWT_SECRET = beskydy-secret-2025-change-this
   FRONTEND_URL = https://beskydy-frontend.onrender.com
   SETUP_SECRET = beskydy-setup-2025
   ```
5. Click "Create Web Service"
6. Wait for deployment (~2 min)

### C. Deploy Frontend
1. Click "New +" → "Static Site"
2. Same GitHub repo
3. Settings:
   - Name: `beskydy-frontend`
   - Build: (leave empty)
   - Publish: `.`
4. Click "Create Static Site"

## Step 3: Initialize Database (1 min)

Once backend is deployed, visit this URL in your browser:

```
https://beskydy-backend.onrender.com/api/setup?secret=beskydy-setup-2025
```

You'll see:
```json
{
  "success": true,
  "message": "✅ Database initialized successfully!",
  "statistics": {
    "users": "2",
    "attractions": "6",
    "accommodation": "4"
  }
}
```

## Step 4: Update Frontend API URL (1 min)

Edit `js/api.js` line 6:

```javascript
const API_BASE_URL = 'https://beskydy-backend.onrender.com/api';
```

Commit and push:
```bash
git add js/api.js
git commit -m "Update API URL for production"
git push
```

Render will auto-deploy the update.

## 🎉 Done! Your Site is Live!

- **Frontend:** https://beskydy-frontend.onrender.com
- **Backend:** https://beskydy-backend.onrender.com
- **Admin:** admin@beskydy.cz / adminpass123
- **User:** user@beskydy.cz / userpass123

---

## Troubleshooting

**Backend won't start?**
- Check logs in Render dashboard
- Verify DATABASE_URL is correct
- Make sure all environment variables are set

**Database setup fails?**
- Check DATABASE_URL format
- Try visiting `/api/setup/check` to see status
- Verify database is created on Render

**Frontend can't connect?**
- Make sure you updated API_BASE_URL in `js/api.js`
- Check backend is running (visit backend URL)
- Check browser console for errors

---

## Total Time: ~5-10 minutes

Free tier limitations:
- ⚠️ Services sleep after 15 min of inactivity
- ⚠️ Wake up in ~30 seconds on first request
- ✅ Perfect for school projects and demos!
