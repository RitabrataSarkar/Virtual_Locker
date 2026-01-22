# Vercel Deployment Guide

## Prerequisites
1. Vercel account (free tier available)
2. MongoDB Atlas cluster
3. GitHub repository (optional but recommended)

## Steps

### 1. Prepare MongoDB Atlas
```bash
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) or Vercel IPs
5. Copy connection string
```

### 2. Push to GitHub (Recommended)
```bash
cd file-manager-nextjs
git init
git add .
git commit -m "Initial commit - MERN file manager"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

### 4. Set Environment Variables in Vercel
Go to Project Settings → Environment Variables and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/file-manager
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=52428800
STORAGE_TYPE=local
NODE_ENV=production
```

### 5. Deploy
Click "Deploy" or run:
```bash
vercel --prod
```

## Railway Deployment (Alternative for Backend)

If you want to deploy the backend separately:

### 1. Create Railway Project
```bash
1. Go to https://railway.app
2. Create new project
3. Select "Deploy from GitHub"
4. Connect repository
```

### 2. Set Environment Variables
```env
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
PORT=3000
```

### 3. Configure Build
Railway will auto-detect Next.js and deploy.

## Post-Deployment

### Test Your Deployment
```bash
# Signup
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Enable File Uploads in Production
For production file uploads, consider:

1. **AWS S3** (Recommended)
   - Create S3 bucket
   - Add AWS credentials to environment
   - Update storage logic to use S3

2. **Cloudinary**
   - Free tier available
   - Easy integration
   - Automatic image optimization

3. **Vercel Blob Storage**
   - Native Vercel solution
   - Simple integration

## Custom Domain
1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Monitoring
- View logs in Vercel Dashboard
- Monitor MongoDB Atlas metrics
- Set up error tracking (e.g., Sentry)

## Important Notes

⚠️ **File Storage Limitation:**
Vercel has ephemeral filesystem. Files uploaded to `/public/uploads` will be lost between deployments. 

**Solutions:**
1. Use AWS S3 or similar cloud storage
2. Use Vercel Blob Storage
3. Deploy backend separately on Railway/Heroku with persistent storage

## Troubleshooting

**MongoDB Connection Issues:**
- Verify connection string
- Check IP whitelist in Atlas
- Ensure database user has correct permissions

**Build Failures:**
- Check build logs in Vercel
- Verify all dependencies are in package.json
- Ensure TypeScript has no errors

**API Route Errors:**
- Check function logs in Vercel
- Verify environment variables are set
- Test API locally first

## Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)
