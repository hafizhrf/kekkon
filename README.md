# 💍 Kekkon - Undangan Pernikahan Digital

**Kekkon** (結婚) adalah platform undangan pernikahan digital **100% gratis** untuk membantu calon mempelai di Indonesia membuat undangan yang cantik dan modern.

## ✨ Fitur

- 🎨 **Multiple Templates** - Geometric Modern, Minimalist, Floral, Islamic, dll
- 📱 **Responsive Design** - Tampilan sempurna di semua device
- 🎵 **Background Music** - Tambahkan lagu romantis
- 📸 **Photo Gallery** - Upload hingga 10 foto
- ✅ **RSVP & Ucapan** - Konfirmasi kehadiran dan pesan dari tamu
- 🎁 **Gift Section** - Info rekening bank dan e-wallet
- 📊 **QR Code** - Generate dan download QR untuk setiap tamu
- 🔒 **Secure** - Rate limiting, XSS & SQL injection protection
- 💰 **Google AdSense Ready** - Monetisasi undangan

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS v4
- Framer Motion
- TipTap Editor
- React Hot Toast

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- JWT Authentication
- Sharp (image processing)
- Multer (file upload)

---

## 📋 Daftar Isi

1. [Quick Start (Development)](#-quick-start-development)
2. [Push ke GitHub](#-push-ke-github)
3. [Setup Google AdSense](#-setup-google-adsense)
4. [Deployment Lokal ke Domain](#-deployment-lokal-ke-domain)
5. [Deployment ke VPS](#-deployment-ke-vps-production)
6. [Environment Variables](#-environment-variables)
7. [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start (Development)

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Git

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/kekkon.git
cd kekkon
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Setup Environment

```bash
# Backend (.env di folder server)
cd server
cp .env.example .env

# Edit file .env
```

Isi file `server/.env`:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Jalankan Development Server

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

Buka browser: `http://localhost:5173`

---

## 📤 Push ke GitHub

### 1. Buat Repository Baru di GitHub

1. Buka https://github.com/new
2. Isi nama repository: `kekkon`
3. Pilih **Private** atau **Public**
4. Jangan centang "Initialize with README"
5. Klik **Create repository**

### 2. Setup Git Lokal

```bash
# Masuk ke folder project
cd kekkon

# Initialize git (jika belum)
git init

# Buat .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment
.env
.env.local
.env.*.local

# Build output
dist/
build/

# Database
*.db
*.sqlite

# Uploads (optional - uncomment jika tidak ingin upload file user)
# server/uploads/*
# !server/uploads/.gitkeep

# Logs
*.log
npm-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Test
coverage/
EOF

# Add semua file
git add .

# Commit pertama
git commit -m "Initial commit: Kekkon"

# Tambah remote origin
git remote add origin https://github.com/USERNAME/kekkon.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### 3. Setup Branch Protection (Opsional)

1. Buka repository di GitHub
2. Settings → Branches → Add rule
3. Branch name pattern: `main`
4. Centang "Require pull request reviews"
5. Save changes

---

## 💰 Setup Google AdSense

### 1. Daftar Google AdSense

1. Buka https://www.google.com/adsense/
2. Klik **Get Started**
3. Masukkan URL website Anda
4. Isi informasi yang diperlukan
5. Tunggu approval (biasanya 1-14 hari)

### 2. Dapatkan Publisher ID

Setelah disetujui:
1. Login ke AdSense dashboard
2. Klik **Account** → **Account information**
3. Copy **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### 3. Buat Ad Units

1. Di AdSense dashboard, klik **Ads** → **By ad unit**
2. Pilih tipe iklan:
   - **Display ads** - untuk banner
   - **In-article ads** - untuk di antara konten
3. Beri nama dan klik **Create**
4. Copy **data-ad-slot** (format: `1234567890`)

### 4. Update Kode di Project

**A. Tambahkan Script AdSense di `client/index.html`:**

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kekkon - Undangan Pernikahan Digital</title>
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
         crossorigin="anonymous"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**B. Update `client/src/components/shared/AdUnit.jsx`:**

Ganti placeholder dengan ID Anda:
```jsx
// Ganti ini
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // Publisher ID Anda
const AD_SLOTS = {
  horizontal: '1234567890',  // Slot untuk banner horizontal
  inArticle: '0987654321',   // Slot untuk in-article
  footer: '1122334455',      // Slot untuk footer
};
```

### 5. Testing AdSense

- AdSense tidak tampil di `localhost`
- Untuk testing, deploy ke domain/subdomain yang sudah diverifikasi
- Gunakan `AdPlaceholder` component selama development

---

## 🏠 Deployment Lokal ke Domain

Untuk menjalankan di komputer lokal tapi bisa diakses via domain (misalnya untuk demo atau testing).

### Prerequisites

- Domain yang sudah Anda miliki (contoh: `undangan.domain.com`)
- Akses ke DNS management domain
- Router dengan port forwarding (atau gunakan Cloudflare Tunnel)

### Metode 1: Menggunakan Cloudflare Tunnel (Recommended)

#### 1. Setup Cloudflare

1. Daftar di https://www.cloudflare.com/
2. Tambahkan domain Anda ke Cloudflare
3. Update nameserver di registrar domain

#### 2. Install Cloudflared

```bash
# Windows (dengan winget)
winget install Cloudflare.cloudflared

# Atau download dari:
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

#### 3. Login ke Cloudflare

```bash
cloudflared tunnel login
```

#### 4. Buat Tunnel

```bash
# Buat tunnel baru
cloudflared tunnel create wedding-app

# Akan muncul Tunnel ID, simpan untuk nanti
```

#### 5. Konfigurasi Tunnel

Buat file `~/.cloudflared/config.yml`:
```yaml
tunnel: YOUR-TUNNEL-ID
credentials-file: /path/to/.cloudflared/YOUR-TUNNEL-ID.json

ingress:
  - hostname: undangan.domain.com
    service: http://localhost:5000
  - service: http_status:404
```

#### 6. Route DNS

```bash
cloudflared tunnel route dns wedding-app undangan.domain.com
```

#### 7. Build & Jalankan

```bash
# Build frontend
cd client
npm run build

# Copy hasil build ke server
# (atau setup serve static di Express)

# Jalankan server
cd ../server
npm start

# Di terminal lain, jalankan tunnel
cloudflared tunnel run wedding-app
```

### Metode 2: Port Forwarding + Dynamic DNS

#### 1. Setup Dynamic DNS

Gunakan layanan seperti:
- No-IP (https://www.noip.com/)
- DuckDNS (https://www.duckdns.org/)
- Dynu (https://www.dynu.com/)

#### 2. Port Forwarding di Router

1. Akses router (biasanya `192.168.1.1`)
2. Cari menu **Port Forwarding** / **NAT**
3. Tambah rule:
   - External Port: `80` dan `443`
   - Internal IP: IP komputer Anda (contoh: `192.168.1.100`)
   - Internal Port: `5000`

#### 3. Setup Nginx sebagai Reverse Proxy (Windows)

Download Nginx untuk Windows: https://nginx.org/en/download.html

Konfigurasi `nginx.conf`:
```nginx
http {
    server {
        listen 80;
        server_name undangan.domain.com;

        location / {
            proxy_pass http://127.0.0.1:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

#### 4. CNAME di DNS

Tambahkan CNAME record:
```
undangan.domain.com -> your-ddns-hostname.duckdns.org
```

---

## 🌐 Deployment ke VPS (Production)

### Prerequisites

- VPS dengan Ubuntu 20.04+ (DigitalOcean, Vultr, Linode, AWS, dll)
- Domain yang sudah pointing ke IP VPS
- SSH access ke VPS

### 1. Setup VPS

#### Connect ke VPS

```bash
ssh root@YOUR_VPS_IP
```

#### Update System

```bash
apt update && apt upgrade -y
```

#### Install Node.js

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Verify
node --version
npm --version
```

#### Install PM2

```bash
npm install -g pm2
```

#### Install Nginx

```bash
apt install -y nginx
systemctl enable nginx
```

### 2. Setup Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### 3. Clone & Setup Project

```bash
# Buat folder
mkdir -p /var/www
cd /var/www

# Clone repository
git clone https://github.com/USERNAME/kekkon.git
cd kekkon

# Install dependencies
cd server
npm install --production

cd ../client
npm install
npm run build
```

### 4. Setup Environment Production

```bash
# Buat file .env untuk production
cd /var/www/kekkon/server
nano .env
```

Isi `.env`:
```env
PORT=5000
JWT_SECRET=GENERATE-RANDOM-STRING-64-CHARS
NODE_ENV=production
FRONTEND_URL=https://undangan.domain.com
```

Generate random string:
```bash
openssl rand -hex 32
```

### 5. Setup PM2

```bash
cd /var/www/kekkon/server

# Start dengan PM2
pm2 start server.js --name kekkon-api

# Save PM2 config
pm2 save

# Setup auto-start on reboot
pm2 startup
```

### 6. Konfigurasi Nginx

```bash
nano /etc/nginx/sites-available/kekkon
```

Isi konfigurasi:
```nginx
server {
    listen 80;
    server_name undangan.domain.com www.undangan.domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name undangan.domain.com www.undangan.domain.com;

    # SSL akan disetup oleh Certbot
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Frontend (React build)
    root /var/www/kekkon/client/dist;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Uploads folder
    location /uploads {
        alias /var/www/kekkon/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/kekkon /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 7. Setup SSL dengan Certbot

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
certbot --nginx -d undangan.domain.com -d www.undangan.domain.com

# Auto-renewal sudah otomatis disetup
```

### 8. Setup Uploads Directory

```bash
mkdir -p /var/www/kekkon/server/uploads
chown -R www-data:www-data /var/www/kekkon/server/uploads
chmod 755 /var/www/kekkon/server/uploads
```

### 9. Setup Backup (Opsional tapi Recommended)

```bash
# Buat script backup
nano /root/backup-wedding.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
cp /var/www/kekkon/database/wedding.db $BACKUP_DIR/kekkon_$DATE.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/kekkon/server/uploads

# Keep only last 7 backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x /root/backup-kekkon.sh

# Setup cron job (daily backup at 2 AM)
crontab -e
# Tambahkan:
0 2 * * * /root/backup-kekkon.sh
```

### 10. Update Deployment

Script untuk update:
```bash
nano /root/update-kekkon.sh
```

```bash
#!/bin/bash
cd /var/www/kekkon

# Pull latest changes
git pull origin main

# Update backend
cd server
npm install --production

# Update frontend
cd ../client
npm install
npm run build

# Restart PM2
pm2 restart kekkon-api

echo "Update completed!"
```

```bash
chmod +x /root/update-kekkon.sh
```

---

## 🔐 Environment Variables

### Server (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port untuk server | `5000` |
| `JWT_SECRET` | Secret key untuk JWT (min 32 chars) | `abc123...` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `FRONTEND_URL` | URL frontend untuk CORS | `https://undangan.domain.com` |

### Client

Environment variables untuk client diset saat build di `vite.config.js` atau via `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL API backend |

---

## 🔧 Troubleshooting

### Error: CORS

**Masalah:** Request diblokir oleh CORS

**Solusi:**
1. Pastikan `FRONTEND_URL` di `.env` sesuai dengan domain frontend
2. Untuk development, pastikan port sesuai

### Error: Database Locked

**Masalah:** `SQLITE_BUSY: database is locked`

**Solusi:**
```bash
# Restart PM2
pm2 restart kekkon-api
```

### Error: 502 Bad Gateway

**Masalah:** Nginx tidak bisa connect ke backend

**Solusi:**
```bash
# Cek status PM2
pm2 status

# Cek logs
pm2 logs kekkon-api

# Restart jika perlu
pm2 restart kekkon-api
```

### Error: Permission Denied Uploads

**Masalah:** Tidak bisa upload file

**Solusi:**
```bash
chown -R www-data:www-data /var/www/kekkon/server/uploads
chmod 755 /var/www/kekkon/server/uploads
```

### Error: SSL Certificate

**Masalah:** Certificate expired atau invalid

**Solusi:**
```bash
# Renew certificate
certbot renew

# Restart nginx
systemctl restart nginx
```

### Cek Logs

```bash
# PM2 logs
pm2 logs kekkon-api

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

## 🤝 Contributing

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 💬 Support

Jika ada pertanyaan atau butuh bantuan:
- Buat Issue di GitHub

---

Made with ❤️ by **Kekkon** for Indonesian Weddings
