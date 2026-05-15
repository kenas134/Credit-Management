# Credit Management System

A production-grade, mobile-first credit & debt tracking system for small retail businesses.

---

## 🏗️ Architecture

```
credit-management-system/
├── backend/          # Node.js + Express + Prisma API
├── mobile/           # React Native (Expo Router) app
├── shared/           # Shared constants (enums, risk levels)
├── docs/             # API reference, SDLC, deployment guide
└── docker-compose.yml
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env          # Fill in DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate dev        # Run migrations
npx prisma db seed            # Seed demo data (optional)
npm run dev                   # Starts on http://localhost:5000
```

### 2. Mobile App

```bash
cd mobile
cp .env.example .env          # Set EXPO_PUBLIC_API_URL
npm install --legacy-peer-deps
npx expo start                # Scan QR with Expo Go
```

### 3. Docker (Full Stack)

```bash
docker compose up --build     # PostgreSQL + Backend auto-migrates
```

---

## 📱 Features

| Feature | Status |
|---------|--------|
| JWT Auth (access + refresh tokens) | ✅ |
| Customer management (CRUD) | ✅ |
| Credit ledger with FIFO payment logic | ✅ |
| Risk scoring (Low/Medium/High/Critical) | ✅ |
| Aging analysis (30/60/90d buckets) | ✅ |
| Automated overdue reminders (cron) | ✅ |
| Push notifications (Expo) | ✅ |
| Offline sync detection | ✅ |
| Dashboard KPIs | ✅ |
| Full reporting suite | ✅ |
| Swagger API docs (`/api-docs`) | ✅ |
| Postman collection | ✅ |

---

## 🧪 Testing

```bash
# Backend unit + integration tests
cd backend
npm test

# Mobile utility tests
cd mobile
npm test
```

---

## 📄 Documentation

| Doc | Path |
|-----|------|
| Developer Setup | `docs/SETUP.md` |
| API Reference | `docs/API_REFERENCE.md` |
| SDLC Documentation | `docs/SDLC.md` |
| Deployment Guide | `docs/DEPLOYMENT.md` |
| Postman Collection | `docs/CreditManager.postman_collection.json` |

---

## 🔐 Default Credentials (after seed)

```
Phone: +233241234567
Password: Admin@1234
```

---

## 📦 Tech Stack

**Backend:** Node.js · Express · Prisma ORM · PostgreSQL · JWT · node-cron · Swagger  
**Mobile:** React Native · Expo Router · React Query · Zustand · Axios · react-hook-form  
**DevOps:** Docker · Docker Compose · Railway (production)
