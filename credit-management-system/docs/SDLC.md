# Credit Management System — SDLC Documentation

## 1. Project Overview

**Product:** Credit Management System for Local Shops & Mini-Markets  
**Version:** 1.0.0  
**Architecture:** Monorepo (Backend API + React Native Mobile App)  
**Target Users:** Small shop owners and mini-market operators in Ghana and similar markets

### Problem Statement
Local shops in Ghana and across sub-Saharan Africa extend informal credit ("buying on account") to regular customers. This is typically tracked in paper notebooks — prone to loss, fraud, human error, and disputes. This system digitizes the entire credit lifecycle.

### Solution
A mobile-first application allowing shop owners to:
- Record credits and payments digitally with a full audit trail
- Monitor outstanding balances with real-time risk scoring
- Receive automated reminders before payments go overdue
- Generate aging analysis and business analytics reports

---

## 2. Software Development Life Cycle (SDLC) — Agile Approach

### Phase 1: Requirements Analysis ✅
**Duration:** Week 1

| Category | Requirements |
|----------|-------------|
| Functional | Customer CRUD, credit issuance, payment recording, reports, notifications |
| Non-Functional | <200ms API response, JWT auth, rate limiting, offline mobile support |
| Business | Multi-shop support, role-based access (OWNER/STAFF), credit limit enforcement |
| Security | bcrypt passwords, refresh token rotation, HTTPS-ready, input sanitization |

**User Stories (MoSCoW):**

| Priority | Story |
|----------|-------|
| Must Have | As an owner, I can add a customer and set their credit limit |
| Must Have | As an owner, I can issue credit and record payments |
| Must Have | I receive daily reminders for overdue payments |
| Should Have | I can see aging analysis (30/60/90 days) |
| Should Have | Risk scores automatically update based on repayment history |
| Could Have | Bulk payment across multiple outstanding transactions |
| Won't Have (v1) | SMS integration, multi-currency, web dashboard |

---

### Phase 2: System Design ✅
**Duration:** Week 1-2

#### Architecture Pattern
```
┌─────────────────────────────────────────────────────┐
│                  Mobile App (Expo)                  │
│  React Native + Expo Router + React Query + Zustand │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS REST API
┌────────────────────▼────────────────────────────────┐
│                Backend (Node.js/Express)             │
│  Controllers → Services → Repositories → Prisma ORM │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              PostgreSQL Database                     │
│      Users, Shops, Customers, Accounts, Txns        │
└─────────────────────────────────────────────────────┘
```

#### Database Entity Relationship

```
User (1) ──── (1) Shop
Shop (1) ──── (N) Customer
Customer (1) ── (1) CreditAccount
CreditAccount (1) ── (N) Transaction
Transaction (1) ── (N) Payment
User (1) ──── (N) Notification
```

#### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | Prisma | Type safety, migrations, excellent DX |
| Auth | JWT + Refresh Tokens | Stateless, scalable, mobile-friendly |
| Password Hashing | bcryptjs (10 rounds) | Industry standard, CPU-bound security |
| Validation | Joi | Declarative, composable schemas |
| Cron Jobs | node-cron | Lightweight, no external queue needed for v1 |
| State Management | Zustand | Lightweight, simple async patterns |
| Data Fetching | React Query | Server state caching, background refetch |

---

### Phase 3: Implementation ✅
**Duration:** Week 2-4

#### Backend Layer Architecture (Clean Architecture)

```
HTTP Request
    ↓
Route (src/routes/)         — URL mapping + middleware attachment
    ↓
Middleware                  — Auth, rate limit, validation
    ↓
Controller (src/controllers/) — Deserialize request, call service, serialize response
    ↓
Service (src/services/)      — Business rules, orchestration
    ↓
Repository (src/repositories/) — Prisma queries, DB transactions
    ↓
Prisma ORM
    ↓
PostgreSQL
```

#### Risk Scoring Algorithm

The `calculateRiskScore` utility assigns a 0–10 risk score:

| Factor | Weight | Logic |
|--------|--------|-------|
| Overdue rate | 35% | `overdueCount / totalTransactions` |
| Payment on-time rate | 30% | `onTimePayments / totalPayments` |
| Outstanding balance ratio | 20% | `balance / creditLimit` |
| Account age | 10% | Older accounts = lower risk |
| Recent payment behavior | 5% | Payments in last 30 days |

Scores: `0.0–3.9` = Low | `4.0–6.9` = Medium | `7.0–10.0` = High Risk

#### Payment Application Logic (FIFO)

When a payment is received:
1. Sort unpaid/partial transactions by `createdAt ASC`
2. Apply payment to oldest transaction first
3. If payment > transaction amount → mark PAID, carry remainder forward
4. If payment < transaction amount → mark PARTIAL, record remaining amount
5. If all transactions PAID → set account status to PAID
6. Recalculate customer risk score
7. Create PAYMENT_RECEIVED notification

---

### Phase 4: Testing ✅
**Duration:** Week 3-4

#### Test Strategy

| Level | Tool | Coverage |
|-------|------|---------|
| Unit Tests | Jest | Auth utils, password hashing, aging calc, risk scoring |
| Integration Tests | Jest + Supertest | Full API endpoint testing with real DB |
| Manual Testing | Postman | Edge cases, error scenarios |

#### Test Files
- `src/tests/unit/auth.test.js` — JWT generation, password hashing
- `src/tests/unit/payment.test.js` — Aging buckets, risk score calculation
- `src/tests/integration/auth.api.test.js` — Register, login, refresh, logout flows
- `src/tests/integration/customer.api.test.js` — Full customer CRUD

---

### Phase 5: Deployment ✅
**Duration:** Week 4-5

See `docs/DEPLOYMENT.md` for full production deployment guide.

**Quick summary:**
- Backend: Railway, Render, or DigitalOcean App Platform
- Database: Railway PostgreSQL or Supabase
- Mobile: Expo EAS Build → Google Play Store / Apple App Store

---

## 3. Security Checklist

- [x] Passwords hashed with bcryptjs (10 rounds)
- [x] JWT tokens expire (15 min access, 7 day refresh)
- [x] Refresh token stored in DB, invalidated on logout
- [x] Rate limiting (10 req/15min for auth, 100/15min general)
- [x] Helmet.js HTTP security headers
- [x] CORS configured to whitelist known origins
- [x] Input validation via Joi on all endpoints
- [x] Role-based access control (OWNER-only for destructive actions)
- [x] Prisma parameterized queries (SQL injection prevention)
- [x] Error messages don't leak internal details in production

---

## 4. Performance Considerations

| Area | Implementation |
|------|---------------|
| DB Queries | Indexed on `shopId`, `phone`, `status`, `dueDate` |
| Pagination | All list endpoints paginated (max 100 per page) |
| Response Compression | `compression` middleware enabled |
| Query Optimization | `select` fields explicitly in Prisma (no `SELECT *`) |
| Caching | React Query client-side caching (2min stale time) |
| Offline Support | Zustand sync queue for offline payment recording |

---

## 5. Future Roadmap (v2+)

| Feature | Priority |
|---------|----------|
| SMS notifications via Africa's Talking | High |
| WhatsApp payment reminders | High |
| PDF statement generation | Medium |
| Multi-currency support (GHS, NGN, KES) | Medium |
| Staff accounts with restricted access | Medium |
| Expense tracking for shop owners | Low |
| Web dashboard for analytics | Low |
| Data export (CSV, Excel) | Low |
| Biometric authentication | Low |
