# How the Backend Simulation Works

## Simple Explanation

Since this is a beginner project, we're using **localStorage** (browser storage) instead of a real database. This simulates backend functionality without needing a server.

---

## How to Test It

### 1. **Open the Website**
```
Open index.html in your browser
```

### 2. **Try Login (Without Account)**
```
1. Click "Login" in navigation (if you add it to nav)
2. Or go directly to: login.html
3. Use demo credentials:
   Email: user@beskydy.cz
   Password: userpass123
```

### 3. **What Happens:**
- When you login, JavaScript saves your info to localStorage
- Your browser "remembers" you're logged in
- You get redirected to user-profile.html

### 4. **Try Admin Login:**
```
Email: admin@beskydy.cz
Password: adminpass123
```
- This redirects to admin-dashboard.html
- You can manage content (fake - just for demonstration)

---

## How It Works (Technical)

### **localStorage = Fake Database**
```javascript
// When you login:
localStorage.setItem('user', JSON.stringify({
    name: 'John Doe',
    email: 'user@beskydy.cz',
    userType: 'registered',
    isLoggedIn: true
}));

// When checking if logged in:
const user = localStorage.getItem('user');
if (user) {
    // User is logged in
} else {
    // User is NOT logged in
}

// When you logout:
localStorage.removeItem('user');
```

### **Demo Accounts (Hardcoded in auth.js)**
```javascript
const DEMO_USERS = {
    'user@beskydy.cz': {
        password: 'userpass123',
        userType: 'registered'
    },
    'admin@beskydy.cz': {
        password: 'adminpass123',
        userType: 'admin'
    }
};
```

---

## What's Missing (Why Backend Not Fully Working)

### **Problem 1: Navigation Links**
The existing pages (index.html, attractions.html, etc.) don't have links to new pages.

**Solution:** Add links to navigation:
```html
<li><a href="about.html">About</a></li>
<li><a href="gallery.html">Gallery</a></li>
<li><a href="events.html">Events</a></li>
<li><a href="booking.html">Booking</a></li>
<li><a href="login.html">Login</a></li>
```

### **Problem 2: No Real Server**
- Forms submit but data isn't saved permanently
- When you refresh, everything resets
- localStorage only works in your browser

**Why This Is OK for School:**
- Professor can see the functionality works
- Demonstrates understanding of forms, validation, user management
- Shows frontend can communicate with backend (even if fake)

---

## Quick Fix: Test Everything

### **Step-by-Step Test:**

1. **Open login.html directly**
   ```
   file:///path/to/login.html
   ```

2. **Enter demo credentials**
   ```
   Email: user@beskydy.cz
   Password: userpass123
   ```

3. **Click Login**
   - You should see "Login successful!"
   - Browser redirects to user-profile.html

4. **Check Profile Page**
   - Should show "John Doe" or demo user info
   - Can view "booking history" (fake data)
   - Can see "favorites" (fake data)

5. **Try Admin**
   - Go back to login.html
   - Use admin credentials
   - Should redirect to admin-dashboard.html

---

## What Professor Will See

### **Functionality:**
✅ Login form validates email/password
✅ Registration form validates all fields
✅ User sees different pages based on role
✅ Admin can access admin panel
✅ Forms show proper validation messages
✅ Booking system calculates prices

### **Limitations (Normal for Beginner Project):**
⚠️ Data resets on page refresh
⚠️ No real database
⚠️ Can't send real emails
⚠️ No real payment processing

---

## If You Want to Show It Working

### **Option 1: Add Navigation Links**
Update the `<nav>` in each HTML file to include:
```html
<ul class="nav-menu">
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="attractions.html">Attractions</a></li>
    <li><a href="accommodation.html">Accommodation</a></li>
    <li><a href="activities.html">Activities</a></li>
    <li><a href="gallery.html">Gallery</a></li>
    <li><a href="events.html">Events</a></li>
    <li><a href="booking.html">Booking</a></li>
    <li><a href="contact.html">Contact</a></li>
    <li><a href="login.html">Login</a></li>
</ul>
```

### **Option 2: Open Pages Directly**
Just open the HTML files directly in browser:
- `login.html` → test login
- `register.html` → test registration
- `booking.html` → test booking form
- `admin-dashboard.html` → see admin panel

### **Option 3: Use Browser Console**
1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage"
4. After login, you'll see the user data stored

---

## For Presentation

**What to Say:**
> "We created a frontend that simulates backend functionality using localStorage. In a real application, this would connect to a Node.js server with PostgreSQL database. For this educational project, we demonstrate the complete user flow: registration, login, booking, and admin management."

**What to Show:**
1. Open login.html
2. Login with demo account
3. Show user profile page
4. Logout
5. Login as admin
6. Show admin dashboard
7. Show booking form working

---

## Summary

✅ **Backend is simulated** - uses localStorage instead of database
✅ **All pages exist** and are styled
✅ **Forms work** with validation
✅ **User authentication works** (fake but functional)
✅ **Admin panel exists** with management interface

❌ **Real server doesn't exist** - that's your next semester task!
❌ **Data doesn't persist** - resets on browser refresh
❌ **No real API calls** - everything is client-side

**This is perfect for a beginner frontend project!**
