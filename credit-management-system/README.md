# Credit Management System for Local Shops & Mini-Markets

A full-stack mobile application to digitize and manage informal credit/debt tracking for local shops, kiosks, and mini-markets.

## Monorepo Structure

```
credit-management-system/
├── backend/        # Express.js + Prisma + PostgreSQL
├── mobile/         # React Native + Expo
├── shared/         # Shared constants, schemas, utils
└── docs/           # Full SDLC documentation
```

## Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- Expo CLI (`npm install -g expo-cli`)
- Git

### 1. Clone & Install

```bash
git clone <repo-url>
cd credit-management-system

# Install backend deps
cd backend && npm install

# Install mobile deps
cd ../mobile && npm install
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL and JWT secrets
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 3. Mobile Setup

```bash
cd mobile
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your backend URL
npx expo start
```

## Features

### MVP
- ✅ JWT Authentication (shop owner login/register)
- ✅ Customer management (CRUD)
- ✅ Credit ledger (create, track, update balances)
- ✅ Payment tracking (partial, full, overdue)
- ✅ Reports (outstanding, aging, analytics)
- ✅ Push notifications & reminders

### Advanced
- ✅ Offline-first with sync queue
- ✅ AI-based risk scoring
- ✅ Analytics dashboard
- ✅ Audit logs
- ✅ Rate limiting & security headers

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Mobile    | React Native, Expo, Expo Router|
| State     | Zustand + React Query          |
| Backend   | Node.js, Express.js            |
| ORM       | Prisma                         |
| Database  | PostgreSQL                     |
| Auth      | JWT (access + refresh tokens)  |
| Styling   | NativeWind (TailwindCSS)       |

## Git Branch Strategy

```
main → production-ready
develop → integration branch
feature/* → feature branches
bugfix/* → bug fixes
```

## License
MIT
