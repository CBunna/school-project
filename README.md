# Beskydy Tourism Website - Frontend

**Client-Side Web Development Project**
PEF CZU Prague - Semester 3

## Project Overview

A comprehensive tourism website for the Beskydy Mountains region in the Czech Republic, featuring 13 responsive pages, user authentication, booking system, and admin panel.

---

## 📁 Project Structure

```
frontend-project/
├── index.html                    # Homepage
├── about.html                    # About Beskydy region
├── attractions.html              # Tourist attractions
├── accommodation.html            # Hotels, pensions, cottages
├── activities.html               # Activities and sports
├── gallery.html                  # Photo gallery
├── events.html                   # Events calendar
├── booking.html                  # Booking system
├── contact.html                  # Contact form
├── login.html                    # User login
├── register.html                 # User registration
├── user-profile.html             # User dashboard
├── admin-dashboard.html          # Admin panel
│
├── css/
│   └── style.css                 # Main stylesheet
│
├── js/
│   ├── main.js                   # Main JavaScript
│   └── auth.js                   # Authentication system
│
├── images/                       # Images and photos
│
├── docs/                         # Documentation
│   ├── HOW-IT-WORKS.md          # Backend simulation guide
│   ├── IMPLEMENTATION-PLAN.md    # Implementation details
│   ├── PROJECT-SUMMARY.md        # Project summary
│   ├── TEST-GUIDE.md            # Testing instructions
│   └── UPDATE-NAVIGATION.md      # Navigation update guide
│
└── presentations/                # Presentation slides
    ├── presentation.html         # Backend intro presentation
    ├── individual-presentation.html  # Technology presentation
    └── project-presentation.html     # Project implementation
```

---

## 🚀 Features

### Pages (13 Total)
- ✅ Homepage with hero section
- ✅ About page (history, geography, culture)
- ✅ Attractions (3 main attractions + more)
- ✅ Accommodation (4 types of lodging)
- ✅ Activities (summer, winter, cultural)
- ✅ Photo Gallery
- ✅ Events Calendar with registration
- ✅ Booking System
- ✅ Contact Form
- ✅ User Login & Registration
- ✅ User Profile/Dashboard
- ✅ Admin Dashboard

### Technical Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ CSS Grid & Flexbox layouts
- ✅ Semantic HTML5
- ✅ WCAG 2.1 accessibility compliant
- ✅ Form validation
- ✅ User authentication (simulated with localStorage)
- ✅ Admin panel for content management
- ✅ Mobile hamburger menu
- ✅ Smooth scroll & animations

### User Roles
1. **Unregistered** - Browse content, view gallery, contact
2. **Registered** - All above + booking, favorites, profile
3. **Admin** - All above + manage content, users, bookings

---

## 🎨 Design

**Color Scheme:**
- Primary: #2c5f2d (Forest Green)
- Secondary: #97c24e (Light Green)
- Accent: #ff6b35 (Orange)

**Typography:**
- Headings: Georgia, serif
- Body: Segoe UI, sans-serif
- Base: 16px, Line height: 1.6

**Breakpoints:**
- Mobile: 480px
- Tablet: 768px
- Desktop: 1024px

---

## 💻 Getting Started

### Option 1: Simple (No Backend)
```bash
# Just open in browser
open index.html
```

Uses **localStorage** to simulate backend (data resets on refresh)

### Option 2: With Real Backend
```bash
# Start backend first
cd ../backend
npm run dev

# Update API URL in js/main.js
const API_BASE_URL = 'http://localhost:3000/api';

# Open frontend
open index.html
```

---

## 🧪 Testing

### Demo Credentials

**Regular User:**
```
Email: user@beskydy.cz
Password: userpass123
```

**Admin User:**
```
Email: admin@beskydy.cz
Password: adminpass123
```

### Test Checklist
- [ ] Navigate through all 13 pages
- [ ] Test mobile responsive menu
- [ ] Login as regular user
- [ ] View user profile
- [ ] Logout
- [ ] Login as admin
- [ ] View admin dashboard
- [ ] Submit contact form
- [ ] Test booking form
- [ ] Check accessibility (keyboard navigation)

See `docs/TEST-GUIDE.md` for detailed testing instructions.

---

## 📖 Documentation

- **HOW-IT-WORKS.md** - Explains localStorage backend simulation
- **IMPLEMENTATION-PLAN.md** - Full implementation details
- **PROJECT-SUMMARY.md** - Complete project summary
- **TEST-GUIDE.md** - Step-by-step testing guide
- **UPDATE-NAVIGATION.md** - Navigation update instructions

---

## 📊 Presentations

Three presentation files in `presentations/` folder:

1. **presentation.html** - Backend introduction (5 slides)
   - Goals, what was done, backend plan, results

2. **individual-presentation.html** - Technology stack (6 slides)
   - Node.js, Express, PostgreSQL
   - Market share, opportunities
   - 12 cited sources (ISO 690)

3. **project-presentation.html** - Implementation (8 slides)
   - Goals, process, architecture
   - Usability, accessibility, conclusion

**To view:** Open HTML files in browser
**To export:** Cmd+P → Save as PDF (Landscape)

---

## 🔗 Connecting to Backend

1. **Start backend server** (see `../backend/README.md`)

2. **Update API URL** in `js/main.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

3. **Replace localStorage calls** with fetch:
```javascript
// OLD (localStorage)
localStorage.setItem('user', JSON.stringify(userData));

// NEW (API call)
const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const data = await response.json();
```

---

## ✅ Requirements Met

### Project Implementation
- ✅ 10+ pages (13 pages)
- ✅ Information architecture (navigation, menus, footer)
- ✅ Accessibility & usability testing ready
- ✅ Forms (7 forms: contact, login, register, booking, event, profile, admin)
- ✅ Backend simulation (localStorage)
- ✅ Administration panel
- ✅ Professional design
- ✅ User functions (3 roles: unregistered, registered, admin)

### Individual Presentation
- ✅ Technology description (Node.js, Express, PostgreSQL)
- ✅ Origin, requirements, use cases
- ✅ Market share statistics
- ✅ Opportunities
- ✅ 12 cited sources (ISO 690)

### Project Presentation
- ✅ Goals
- ✅ Implementation process
- ✅ Information architecture
- ✅ Usability features
- ✅ Accessibility standards
- ✅ Examples and conclusion

---

## 👥 Team

- **Bunna CHOM**
- **Hakimov Sunnat**
- **Adepu Gopi Krishna**
- **Tilek Tekinov**

**Supervisor:** Ing. Václav Lohr, Ph.D.
**Institution:** Faculty of Economics and Management, PEF CZU Prague

---

## 📝 License

Educational project - PEF CZU Prague
