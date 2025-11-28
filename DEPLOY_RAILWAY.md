# Deploy Kekkon ke Railway

## Langkah-langkah Deployment

### 1. Buat Akun Railway
- Kunjungi [railway.app](https://railway.app)
- Sign up dengan GitHub

### 2. Deploy dari GitHub
1. Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Connect repository `kekkon`
4. Railway akan auto-detect Node.js

### 3. Setup Environment Variables
Di Railway Dashboard > Variables, tambahkan:

```env
# Required
NODE_ENV=production
JWT_SECRET=generate-random-32-char-string-here
FRONTEND_URL=https://your-app.railway.app

# Superadmin (ganti dengan kredensial aman)
SUPERADMIN_EMAIL=admin@yourdomain.com
SUPERADMIN_PASSWORD=your-secure-password-here

# Port (Railway auto-set, tapi bisa di-override)
PORT=5000
```

**Generate JWT_SECRET:**
```bash
openssl rand -hex 32
```

### 4. Setup Volume untuk Database
1. Di Railway Dashboard, klik **"New"** > **"Database"** > **"Add Volume"**
2. Mount path: `/app/database`
3. Ini penting agar SQLite database persistent

Atau via CLI:
```bash
railway volume add --mount /app/database
```

### 5. Update Database Path (Opsional)
Jika menggunakan volume, pastikan path database di `server/config/database.js` menggunakan:
```javascript
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/wedding.db');
```

Lalu set environment variable:
```env
DATABASE_PATH=/app/database/wedding.db
```

### 6. Custom Domain (Opsional)
1. Di Railway > Settings > Domains
2. Klik **"Generate Domain"** untuk subdomain gratis
3. Atau tambahkan custom domain sendiri

### 7. Verify Deployment
Setelah deploy selesai:
- Buka URL aplikasi
- Test login admin di `/superadmin`
- Cek API health di `/api/health`

---

## Troubleshooting

### Build Failed
- Pastikan Node.js version >= 20
- Check logs di Railway Dashboard

### Database Reset Setiap Deploy
- Pastikan volume sudah di-mount ke `/app/database`
- Cek path database di environment variables

### CORS Error
- Update `FRONTEND_URL` dengan URL Railway yang benar
- Pastikan tidak ada trailing slash

### Memory Issues
- Free tier Railway: 512MB
- Jika kurang, upgrade plan atau optimize app

---

## Commands Berguna

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy manual
railway up

# View logs
railway logs

# Open app
railway open
```

---

## Struktur Project untuk Railway

```
kekkon/
├── railway.toml          # Railway config
├── nixpacks.toml         # Build config
├── package.json          # Root package.json
├── client/               # React frontend
│   ├── dist/            # Built files (auto-generated)
│   └── ...
├── server/               # Express backend
│   ├── server.js
│   └── ...
└── database/             # SQLite (mount volume here)
    └── wedding.db
```

---

## Estimasi Resource (Free Tier)

- **Memory:** 512MB (cukup untuk development)
- **Storage:** ~500MB untuk app + 1GB untuk volume
- **Execution:** 500 jam/bulan
- **Bandwidth:** Cukup untuk development

Untuk production dengan traffic tinggi, pertimbangkan upgrade ke plan berbayar.
