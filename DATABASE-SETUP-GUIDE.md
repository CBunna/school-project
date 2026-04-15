# 🗄️ Complete Database Setup Guide for Render (Free Tier)

## Overview
Since Render's free tier doesn't have Shell access, we created a special endpoint that initializes your database with just ONE click in your browser!

---

## 🎯 Step-by-Step Database Setup

### Prerequisites
✅ You've already deployed your backend on Render
✅ You've created a PostgreSQL database on Render
✅ Backend is connected to the database (DATABASE_URL is set)

---

### Method 1: One-Click Browser Setup ⭐ RECOMMENDED

This is the **easiest way** - no additional software needed!

#### Step 1: Get Your Backend URL

After deploying your backend on Render, you'll get a URL like:
```
https://beskydy-backend.onrender.com
```

To find it:
1. Go to https://dashboard.render.com
2. Click on your backend service (e.g., "beskydy-backend")
3. Look at the top - you'll see the URL

**Copy this URL!**

#### Step 2: Open the Setup URL in Your Browser

Take your backend URL and add `/api/setup?secret=beskydy-setup-2025` to the end:

```
https://YOUR-BACKEND-NAME.onrender.com/api/setup?secret=beskydy-setup-2025
```

**Example:**
```
https://beskydy-backend.onrender.com/api/setup?secret=beskydy-setup-2025
```

**Just paste this in your browser and press Enter!**

#### Step 3: Wait for Confirmation

You should see a JSON response like this:

```json
{
  "success": true,
  "message": "✅ Database initialized successfully!",
  "statistics": {
    "users": "2",
    "attractions": "6",
    "accommodation": "4",
    "activities": "6",
    "bookings": "3",
    "contacts": "0"
  },
  "credentials": {
    "admin": "admin@beskydy.cz / adminpass123",
    "user": "user@beskydy.cz / userpass123"
  },
  "nextSteps": [
    "1. Test login with demo credentials",
    "2. For security, remove this endpoint or disable SETUP_SECRET",
    "3. Your website is ready to use!"
  ]
}
```

**That's it! Your database is ready!** 🎉

---

### Step 4: Verify Database is Working

Test if the database is initialized by visiting:

```
https://YOUR-BACKEND-NAME.onrender.com/api/setup/check
```

You should see:
```json
{
  "initialized": true,
  "userCount": 2,
  "message": "Database is already initialized"
}
```

---

## 🐛 Troubleshooting

### Error: "Invalid setup secret"

**Problem:** The secret key doesn't match

**Solution:**
1. Make sure you're using `?secret=beskydy-setup-2025` at the end of the URL
2. OR check your Render environment variables for `SETUP_SECRET`

**Example:**
```
❌ Wrong: https://beskydy-backend.onrender.com/api/setup
✅ Right: https://beskydy-backend.onrender.com/api/setup?secret=beskydy-setup-2025
```

---

### Error: "Database setup failed"

**Problem:** Database connection issue

**Solutions:**

1. **Check DATABASE_URL is set:**
   - Go to Render dashboard → your backend service
   - Click "Environment" tab
   - Make sure `DATABASE_URL` is set and points to your PostgreSQL database

2. **Verify PostgreSQL database exists:**
   - Go to Render dashboard → Databases
   - Your PostgreSQL database should show as "Available"
   - Copy the "Internal Database URL"
   - Paste it as `DATABASE_URL` in your backend environment variables

3. **Check database connection string format:**
   Should look like:
   ```
   postgresql://user:password@host:5432/database
   ```

---

### Error: "Cannot read file schema.sql"

**Problem:** The schema file path is wrong

**Solution:**
This means the backend can't find the schema file. This shouldn't happen if you deployed correctly.

**Check:**
- Your `backend/database/schema.sql` file exists in the repository
- You deployed from the correct branch
- Trigger a new deployment on Render

---

### Nothing happens / Page loads forever

**Problem:** Backend is waking up from sleep

**Solution:**
- Free tier backends sleep after 15 minutes of inactivity
- **First request takes 30-60 seconds to wake up**
- Just wait patiently!
- Refresh the page after 1 minute

---

## 📋 What the Setup Does

When you visit the setup URL, it automatically:

1. **Creates Tables:**
   - `users` - Stores user accounts
   - `attractions` - Tourist attractions
   - `accommodation` - Hotels, pensions, cottages
   - `activities` - Available activities
   - `bookings` - User bookings
   - `contacts` - Contact form submissions

2. **Inserts Sample Data:**
   - 2 demo users (admin and regular user)
   - 6 tourist attractions (Lysá Hora, Pustevny, Radhošť, etc.)
   - 4 accommodations (hotels, cottages)
   - 6 activities (hiking, skiing, biking, etc.)
   - 3 sample bookings

3. **Sets Up Demo Credentials:**
   - Admin: `admin@beskydy.cz` / `adminpass123`
   - User: `user@beskydy.cz` / `userpass123`

---

## 🔒 Security Notes

### Should I remove the setup endpoint after using it?

**Option 1: Keep it (easier)**
- The endpoint requires a secret key
- Only you know the secret
- You can run it again if needed

**Option 2: Remove it (more secure)**
After setup, you can:
1. Remove `SETUP_SECRET` from environment variables
2. The endpoint will stop working
3. Or delete the `/api/setup` route from code and redeploy

---

## Alternative Method: Manual Setup with DBeaver

If the endpoint doesn't work, you can set up manually:

### Step 1: Download DBeaver
- Go to https://dbeaver.io/download/
- Download and install (free, works on Mac/Windows/Linux)

### Step 2: Get Database Credentials
1. Go to Render dashboard → PostgreSQL database
2. Scroll to "Connections"
3. Copy these details:
   - **Host** (e.g., `dpg-xyz.oregon-postgres.render.com`)
   - **Port** (usually `5432`)
   - **Database** (e.g., `beskydy_tourism`)
   - **Username** (e.g., `beskydy_admin`)
   - **Password** (click "Show" to reveal)

### Step 3: Connect with DBeaver
1. Open DBeaver
2. Click "New Database Connection" (plug icon)
3. Select "PostgreSQL"
4. Enter your credentials from Step 2
5. Click "Test Connection"
6. Click "Finish"

### Step 4: Run the Setup SQL
1. In DBeaver, right-click your database → "SQL Editor" → "Open SQL Script"
2. Navigate to your project folder
3. Open `backend/database/schema.sql`
4. Click "Execute" (▶️ button) or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
5. Wait for it to complete (~5 seconds)
6. You should see "Success" messages

### Step 5: Verify
Run this query in DBeaver:
```sql
SELECT COUNT(*) FROM users;
```

You should see `2` (admin and user)

---

## ✅ Checklist

After database setup:

- [ ] Setup endpoint returned success message
- [ ] `/api/setup/check` shows database is initialized
- [ ] Can login with admin credentials on frontend
- [ ] Can login with user credentials on frontend
- [ ] Attractions page shows data
- [ ] Accommodation page shows data
- [ ] Booking system works

---

## 🎉 Success!

If you can see the success message from the setup endpoint, **your database is ready!**

Next steps:
1. Update your frontend API URL (see DEPLOYMENT-GUIDE.md)
2. Test logging in with demo credentials
3. Make a test booking
4. Share your live website URL!

---

## 💡 Tips

- **Setup takes 2-5 seconds** - be patient
- **You can run setup multiple times** - it will replace existing data
- **Save your backend URL** - you'll need it for the frontend
- **Test immediately** - make sure login works before submitting

---

## Need Help?

Common commands to test your database:

**Check if backend is running:**
```
https://YOUR-BACKEND.onrender.com/api/health
```

**Check database status:**
```
https://YOUR-BACKEND.onrender.com/api/setup/check
```

**Initialize database:**
```
https://YOUR-BACKEND.onrender.com/api/setup?secret=beskydy-setup-2025
```

**Test login endpoint:**
```
POST https://YOUR-BACKEND.onrender.com/api/auth/login
Body: {"email": "user@beskydy.cz", "password": "userpass123"}
```

---

**You're almost done! Database setup is the last major step!** 🚀
