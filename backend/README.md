# Beskydy Tourism Website - Backend API

Full-stack RESTful API for the Beskydy Tourism Website, built with Node.js, Express, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Testing](#testing)

## ✨ Features

- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control** - User and Admin roles with different permissions
- **RESTful API** - Clean REST architecture with proper HTTP methods
- **Database Integration** - PostgreSQL with connection pooling
- **Security** - Password hashing, JWT tokens, SQL injection prevention
- **Error Handling** - Comprehensive error handling and validation
- **CORS Enabled** - Cross-origin resource sharing for frontend integration

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Database Client:** node-postgres (pg)
- **Environment Variables:** dotenv
- **CORS:** cors middleware
- **Container:** Docker & Docker Compose

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js           # PostgreSQL connection pool
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── attractions.controller.js
│   ├── accommodation.controller.js
│   ├── activities.controller.js
│   ├── bookings.controller.js
│   └── contact.controller.js
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── attractions.routes.js
│   ├── accommodation.routes.js
│   ├── activities.routes.js
│   ├── bookings.routes.js
│   └── contact.routes.js
├── middleware/
│   └── auth.middleware.js    # JWT verification middleware
├── database/
│   ├── schema.sql            # Database schema & sample data
│   └── setup.js              # Database setup script
├── server.js                 # Express server
├── package.json
├── docker-compose.yml        # PostgreSQL container
├── .env.example              # Environment variables template
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Docker & Docker Compose installed
- npm or yarn package manager

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your settings:
   ```env
   DB_HOST=localhost
   DB_PORT=5433
   DB_USER=beskydy_user
   DB_PASSWORD=beskydy_password
   DB_NAME=beskydy_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080
   ```

4. **Start PostgreSQL with Docker:**
   ```bash
   docker-compose up -d
   ```

5. **Wait for database to be ready (about 10 seconds), then set up database:**
   ```bash
   npm run db:setup
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

   The API will be running at `http://localhost:3000`

### Production Start

```bash
npm start
```

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Attractions (`/api/attractions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/attractions` | Get all attractions | No |
| GET | `/api/attractions/:id` | Get single attraction | No |
| POST | `/api/attractions` | Create attraction | Admin |
| PUT | `/api/attractions/:id` | Update attraction | Admin |
| DELETE | `/api/attractions/:id` | Delete attraction | Admin |

### Accommodation (`/api/accommodation`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/accommodation` | Get all accommodation | No |
| GET | `/api/accommodation?type=hotel` | Filter by type | No |
| GET | `/api/accommodation/:id` | Get single accommodation | No |
| POST | `/api/accommodation` | Create accommodation | Admin |
| PUT | `/api/accommodation/:id` | Update accommodation | Admin |
| DELETE | `/api/accommodation/:id` | Delete accommodation | Admin |

### Activities (`/api/activities`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/activities` | Get all activities | No |
| GET | `/api/activities?type=hiking` | Filter by type | No |
| GET | `/api/activities/:id` | Get single activity | No |
| POST | `/api/activities` | Create activity | Admin |
| PUT | `/api/activities/:id` | Update activity | Admin |
| DELETE | `/api/activities/:id` | Delete activity | Admin |

### Bookings (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookings` | Create booking | User |
| GET | `/api/bookings/my-bookings` | Get user's bookings | User |
| GET | `/api/bookings/:id` | Get single booking | User/Admin |
| PUT | `/api/bookings/:id/status` | Update booking status | User/Admin |
| GET | `/api/bookings` | Get all bookings | Admin |
| DELETE | `/api/bookings/:id` | Delete booking | Admin |

### Contact (`/api/contact`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form | No |
| GET | `/api/contact` | Get all messages | Admin |
| GET | `/api/contact/:id` | Get single message | Admin |
| PUT | `/api/contact/:id/status` | Update message status | Admin |
| DELETE | `/api/contact/:id` | Delete message | Admin |

## 🔐 Authentication

### Registering a User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logging In

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Using Protected Endpoints

Include the JWT token in the Authorization header:

```bash
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Demo Credentials

**Admin User:**
- Email: `admin@beskydy.cz`
- Password: `adminpass123`

**Regular User:**
- Email: `user@beskydy.cz`
- Password: `userpass123`

## 🗄 Database Schema

### Tables

1. **users** - User accounts with authentication
2. **attractions** - Tourist attractions
3. **accommodation** - Hotels, pensions, cottages
4. **activities** - Available activities
5. **bookings** - User bookings
6. **contacts** - Contact form submissions

See [database/schema.sql](database/schema.sql) for complete schema.

## 🧪 Testing

### Manual Testing with curl

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Get attractions:**
```bash
curl http://localhost:3000/api/attractions
```

**Create booking (with token):**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "booking_type": "accommodation",
    "item_id": 1,
    "check_in_date": "2026-06-01",
    "check_out_date": "2026-06-05",
    "number_of_guests": 2,
    "total_price": 5000.00
  }'
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

## 🐛 Troubleshooting

### Database Connection Issues

1. **Check if PostgreSQL is running:**
   ```bash
   docker ps
   ```

2. **View database logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Restart database:**
   ```bash
   docker-compose restart
   ```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
# Wait 10 seconds
npm run db:setup
```

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS enabled with origin restriction
- ✅ Environment variable configuration
- ✅ Role-based access control
- ✅ Input validation

## 📄 License

This project is part of a university coursework for Client-Side & Server-Side Web Development at PEF CZU Prague.

---

**Developed by:** Bunna CHOM, Hakimov Sunnat, Adepu Gopi Krishna, Tilek Tekinov
**Course:** Client-Side & Server-Side Web Development
**Institution:** Faculty of Economics and Management, PEF CZU Prague
**Academic Year:** 2024/2025
