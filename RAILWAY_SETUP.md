# Railway Deployment Setup Guide

## 🚨 Current Issue
Your backend deployment is failing because **environment variables are not configured** in Railway.

## ✅ Solution: Configure Environment Variables in Railway

### Required Environment Variables

You need to set these variables in Railway's dashboard:

1. **MONGODB_URI** (Required)
   - Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/virtual-locker?retryWrites=true&w=majority`
   - Get this from MongoDB Atlas Dashboard

2. **JWT_SECRET** (Required)
   - A secure random string for JWT token encryption
   - Example: `your-super-secret-jwt-key-at-least-32-characters-long`
   - Generate a secure one using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **JWT_EXPIRES_IN** (Optional)
   - Default: `7d`
   - Token expiration time

4. **FRONTEND_URL** (Required for CORS)
   - Your Vercel frontend URL
   - Format: `https://your-app-name.vercel.app`
   - No trailing slash

5. **NODE_ENV** (Optional)
   - Set to: `production`

6. **PORT** (Auto-set by Railway)
   - Railway sets this automatically, no need to configure

## 📋 Steps to Configure in Railway

### Method 1: Railway Dashboard (Recommended)

1. Go to your Railway project: https://railway.app/dashboard
2. Select your backend service
3. Click on the **"Variables"** tab
4. Click **"+ New Variable"**
5. Add each variable one by one:
   - Variable name: `MONGODB_URI`
   - Value: `your-actual-mongodb-connection-string`
6. Repeat for all required variables
7. Click **"Deploy"** to restart with new variables

### Method 2: Railway CLI

```bash
# Install Railway CLI if not already installed
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Set environment variables
railway variables set MONGODB_URI="your-mongodb-connection-string"
railway variables set JWT_SECRET="your-secret-key"
railway variables set FRONTEND_URL="https://your-frontend.vercel.app"

# Redeploy
railway up
```

## 🔑 Generating a Secure JWT_SECRET

Run this locally to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

## 🔗 Getting MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual database password
6. Replace `<dbname>` with your database name (e.g., `virtual-locker`)

## ✅ Verification

After setting the variables:
1. Railway will automatically redeploy
2. Check the deployment logs
3. You should see: `✅ MongoDB connected: ...` and `🚀 Server is running on port ...`
4. Test the health endpoint: `https://your-backend-url.railway.app/health`

## 📝 Notes

- Railway automatically sets `PORT` - don't override it
- Keep your `JWT_SECRET` and `MONGODB_URI` **private and secure**
- Never commit `.env` files to git (already in `.gitignore`)
- Update `FRONTEND_URL` once you deploy to Vercel
