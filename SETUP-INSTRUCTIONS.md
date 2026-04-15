# 🚀 Complete Setup Instructions for Beskydy Tourism Website

## For Your Colleague to Run & Test the Project

Follow these step-by-step instructions to get the project running on your machine.

---

## 📋 Prerequisites

Make sure you have the following installed on your computer:

### Required Software:
1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **PostgreSQL** (v12 or higher)
   - Download: https://www.postgresql.org/download/
   - **OR** use Docker (recommended - easier setup)

3. **Python 3** (for frontend server)
   - Download: https://www.python.org/downloads/
   - Check version: `python3 --version`

4. **Git**
   - Download: https://git-scm.com/downloads

---

## 📥 Step 1: Clone the Repository

```bash
# Clone the project
git clone <repository-url>

# Navigate to project directory
cd frontend-project
```

---

## 🗄️ Step 2: Set Up PostgreSQL Database

### Option A: Using Docker (Recommended - Easier!)

```bash
# Start PostgreSQL container
docker run --name beskydy-postgres \
  -e POSTGRES_USER=beskydy_admin \
  -e POSTGRES_PASSWORD=beskydy2025 \
  -e POSTGRES_DB=beskydy_tourism \
  -p 5433:5432 \
  -d postgres:15

# Verify it's running
docker ps
```

### Option B: Using Local PostgreSQL Installation

1. Open PostgreSQL (pgAdmin or terminal)
2. Create a new database:
```sql
CREATE DATABASE beskydy_tourism;
CREATE USER beskydy_admin WITH PASSWORD 'beskydy2025';
GRANT ALL PRIVILEGES ON DATABASE beskydy_tourism TO beskydy_admin;
```

---

## ⚙️ Step 3: Configure Backend Environment

```bash
# Navigate to backend directory
cd backend

# Create .env file
cp .env.example .env
```

**Edit the `.env` file** with these settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_USER=beskydy_admin
DB_PASSWORD=beskydy2025
DB_NAME=beskydy_tourism

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production-123456789

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Note:** If you're using local PostgreSQL (not Docker), change `DB_PORT=5433` to `DB_PORT=5432`

---

## 📦 Step 4: Install Backend Dependencies

```bash
# Make sure you're in the backend directory
cd backend

# Install all npm packages
npm install
```

This will install:
- express
- pg (PostgreSQL client)
- bcrypt
- jsonwebtoken
- cors
- dotenv
- nodemon

---

## 🔨 Step 5: Initialize Database

```bash
# Still in backend directory
npm run db:setup
```

**What this does:**
- Creates all database tables
- Inserts sample data (attractions, accommodations, activities)
- Creates demo user accounts

**You should see output like:**
```
✅ Database setup completed successfully!

📊 Database Statistics:
   • Users: 2
   • Attractions: 6
   • Accommodation: 4
   • Activities: 6
   • Bookings: 3
   • Contact Messages: 0

🔐 Demo Credentials:
   Admin: admin@beskydy.cz / adminpass123
   User: user@beskydy.cz / userpass123
```

---

## 🚀 Step 6: Start the Backend Server

```bash
# Still in backend directory
npm run dev
```

**You should see:**
```
[nodemon] starting `node server.js`
✅ Database connected successfully
🚀 Server running on http://localhost:3001
```

**Keep this terminal window open!** The backend server must keep running.

---

## 🌐 Step 7: Start the Frontend Server

**Open a NEW terminal window** (don't close the backend one!)

```bash
# Navigate to project root directory
cd /path/to/frontend-project

# Start Python HTTP server
python3 -m http.server 8080
```

**You should see:**
```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

**Keep this terminal window open too!**

---

## ✅ Step 8: Access the Website

Open your web browser and navigate to:

### Main Website
- **Homepage**: http://localhost:8080
- **Attractions**: http://localhost:8080/pages/public/attractions.html
- **Accommodation**: http://localhost:8080/pages/public/accommodation.html
- **Booking**: http://localhost:8080/pages/booking/booking.html

### Login & Admin
- **Login Page**: http://localhost:8080/pages/auth/login.html
- **Register Page**: http://localhost:8080/pages/auth/register.html
- **Admin Dashboard**: http://localhost:8080/pages/admin/admin-dashboard.html (after logging in as admin)
- **User Profile**: http://localhost:8080/pages/user/user-profile.html (after logging in as user)

---

## 🧪 Step 9: Test the Application

### Test #1: Login as Regular User

1. Go to http://localhost:8080/pages/auth/login.html
2. Login with:
   - **Email**: `user@beskydy.cz`
   - **Password**: `userpass123`
3. You should be redirected to the user profile page
4. Try making a booking:
   - Go to Booking page
   - Fill out the form
   - Submit
   - Check your profile to see the booking

### Test #2: Login as Admin

1. Logout from user account (if logged in)
2. Login with:
   - **Email**: `admin@beskydy.cz`
   - **Password**: `adminpass123`
3. You should be redirected to the admin dashboard
4. Try adding a new attraction:
   - Click "Manage Content" tab
   - Click "+ Add Attraction" button
   - Fill out the form (name, description, category, difficulty)
   - Upload a photo (optional)
   - Click "Save Attraction"
   - The new attraction should appear in the list

### Test #3: View Custom Attractions

1. After adding an attraction as admin
2. Go to http://localhost:8080/pages/public/attractions.html
3. Scroll down to "More Interesting Places" section
4. Your custom attraction should appear there!

### Test #4: Make a Booking

1. Go to Accommodation page
2. Click "Book Now" on any hotel
3. Fill out the booking form
4. Submit
5. Check confirmation message
6. Go to User Profile to see your booking

---

## 🐛 Troubleshooting

### Problem: Backend won't start

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5433`

**Solution**:
- Make sure PostgreSQL/Docker is running
- Check database credentials in `.env` file
- Verify port number (5433 for Docker, 5432 for local PostgreSQL)

```bash
# Check if Docker container is running
docker ps

# If not running, start it
docker start beskydy-postgres
```

### Problem: Frontend shows errors

**Error**: Console shows "Failed to fetch"

**Solution**:
- Make sure backend server is running on port 3001
- Check browser console for specific errors
- Try clearing browser cache and localStorage:

```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Problem: Can't login

**Solution**:
1. Make sure backend is running
2. Check if database was set up correctly:
```bash
npm run db:setup
```
3. Try these exact credentials:
   - User: `user@beskydy.cz` / `userpass123`
   - Admin: `admin@beskydy.cz` / `adminpass123`

### Problem: Port already in use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solution**:
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port in .env:
PORT=3002
```

### Problem: Custom attractions not showing

**Solution**:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for errors
4. Make sure you added the attraction as admin
5. Try refreshing the page (Ctrl+Shift+R for hard refresh)

---

## 📝 Quick Reference

### Backend Commands
```bash
npm start          # Start backend (production)
npm run dev        # Start backend (development with auto-reload)
npm run db:setup   # Reset and initialize database
```

### Frontend
```bash
python3 -m http.server 8080    # Start frontend on port 8080
python3 -m http.server 8000    # Alternative port
```

### Database (Docker)
```bash
docker ps                      # Check if container is running
docker start beskydy-postgres  # Start container
docker stop beskydy-postgres   # Stop container
docker logs beskydy-postgres   # View logs
```

### Useful URLs
```
Frontend:  http://localhost:8080
Backend:   http://localhost:3001
API Docs:  http://localhost:3001/api
```

---

## 📊 Demo Data Overview

### Users
| Email | Password | Role |
|-------|----------|------|
| admin@beskydy.cz | adminpass123 | admin |
| user@beskydy.cz | userpass123 | user |

### Attractions (6 total)
- Lysá Hora
- Pustevny
- Radhošť
- Trojačka (Troják)
- Smrk
- Velký Javorník

### Accommodations (4 total)
- Hotel Beskyd - $90/night
- Pension Radhošť - $60/night
- Mountain Cottage Pustevny - $75/night
- Apartments Ostravice - $70/night

### Activities (6 total)
- Hiking
- Mountain Biking
- Skiing & Snowboarding
- Rock Climbing
- Cross-country Skiing
- Cultural Tours

---

## ✅ Final Checklist Before Submission

- [ ] Backend server starts without errors
- [ ] Frontend server is running
- [ ] Can access homepage at http://localhost:8080
- [ ] Can login with both admin and user credentials
- [ ] Admin can add new attractions
- [ ] New attractions appear on Attractions page
- [ ] Booking system works
- [ ] User profile shows bookings
- [ ] All links work correctly
- [ ] No console errors in browser
- [ ] Mobile responsive design works

---

## 📧 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at browser console for errors (F12)
3. Check backend terminal for error messages
4. Verify all prerequisites are installed correctly

---

## 🎉 You're All Set!

If you completed all steps successfully, you now have:
- ✅ Backend API running on port 3001
- ✅ Frontend website running on port 8080
- ✅ PostgreSQL database with sample data
- ✅ Demo user and admin accounts working
- ✅ Full booking system functional
- ✅ Admin panel for content management

**Good luck with your presentation and submission!** 🏔️
