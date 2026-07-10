# 🏕️ GearUp – Rent Sports & Outdoor Gear Instantly

A modern and scalable RESTful backend API for a **Sports & Outdoor Gear Rental Platform** where customers can rent equipment, providers can manage inventory and rental requests, and admins can oversee the entire platform.

Built with **Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT Authentication, and Stripe Payment Integration**.

---

## 🌐 Live API

**Base URL**

https://gearup-backend-project.onrender.com

---


# 📖 Project Overview

GearUp is a backend application designed for renting sports and outdoor equipment.

The system supports three different user roles:

- Customer
- Provider
- Admin

Customers can browse available gear, place rental orders, make secure payments, track rental status, and leave reviews after completing rentals.

Providers can manage their inventory, receive rental requests, update rental statuses, and monitor incoming orders.

Admins have full control over users, rental activities, and platform categories.

The project follows a clean modular architecture with proper authentication, authorization, validation, error handling, and scalable API design.

---

# ✨ Key Features

## 🌍 Public

- Browse all available gear
- View gear details
- Search gear
- Filter by category
- Filter by price
- Filter by brand
- Filter by availability

---

## 👤 Customer

- Register & Login
- JWT Authentication
- Update Profile
- Rent Gear
- View Rental History
- Track Rental Status
- Stripe Payment Integration
- Leave Reviews

---

## 🏪 Provider

- Add Gear
- Update Gear
- Delete Gear
- Manage Stock
- View Incoming Orders
- Confirm Rentals
- Update Rental Status
- Dashboard Summary

---

## 🛡️ Admin

- View All Users
- Suspend / Activate Users
- View All Rentals
- Manage Categories
- Dashboard Analytics

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT
- bcryptjs

## Payment

- Stripe

## Validation

- Manual Validation

## Deployment

- Render
- Prisma PostgreSQL

---


# 🔐 Authentication

Authentication is handled using **JWT (JSON Web Token)**.

Protected routes require the following header:

```
Authorization: Bearer <access_token>
```

---

# 👥 User Roles

| Role | Description |
|------|-------------|
| Customer | Rent sports gear |
| Provider | Manage rental inventory |
| Admin | Platform management |

---

# 🔒 Security Features

- JWT Authentication
- Role-Based Authorization
- Password Hashing
- Protected Routes
- Global Error Handling
- Input Validation
- Prisma ORM (SQL Injection Protection)

---

# 🚀 Getting Started

Follow these steps to set up the project locally.

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/apurbagoon1/gearup--backend-project.git

cd gearup--backend-project
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the project root and add the following variables.

```env
PORT=5000

APP_URL=https://gearup-backend-project.onrender.com/

DATABASE_URL=your_database_url

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRES_IN=7d

JWT_REFRESH_EXPIRES_IN=30d

STRIPE_SECRET_KEY=your_stripe_secret_key

STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

---

## 4️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

## 5️⃣ Run Database Migration

```bash
npx prisma migrate deploy
```

For local development:

```bash
npx prisma migrate dev
```

---

## 6️⃣ Seed Default Data

```bash
npm run seed
```

The seed script creates:

- Default Admin User
- Default Gear Categories

---

## 7️⃣ Start Development Server

```bash
npm run dev
```

---

## 8️⃣ Production Build

```bash
npm run build
```

---

## 9️⃣ Start Production Server

```bash
npm start
```

---



# 🗄 Database Design

The project uses **PostgreSQL** with **Prisma ORM**.

Main Models:

- User
- Category
- Gear
- RentalOrder
- Payment
- Review

Relationships:

- One Provider → Many Gear
- One Customer → Many Rentals
- One Gear → Many Rentals
- One Gear → Many Reviews
- One Rental → One Payment
- One Category → Many Gear

---

# 🌱 Seed Data

The project includes a Prisma seed script.

Seed includes:

### Default Admin User


### Default Categories:

- Cycling
- Camping
- Fitness
- Hiking
- Water Sports

---

# 📡 REST APIs

## Authentication

| Method | Endpoint |
|----------|-----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |
| PATCH | /api/auth/me |

---

## Categories

| Method | Endpoint |
|----------|-----------|
| GET | /api/categories |
| POST | /api/categories |
| PATCH | /api/categories/:id |
| DELETE | /api/categories/:id |

---

## Gear

| Method | Endpoint |
|----------|-----------|
| GET | /api/gear |
| GET | /api/gear/:id |
| POST | /api/gear |
| PATCH | /api/gear/:id |
| DELETE | /api/gear/:id |

---

## Rentals

| Method | Endpoint |
|----------|-----------|
| POST | /api/rentals |
| GET | /api/rentals |
| GET | /api/rentals/:id |
| PATCH | /api/rentals/:id/status |

---

## Payments

| Method | Endpoint |
|----------|-----------|
| POST | /api/payments/create |
| GET | /api/payments |
| PATCH | /api/payments/confirm/:paymentId |
| GET | /api/payments/:paymentId |

---

## Reviews

| Method | Endpoint |
|----------|-----------|
| POST | /api/reviews |
| GET | /api/reviews |
| GET | /api/reviews/gear/:gearId |

---

## Provider

| Method | Endpoint |
|----------|-----------|
| GET | /api/providers/dashboard |
| GET | /api/providers/orders |

---

## Admin

| Method | Endpoint |
|----------|-----------|
| GET | /api/admin/users |
| PATCH | /api/admin/users/:id/status |
| GET | /api/admin/rentals |
| GET | /api/admin/gear |

---


# 🧪 Testing

The APIs have been tested using:

- Postman
- JWT Authentication
- Role-Based Authorization
- Live Deployment Testing

---

# ⚠️ Error Response Format

The API follows a consistent error response structure.

```json
{
  "success": false,
  "message": "Validation failed.",
  "errorDetails": {
    "field": "email"
  }
}
```

Common HTTP Status Codes

| Status | Description |
|---------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |


---

# 🔒 Security Features

- JWT Authentication
- Role-Based Authorization
- Password Hashing using bcrypt
- Protected Routes
- Global Error Handler
- Consistent API Responses
- Environment Variable Configuration
- Stripe Secure Payment Integration

---


# 🧠 Challenges Solved

During development, several real-world backend challenges were addressed:

- Role-based access control
- Rental lifecycle management
- Rental status validation
- Booking conflict prevention
- Stock synchronization
- Stripe payment integration
- Payment webhook handling
- Prisma transactions
- Pagination and filtering
- Modular backend architecture



