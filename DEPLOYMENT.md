# Deployment Guide - Virtual Locker

This guide will help you deploy your Virtual Locker application with the frontend on Vercel and the backend on Railway.

## 📋 Prerequisites

- [x] GitHub account
- [x] MongoDB Atlas account (or any MongoDB instance)
- [x] Vercel account
- [x] Railway account
- [x] Code pushed to GitHub

## 🗄️ Step 1: Setup MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist all IP addresses (0.0.0.0/0) for Railway/Vercel access
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
   ```

## 🚂 Step 2: Deploy Backend to Railway

### A. Create New Project
1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize GitHub and select your `Virtual_Locker` repository

### B. Configure Project
1. Click on the deployed service
2. Go to **"Settings"** tab
3. Set **"Root Directory"** to `backend`
4. Set **"Start Command"** to `npm start` (optional, it's in package.json)

### C. Add Environment Variables
Go to **"Variables"** tab and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/virtuallocker
JWT_SECRET=your-super-secret-random-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=52428800
STORAGE_LIMIT=1073741824
FRONTEND_URL=temporary-will-update-after-vercel
NODE_ENV=production
```

**Important**: Generate a secure JWT_SECRET:
```bash
# Use this command to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### D. Deploy
1. Railway will automatically deploy
2. Wait for deployment to complete
3. Copy your Railway app URL (e.g., `https://your-app.up.railway.app`)

## ▲ Step 3: Deploy Frontend to Vercel

### A. Import Project
1. Go to [Vercel.com](https://vercel.com)
2. Click **"Add New"**  → **"Project"**
3. Import your GitHub repository
4. Framework Preset: **Next.js** (should auto-detect)
5. **Root Directory**: Change to `frontend`

### B. Configure Environment Variables
Before deploying, add this environment variable:

```
NEXT_PUBLIC_API_URL=<your-railway-backend-url>
```

Use the Railway URL from Step 2D (e.g., `https://your-app.up.railway.app`)

### C. Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Copy your Vercel domain (e.g., `https://your-app.vercel.app`)

## 🔗 Step 4: Update Backend CORS

Now that you have your Vercel frontend URL:

1. Go back to Railway dashboard
2. Navigate to your backend project
3. Go to **"Variables"** tab
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Save changes (Railway will auto-redeploy)

## ✅ Step 5: Verify Deployment

### Test Backend API
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### Test Frontend
1. Visit your Vercel URL
2. Try to sign up for a new account
3. Try login
4. Upload a file
5. Create a folder

## 🔧 Step 6: Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### For Backend (Railway)
1. Go to your project in Railway
2. Click "Settings"
3. Add custom domain
4. Update `NEXT_PUBLIC_API_URL` in Vercel with new domain

## 📊 Monitoring

### Railway (Backend)
- View logs in Railway dashboard
- Monitor resource usage
- Check for errors

### Vercel (Frontend)
- View deployment logs
- Check  Analytics
- Monitor performance

## 🐛 Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Make sure it includes `https://` and has no trailing slash

### "Failed to fetch" errors
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Verify Railway backend is running
- Check Railway logs for errors

### Upload not working
- Verify `MAX_FILE_SIZE` is set in Railway
- Check file permissions
- Review backend logs

### Database connection errors
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas (should include 0.0.0.0/0)
- Ensure database user credentials are correct

## 🔄 Future Deployments

### Backend Updates
1. Push changes to GitHub
2. Railway will auto-deploy

### Frontend Updates
1. Push changes to GitHub
2. Vercel will auto-deploy

## 📝 Environment Variables Summary

### Backend (Railway)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | 64-char random string |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `52428800` (50MB) |
| `STORAGE_LIMIT` | User storage limit | `1073741824` (1GB) |
| `FRONTEND_URL` | Vercel frontend URL | `https://app.vercel.app` |
| `NODE_ENV` | Environment | `production` |

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Railway backend URL | `https://api.railway.app` |

---

## 🎉 Congratulations!

Your Virtual Locker app is now deployed and running in production!

- **Frontend**: Hosted on Vercel
- **Backend**: Hosted on Railway  
- **Database**: MongoDB Atlas

Need help? Create an issue on GitHub!
