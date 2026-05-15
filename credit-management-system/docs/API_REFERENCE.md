# Credit Management System — API Reference

Base URL: `http://localhost:5000/api/v1`

All authenticated endpoints require: `Authorization: Bearer <access_token>`

---

## Authentication

### POST /auth/register
Register a new shop owner account.

**Body:**
```json
{
  "name": "Kwame Asante",
  "phone": "+233501234567",
  "shopName": "Asante Mini-Market",
  "password": "securePassword123"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": { "id": "uuid", "name": "Kwame Asante", "role": "OWNER", "shop": {...} }
  }
}
```

---

### POST /auth/login
```json
{ "phone": "+233501234567", "password": "securePassword123" }
```

---

### POST /auth/refresh
```json
{ "refreshToken": "eyJhbGci..." }
```

---

### GET /auth/me *(Auth required)*
Returns current user profile with shop info.

---

### PATCH /auth/change-password *(Auth required)*
```json
{ "currentPassword": "old", "newPassword": "new" }
```

---

### POST /auth/logout *(Auth required)*
Invalidates the refresh token server-side.

---

## Customers

### GET /customers *(Auth required)*
List all customers with pagination and search.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` — searches name and phone
- `status` — `ACTIVE | OVERDUE | SUSPENDED`

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [...],
    "total": 45,
    "page": 1,
    "pages": 3
  }
}
```

---

### POST /customers *(Auth required)*
Create a new customer (also creates their credit account).

```json
{
  "fullName": "Ama Boateng",
  "phone": "+233244123456",
  "email": "ama@email.com",
  "address": "Kumasi, Ghana",
  "creditLimit": 800,
  "notes": "Reliable customer"
}
```

---

### GET /customers/:id *(Auth required)*
Get full customer profile with credit account.

---

### PUT /customers/:id *(Auth required)*
Update customer details.

---

### DELETE /customers/:id *(Auth required — OWNER only)*
Soft-deactivate a customer.

---

### PATCH /customers/:id/credit-limit *(Auth required — OWNER only)*
```json
{ "creditLimit": 1500 }
```

---

### POST /customers/:id/refresh-risk *(Auth required)*
Recalculate and update the customer's risk score immediately.

---

## Credits & Ledger

### POST /credits *(Auth required)*
Issue credit to a customer.

```json
{
  "customerId": "uuid",
  "amount": 250.00,
  "description": "Groceries — rice, cooking oil, sugar",
  "dueDate": "2025-12-31"
}
```

**Business rules enforced:**
- Rejects if `amount + currentBalance > creditLimit`
- Rejects if customer is `SUSPENDED`
- Auto-sets account status to `ACTIVE` if previously PAID

---

### GET /credits/:customerId/ledger *(Auth required)*
Get full transaction history for a customer.

**Query params:** `page`, `limit`, `type` (CREDIT | PAYMENT)

---

### GET /credits/:customerId/summary *(Auth required)*
Returns account balance, limit, total credited, total paid, and status.

---

### PATCH /credits/transactions/:txId/void *(Auth required — OWNER only)*
Void a transaction and reverse the balance. Only PENDING transactions can be voided.

---

## Payments

### POST /payments *(Auth required)*
Record a payment against a customer's outstanding balance.

```json
{
  "customerId": "uuid",
  "amount": 100.00,
  "notes": "Cash payment received"
}
```

**Payment logic:**
- Applies payment to oldest unpaid transactions first (FIFO)
- Supports partial payments (updates transaction status to PARTIAL)
- Automatically marks account as PAID when balance reaches 0
- Recalculates customer risk score on payment

---

### POST /payments/bulk *(Auth required)*
Record a single payment amount across multiple transactions.

```json
{
  "customerId": "uuid",
  "amount": 500.00,
  "transactionIds": ["uuid1", "uuid2"]
}
```

---

### GET /payments/history *(Auth required)*
Get payment history for the shop with pagination.

---

## Reports

### GET /reports/outstanding *(Auth required)*
List all customers with a non-zero balance, sorted by balance descending.

---

### GET /reports/aging *(Auth required)*
Returns aging analysis bucketed by days overdue:

```json
{
  "current": { "count": 12, "total": 4500.00 },
  "days30": { "count": 5, "total": 1200.00 },
  "days60": { "count": 3, "total": 890.00 },
  "days90": { "count": 2, "total": 450.00 }
}
```

---

### GET /reports/payment-trend *(Auth required)*
Monthly payment collection for the last 6 months.

---

### GET /reports/kpis *(Auth required)*
Key business metrics:

```json
{
  "totalOutstanding": 12450.00,
  "collectionRate": 78.5,
  "totalCustomers": 45,
  "activeCredits": 23,
  "overdueCount": 7,
  "avgRiskScore": 3.4,
  "writtenOff": 200.00
}
```

---

## Dashboard

### GET /dashboard *(Auth required)*
Combined endpoint for the mobile dashboard — KPIs + overdue customers + recent transactions in one call.

---

## Notifications

### GET /notifications *(Auth required)*
Get all notifications for the authenticated user.

**Query:** `page`, `limit`, `isRead` (true | false)

---

### PATCH /notifications/:id/read *(Auth required)*
Mark a single notification as read.

---

### PATCH /notifications/read-all *(Auth required)*
Mark all notifications as read.

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["Field-level validation errors (optional)"]
}
```

| HTTP Code | Meaning |
|-----------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing or expired token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource Not Found |
| 409 | Conflict (e.g., phone already registered) |
| 422 | Business Rule Violation (e.g., credit limit exceeded) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Rate Limits

| Endpoint Group | Limit |
|----------------|-------|
| Auth (login/register) | 10 requests / 15 minutes per IP |
| All other endpoints | 100 requests / 15 minutes per IP |
