# CarePulse AI - Production Deployment Guide

This guide details how to deploy the CarePulse AI full-stack application to staging or production environments.

---

## 1. Architecture Overview

```
[ Elderly / Caregiver Browser ]
               │ (HTTPS)
               ▼
   [ Reverse Proxy (Nginx / Caddy) ]
   ├── Static Assets & React SPA ──> [ frontend/dist/ ]
   └── API Requests (/api/*, /health) ──> [ FastAPI / Uvicorn (Port 8000) ]
                                                ├── [ SmartHealth ML Pipeline (XGBoost) ]
                                                └── [ Managed MySQL 8.0 Database ]
```

---

## 2. Production Environment Variables

Configure on your server or container platform:

```env
PROJECT_NAME="CarePulse AI - Production"
VERSION="2.0.0"
HOST="0.0.0.0"
PORT=8000

# Managed Cloud MySQL (e.g. AWS RDS, DigitalOcean Managed MySQL, GCP Cloud SQL)
MYSQL_HOST=db.production.internal
MYSQL_PORT=3306
MYSQL_DB=elderly_care_prod_db
MYSQL_USER=elderly_care_app
MYSQL_PASSWORD=SuperSecretProductionPassword!2026

# Security
SECRET_KEY=generate_a_64_character_hex_string_with_openssl
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Production Domains (Restrict CORS)
ALLOWED_ORIGINS=https://carepulse.yourdomain.com,https://app.yourdomain.com
```

---

## 3. Build & Combined Serving

FastAPI is already configured to automatically serve the built React frontend SPA from `frontend/dist/` when it exists:

```powershell
# 1. Build frontend
cd frontend
npm ci
npm run build
cd ..

# 2. Run database migrations
python -m alembic -c backend/alembic.ini upgrade head

# 3. Launch production server
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 4. HTTPS & Reverse Proxy Configuration (Nginx Example)

```nginx
server {
    listen 443 ssl http2;
    server_name carepulse.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/carepulse.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/carepulse.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 5. Automated Database Backups in Production

Set up a daily cron job to run `scripts/backup-db.ps1` or `mysqldump` and upload encrypted backups to cloud storage (e.g. AWS S3 / Google Cloud Storage).
