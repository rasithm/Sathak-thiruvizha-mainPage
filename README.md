# Sathak Thiruvizha 2026 — Habibi Fest

## Quick Start (Development)

```bash
# 1. Install all dependencies
cd client && npm install
cd ../server && npm install

# 2. Run backend (terminal 1)
cd server && npm run dev
# Server starts at http://localhost:5000

# 3. Run frontend (terminal 2)
cd client && npm run dev
# Frontend starts at http://localhost:3000
```

---

## Production Deployment (Single Server)

The server serves both the API and the built React frontend.

```bash
# Step 1: Build the React frontend
cd client
npm install
npm run build
# Creates client/dist/

# Step 2: Start the server
cd ../server
npm install
node index.js
# Serves everything at http://localhost:5000
# - API:      http://localhost:5000/api/*
# - Frontend: http://localhost:5000/*  (all routes)
```

### Environment Variables (server/.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | (set in .env) |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing secret | (set in .env) |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `habibi2026` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:3000` |

---

## Deploying to a VPS / Cloud

1. Upload the entire project folder to your server
2. Install Node.js 18+ on the server
3. Run the production steps above
4. Use **PM2** to keep the server running:
   ```bash
   npm install -g pm2
   cd server
   pm2 start index.js --name habibi-fest
   pm2 save
   pm2 startup
   ```
5. Use **Nginx** as a reverse proxy (optional, for custom domain):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Deploying to Render.com (Free)

1. Push code to GitHub
2. Create a **Web Service** on Render
3. Set **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
4. Set **Start Command**: `cd server && node index.js`
5. Add environment variables from `server/.env`
6. Done — Render gives you a public URL

## Deploying to Railway.app

1. Push code to GitHub
2. Create new project → Deploy from GitHub
3. Set **Root Directory**: (leave empty)
4. Set **Build Command**: `cd client && npm install && npm run build`
5. Set **Start Command**: `cd server && npm install && node index.js`
6. Add environment variables
7. Done

---

## Project Structure

```
habibi-fixed/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Navbar, EventCard, etc.
│   │   ├── pages/           # HomePage, OrganisersPage, etc.
│   │   ├── lib/             # API calls, config
│   │   └── styles/          # globals.css
│   ├── .env.development     # Dev: API at localhost:5000
│   ├── .env.production      # Prod: API at /api (same server)
│   └── vite.config.js
└── server/                  # Express + MongoDB backend
    ├── routes/              # auth, events, members, deptpoints
    ├── models/              # Mongoose models
    ├── middleware/          # JWT auth
    ├── .env                 # Environment variables
    └── index.js             # Entry point (serves API + frontend)
```
