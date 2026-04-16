# 🏔️ Beskydy Tourism Website - Project Summary

## Quick Overview

This is a **complete full-stack web application** for Beskydy Mountains tourism, built as a student project at PEF CZU Prague.

---

## ⚡ Fastest Way to Start

```bash
./start.sh
```

That's it! The script handles everything:
- Starts PostgreSQL database
- Starts backend server (Node.js)
- Starts frontend server
- Verifies all services are healthy

**To stop:**
```bash
./stop.sh
```

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide with troubleshooting
- **[README.md](README.md)** - Technical documentation and API reference

---

## 🎯 Key Features

### Public Features
- Browse accommodation (5 types)
- Explore activities (hiking, skiing, cultural)
- View tourist attractions
- Photo gallery
- Book services
- Contact form

### Admin Features
- Complete admin dashboard
- Manage all bookings
- Full CRUD for accommodation, activities, attractions
- User management
- View contact messages

---

## 🔑 Test Accounts

**Admin:**
- Email: `admin@beskydy.cz`
- Password: `adminpass123`

**User:**
- Email: `user@beskydy.cz`
- Password: `userpass123`

---

## 🌐 URLs

After starting with `./start.sh`:

- Frontend: http://localhost:8080
- Backend: http://localhost:3001
- Admin Dashboard: http://localhost:8080/pages/admin/admin-dashboard.html

---

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript  
**Backend:** Node.js + Express.js  
**Database:** PostgreSQL 15 (Docker)  
**Auth:** JWT tokens with bcrypt  

---

## ✅ Production-Ready Features

- Three-tier architecture
- RESTful API
- Database normalization (7 tables)
- JWT authentication
- Role-based access control
- Password hashing
- SQL injection prevention
- CORS configured
- Error handling
- Dynamic content (100% database-driven)
- Full CRUD operations

---

## 📊 Project Statistics

- **7 database tables** with relationships
- **35+ API endpoints**
- **15+ HTML pages**
- **5,700+ lines of code**
- **Full CRUD** for all entities
- **100% dynamic** - nothing hardcoded

---

## 👥 Team

- Bunna CHOM
- Hakimov Sunnat
- Adepu Gopi Krishna
- Tilek Tekinov

**Supervisor:** Ing. Václav Lohr, Ph.D.  
**Institution:** Faculty of Economics and Management, PEF CZU Prague

---

## 🧪 Prove It's Database-Driven

```bash
# Stop the database
docker stop beskydy_postgres

# Visit http://localhost:8080/pages/public/accommodation.html
# You'll see errors - nothing works without database!

# Start database again
docker start beskydy_postgres

# Refresh - everything works perfectly!
```

This proves **everything comes from the database** - nothing is hardcoded!

---

## 📁 Project Files

```
frontend-project/
├── start.sh                 # 🚀 Start everything
├── stop.sh                  # 🛑 Stop everything
├── SETUP.md                 # 📖 Setup guide
├── README.md                # 📚 Technical docs
├── index.html               # Homepage
├── pages/                   # All pages
├── css/                     # Styles
├── js/                      # JavaScript
├── images/                  # Images
└── backend/                 # Backend API
    ├── server.js
    ├── controllers/
    ├── routes/
    ├── middleware/
    └── database/
```

---

## 🎓 Educational Value

This project demonstrates:

✅ Full-stack development skills  
✅ Database design and normalization  
✅ RESTful API architecture  
✅ Authentication and authorization  
✅ Security best practices  
✅ Modern web development  
✅ Real-world application structure  

---

## 🚀 Get Started Now

```bash
# Clone or download the project
cd frontend-project

# Start everything
./start.sh

# Visit http://localhost:8080
```

**That's it! You're ready to explore!**

---

**Made with ❤️ by PEF CZU Prague students**
