# 🌐 Deployment Guide - Host Online for Free

## Option 1: Render (Recommended - Easiest Full-Stack)

### Why Render?
- ✅ Free PostgreSQL database included
- ✅ Free web hosting
- ✅ Automatic deployments from GitHub
- ✅ Simple setup (5 minutes)

### Steps to Deploy:

#### 1. Push to GitHub First
```bash
git commit -m "Complete project ready for deployment"
git push -u origin main
```

#### 2. Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

#### 3. Deploy Using Dashboard

**Create PostgreSQL Database:**
1. Click "New +" → "PostgreSQL"
2. Name: `beskydy-db`
3. Database: `beskydy_tourism`
4. Region: Frankfurt (or closest to you)
5. Plan: Free
6. Click "Create Database"
7. **Save the connection string** (Internal Database URL)

**Deploy Backend:**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Settings:
   - Name: `beskydy-backend`
   - Environment: `Node`
   - Region: Frankfurt
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `DATABASE_URL` = [paste your database connection string]
   - `JWT_SECRET` = `your-secret-key-here-change-this`
   - `FRONTEND_URL` = `https://beskydy-frontend.onrender.com`
5. Click "Create Web Service"

**Deploy Frontend:**
1. Click "New +" → "Static Site"
2. Connect same GitHub repository
3. Settings:
   - Name: `beskydy-frontend`
   - Branch: `main`
   - Root Directory: `.` (leave empty or use `.`)
   - Build Command: (leave empty)
   - Publish Directory: `.`
4. Click "Create Static Site"

#### 4. Initialize Database (Free Tier - Super Easy!)

**Method 1: One-Click Setup URL ⭐ EASIEST**

After your backend is deployed, simply visit this URL in your browser:

```
https://your-backend-name.onrender.com/api/setup?secret=beskydy-setup-2025
```

Replace `your-backend-name` with your actual Render backend URL.

**What happens:**
- ✅ Creates all database tables
- ✅ Inserts sample data (attractions, accommodations, activities)
- ✅ Creates demo users (admin and regular user)
- ✅ Shows you confirmation with statistics

**Security:**
- The endpoint requires a secret key (default: `beskydy-setup-2025`)
- You can change this in Render environment variables: `SETUP_SECRET`
- Only works once - if database is already initialized, it will tell you

**To check if database is initialized:**
Visit: `https://your-backend-name.onrender.com/api/setup/check`

---

**Method 2: Manual SQL (Alternative)**

If you prefer manual setup:
1. Download [DBeaver](https://dbeaver.io/download/) (free)
2. Connect to your Render PostgreSQL database (get credentials from Render dashboard)
3. Open and execute `backend/database/schema.sql`

#### 5. Update API URLs
In your frontend `js/api.js`, update:
```javascript
const API_BASE_URL = 'https://beskydy-backend.onrender.com/api';
```

Commit and push this change.

### Your Live URLs:
- Frontend: `https://beskydy-frontend.onrender.com`
- Backend API: `https://beskydy-backend.onrender.com`

---

## Option 2: Vercel (Frontend) + Railway (Backend)

### Vercel for Frontend (FREE)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your repository
4. Deploy (automatic)

### Railway for Backend + Database

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Add PostgreSQL database
7. Configure environment variables
8. Deploy

---

## Option 3: Netlify (Frontend Only - Demo Mode)

If you want to host just the frontend with localStorage:

1. Go to https://netlify.com
2. Drag and drop your project folder
3. Or connect GitHub for auto-deploy

**Note:** This won't have a real backend, uses localStorage only.

---

## 🎯 Recommended: Render

**Pros:**
- Everything in one place
- Free PostgreSQL database
- Simple setup
- Automatic deployments

**Cons:**
- Free tier sleeps after 15 min inactivity (wakes up on first request, takes ~30 seconds)

---

## 📝 Post-Deployment Checklist

- [ ] Backend is deployed and running
- [ ] Database is created and initialized
- [ ] Frontend is deployed
- [ ] Frontend can connect to backend API
- [ ] Login works
- [ ] Booking system works
- [ ] Admin panel accessible
- [ ] Test with demo credentials

---

## 🐛 Common Issues

### Backend won't start
- Check environment variables are set
- Check DATABASE_URL is correct
- View logs in Render dashboard

### Frontend can't connect to backend
- Check CORS settings in backend
- Update API_BASE_URL in frontend
- Make sure backend is running (check logs)

### Database connection fails
- Verify DATABASE_URL format
- Make sure database is created
- Run db:setup script

---

## 💰 Cost Comparison

| Service | Frontend | Backend | Database | Total |
|---------|----------|---------|----------|-------|
| Render | Free | Free | Free | **$0/month** |
| Vercel + Supabase | Free | Free | Free | **$0/month** |
| Railway | Free | $5 credit | Included | **$0-5/month** |
| Netlify + Render | Free | Free | Free | **$0/month** |

---

## 🎉 After Deployment

Share your live URLs:
- Add to README.md
- Include in school submission
- Share with colleagues for testing

Example:
```
🌐 Live Demo: https://beskydy-frontend.onrender.com
📚 Repository: https://github.com/CBunna/school-project
```

Good luck with deployment! 🚀
