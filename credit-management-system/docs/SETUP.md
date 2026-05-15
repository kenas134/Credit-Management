# Credit Management System — Developer Setup Guide

## Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Node.js | 18.x LTS | https://nodejs.org |
| npm | 9.x | bundled with Node |
| PostgreSQL | 14.x | https://postgresql.org |
| Expo CLI | Latest | `npm i -g expo-cli` |
| Git | Any | https://git-scm.com |

---

## 1. Clone the Repository

```bash
git clone https://github.com/kenas134/Credit-Management.git
cd Credit-Management/credit-management-system
```

---

## 2. Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/credit_management_db"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

### 2.3 Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE credit_management_db;
```

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Generate Prisma client:

```bash
npx prisma generate
```

Seed with sample data (optional):

```bash
npm run seed
```

### 2.4 Start the Backend

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The API will be available at: **http://localhost:5000**

Swagger docs at: **http://localhost:5000/api-docs**

---

## 3. Mobile App Setup

### 3.1 Install Dependencies

```bash
cd ../mobile
npm install
```

### 3.2 Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# For Android emulator (pointing to your machine's localhost)
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000

# For iOS simulator
# EXPO_PUBLIC_API_URL=http://localhost:5000

# For physical device (replace with your machine's local IP)
# EXPO_PUBLIC_API_URL=http://192.168.x.x:5000
```

### 3.3 Start the Mobile App

```bash
npm start
# or
npx expo start
```

Then press:
- **`a`** — open Android emulator
- **`i`** — open iOS simulator
- **Scan QR**  — open on physical device with Expo Go app

---

## 4. Running Tests

### Backend Tests

```bash
cd backend

# Unit tests only
npm test -- --testPathPattern=unit

# Integration tests (requires running DB)
npm test -- --testPathPattern=integration

# All tests with coverage
npm run test:coverage
```

### Watch Mode

```bash
npm run test:watch
```

---

## 5. Database Management

```bash
# Open Prisma Studio (visual DB browser)
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name <migration_name>

# View current migration status
npx prisma migrate status
```

---

## 6. Project Structure

```
credit-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.js              # Sample data seeder
│   │   └── migrations/          # Auto-generated migrations
│   └── src/
│       ├── app.js               # Express app setup
│       ├── server.js            # Entry point
│       ├── config/              # DB, Swagger configs
│       ├── constants/           # Enums (roles, status)
│       ├── controllers/         # HTTP request handlers
│       ├── jobs/                # Cron jobs (reminders, overdue)
│       ├── middlewares/         # Auth, validation, rate limit
│       ├── repositories/        # DB access layer (Prisma)
│       ├── routes/              # Express route definitions
│       ├── services/            # Business logic layer
│       ├── tests/               # Unit and integration tests
│       ├── utils/               # Helpers (logger, tokens, etc.)
│       └── validators/          # Joi validation schemas
├── mobile/
│   ├── app/                     # Expo Router screens
│   │   ├── (auth)/              # Login, Register
│   │   ├── (tabs)/              # Dashboard, Customers, Reports, Settings
│   │   ├── customer/            # Customer detail, Add customer
│   │   ├── payment/             # Record payment modal
│   │   ├── notification/        # Notifications screen
│   │   └── profile/             # Profile & password screen
│   └── src/
│       ├── api/                 # Axios + API service calls
│       ├── constants/           # Colors, endpoints, theme tokens
│       ├── hooks/               # React Query hooks
│       ├── store/               # Zustand state stores
│       └── utils/               # Mobile utilities
├── shared/
│   └── constants/               # Shared enums (both platforms)
└── docs/                        # SDLC documentation
```

---

## 7. Cron Jobs

The backend automatically starts these jobs:

| Job | Schedule | Action |
|-----|----------|--------|
| `reminder.job.js` | Daily at 8:00 AM | Sends notifications for payments due within 3 days |
| `overdue.job.js` | Daily at 6:00 AM | Marks expired transactions OVERDUE, recalculates risk |
| `analytics.job.js` | Weekly Sunday 2 AM | Batch-recalculates all customer risk scores |

---

## 8. Common Issues

### Port 5000 already in use
```bash
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Prisma Client not generated
```bash
cd backend && npx prisma generate
```

### Android emulator can't reach backend
- Use `10.0.2.2:5000` instead of `localhost:5000` in `.env`

### `MODULE_NOT_FOUND` error on startup
```bash
cd backend && npm install
```
