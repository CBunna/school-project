# 🚀 Beskydy Tourism Website - Setup Guide

**A full-stack web application for tourism in the Beskydy Mountains region.**

Student Project - PEF CZU Prague

---

## 🌐 Deploy to Production

**Already deployed and getting an error?**

→ **[QUICK-FIX.md](QUICK-FIX.md)** - Fix in 2 minutes (just change Root Directory!)

**Want to reconfigure existing deployment?**

→ **[RENDER-RECONFIGURE.md](RENDER-RECONFIGURE.md)** - Update your existing services

**Starting fresh deployment?**

→ **[RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md)** - Complete deployment guide

---

## Prerequisites

Make sure you have these installed:

- **Docker Desktop** - For PostgreSQL database
- **Node.js 18+** - For backend server
- **Web Browser** - Chrome or Firefox recommended

---

## Quick Setup (3 Steps)

### Step 1: Start Database

```bash
docker start beskydy_postgres
```

If the container doesn't exist, create it:

```bash
docker run --name beskydy_postgres \
  -e POSTGRES_USER=beskydy_user \
  -e POSTGRES_PASSWORD=beskydy_password \
  -e POSTGRES_DB=beskydy_db \
  -p 5433:5432 \
  -d postgres:15-alpine
```

Then run the database schema (first time only):

```bash
cd backend
PGPASSWORD=beskydy_password psql -h localhost -p 5433 -U beskydy_user -d beskydy_db -f database/schema.sql
```

### Step 2: Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on: **http://localhost:3001**

### Step 3: Start Frontend

Open a new terminal:

```bash
npx http-server -p 8080
```

Frontend runs on: **http://localhost:8080**

---

## Access the Application

### Public Pages

- **Homepage**: http://localhost:8080/index.html
- **Accommodation**: http://localhost:8080/pages/public/accommodation.html
- **Activities**: http://localhost:8080/pages/public/activities.html
- **Attractions**: http://localhost:8080/pages/public/attractions.html
- **Gallery**: http://localhost:8080/pages/public/gallery.html
- **Contact**: http://localhost:8080/pages/public/contact.html

### Login & Admin

- **Login Page**: http://localhost:8080/pages/auth/login.html
- **Admin Dashboard**: http://localhost:8080/pages/admin/admin-dashboard.html

---

## Test Accounts

### Admin Account
```
Email: admin@beskydy.cz
Password: adminpass123
```

**What you can do:**
- Access admin dashboard
- Manage all bookings (confirm, cancel)
- Add/edit/delete accommodation
- Add/edit/delete activities
- Add/delete attractions
- Manage users
- View contact messages

### Regular User Account
```
Email: user@beskydy.cz
Password: userpass123
```

**What you can do:**
- View and book accommodation
- View and book activities
- Save favorites
- View your bookings
- Access user profile

---

## Verify Everything Works

### Test 1: Check Backend Health

```bash
curl http://localhost:3001/api/health
```

Should return: `{"status":"OK","database":{"status":"connected"}}`

### Test 2: Prove It's Database-Driven

```bash
# Stop database
docker stop beskydy_postgres

# Visit any page - you'll see errors!
# This proves it's NOT hardcoded

# Start database again
docker start beskydy_postgres

# Refresh page - everything works again!
```

### Test 3: Admin Dashboard

1. Login as admin: `admin@beskydy.cz` / `adminpass123`
2. Go to http://localhost:8080/pages/admin/admin-dashboard.html
3. Try adding new accommodation or activity
4. Check public pages - new items appear immediately!

---

## Project Structure

```
frontend-project/
├── index.html              # Homepage
├── pages/
│   ├── public/            # Public pages (accommodation, activities, etc.)
│   ├── auth/              # Login & registration
│   ├── user/              # User profile & bookings
│   ├── admin/             # Admin dashboard
│   └── booking/           # Booking forms
├── css/                   # Stylesheets
├── js/                    # JavaScript files
├── images/                # Image assets
└── backend/
    ├── server.js          # Express server
    ├── controllers/       # Business logic
    ├── routes/            # API routes
    ├── middleware/        # Auth middleware
    └── database/
        └── schema.sql     # Database schema & seed data
```

---

## Features

### For Visitors
- Browse accommodation (hotels, pensions, cottages)
- Explore activities (hiking, skiing, cultural events)
- View tourist attractions with photos
- Photo gallery
- Book accommodation and activities
- Save favorites (requires login)
- Contact form

### For Admins
- Complete admin dashboard
- Manage all bookings (view, confirm, cancel)
- Full CRUD for accommodation
- Full CRUD for activities
- Full CRUD for attractions
- User management (change roles, delete users)
- View contact messages
- Real-time statistics

---

## Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Fetch API for backend communication
- LocalStorage for authentication

### Backend
- Node.js + Express.js
- PostgreSQL database
- JWT authentication
- Bcrypt password hashing

### Database
- PostgreSQL 15 (Docker)
- 7 normalized tables with relationships

---

## API Endpoints

### Public
- `GET /api/accommodation` - List all accommodation
- `GET /api/activities` - List all activities
- `GET /api/attractions` - List all attractions
- `POST /api/contact` - Submit contact form
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### User (Auth Required)
- `GET /api/bookings/my-bookings` - User's bookings
- `POST /api/bookings` - Create booking
- `GET /api/favorites` - User's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove favorite

### Admin (Admin Only)
- `GET /api/bookings` - All bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/accommodation` - Add accommodation
- `PUT /api/accommodation/:id` - Update accommodation
- `DELETE /api/accommodation/:id` - Delete accommodation
- `POST /api/activities` - Add activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/users` - All users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/contact` - All messages
- `DELETE /api/contact/:id` - Delete message

---

## Troubleshooting

### "Database not connecting"

```bash
# Check if Docker is running
docker ps

# Check if container exists
docker ps -a | grep beskydy

# Start container
docker start beskydy_postgres

# Check logs
docker logs beskydy_postgres
```

### "Backend errors"

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check backend logs in terminal where you ran npm run dev
```

### "Images not showing"

```bash
# Verify images exist
ls images/

# Check image paths in database
PGPASSWORD=beskydy_password psql -h localhost -p 5433 -U beskydy_user -d beskydy_db -c "SELECT image_url FROM accommodation LIMIT 1;"

# Should return: ../../images/filename
```

### "Admin dashboard not loading"

1. Clear browser localStorage (F12 > Application > Local Storage > Clear)
2. Login as admin again
3. Make sure backend is running
4. Check browser console for errors (F12)

---

## Stop the Application

```bash
# Stop backend - Press Ctrl+C in backend terminal
# Stop frontend - Press Ctrl+C in frontend terminal
# Stop database
docker stop beskydy_postgres
```

---

## Key Features That Make This Production-Ready

✅ **Three-Tier Architecture** - Frontend, Backend, Database properly separated
✅ **RESTful API** - Standard HTTP methods and conventions
✅ **Database Normalization** - 7 properly designed tables
✅ **Authentication & Authorization** - JWT tokens, role-based access
✅ **Security** - Password hashing, SQL injection prevention, CORS
✅ **Error Handling** - User-friendly messages, graceful degradation
✅ **Dynamic Content** - Everything loaded from database, nothing hardcoded
✅ **CRUD Operations** - Full Create, Read, Update, Delete for all entities

---

## Team

- Bunna CHOM
- Hakimov Sunnat
- Adepu Gopi Krishna
- Tilek Tekinov

**Supervisor:** Ing. Václav Lohr, Ph.D.
**Institution:** Faculty of Economics and Management, PEF CZU Prague

---

## Need More Help?

Check [README.md](README.md) for detailed technical documentation.

---

**🎉 You're all set! Enjoy exploring the Beskydy Tourism Website!**
