# Credit Management System — Production Deployment Guide

## Backend Deployment (Railway)

### 1. Create Railway Account
Visit https://railway.app and sign in with GitHub.

### 2. Deploy PostgreSQL
```
New Project → Add PostgreSQL
```
Copy the `DATABASE_URL` from the Variables tab.

### 3. Deploy Backend

```bash
# In your repo root, Railway detects Node.js automatically
# Make sure you have a Procfile or start command
```

Add `Procfile` in `backend/`:
```
web: node src/server.js
```

Set environment variables in Railway dashboard:
```
DATABASE_URL=<from PostgreSQL service>
PORT=5000
NODE_ENV=production
JWT_SECRET=<generate 64-char random string>
JWT_REFRESH_SECRET=<generate 64-char random string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### 4. Run Migrations on Railway

```bash
# In Railway shell or via railway CLI
npx prisma migrate deploy
npx prisma db seed
```

---

## Backend Deployment (Render)

### 1. Create Web Service
- Connect your GitHub repository
- Root directory: `credit-management-system/backend`
- Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
- Start command: `node src/server.js`

### 2. Create PostgreSQL Database
- New → PostgreSQL
- Copy Internal Database URL to `DATABASE_URL` env var

---

## Mobile App Deployment (Expo EAS)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Configure EAS
```bash
cd mobile
eas build:configure
```

This creates `eas.json`. Edit for your needs:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 3. Set Production API URL
In `mobile/.env` (or EAS secrets):
```
EXPO_PUBLIC_API_URL=https://your-backend.railway.app
```

### 4. Build for Android
```bash
eas build --platform android --profile production
```

### 5. Build for iOS
```bash
eas build --platform ios --profile production
```

### 6. Submit to Stores
```bash
# Google Play
eas submit --platform android

# Apple App Store
eas submit --platform ios
```

---

## Environment Variables Reference

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `PORT` | ✅ | HTTP port (default 5000) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `JWT_SECRET` | ✅ | Access token signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | ✅ | Refresh token signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | ✅ | Access token TTL (e.g., `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | Refresh token TTL (e.g., `7d`) |
| `BCRYPT_ROUNDS` | ✅ | Password hash rounds (10 dev, 12 prod) |

### Mobile

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_URL` | ✅ | Backend base URL |

---

## Health Check

Your backend exposes: `GET /health`

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

Configure your hosting provider to ping this endpoint for uptime monitoring.

---

## Scaling Considerations

| Concern | Solution |
|---------|----------|
| Multiple backend instances | Stateless JWT (no session affinity needed) |
| Cron job deduplication | Use a distributed lock (Redis) or a dedicated worker service |
| Large customer datasets | Implement cursor-based pagination for ledger endpoints |
| Push notifications at scale | Integrate Expo Push Notification Service |
