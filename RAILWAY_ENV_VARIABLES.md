# 🚂 Railway Environment Variables Setup

## ⚠️ IMPORTANT: Set These in Railway Dashboard NOW

Go to: **Railway Dashboard → Your Backend Service → Variables Tab**

---

## 📋 Environment Variables to Add

### 1. MONGODB_URI
```
mongodb+srv://admin:admin123@cluster0.4eexsyv.mongodb.net/virtuallocker?retryWrites=true&w=majority&appName=Cluster0
```
**Note:** Added database name `virtuallocker` and `retryWrites=true&w=majority` for production stability.

---

### 2. JWT_SECRET
```
0e4491d40c82c283fe841fda35f1f03c0c5fa05a71e7238d5aea15c7ab0
```
**Note:** Keep this secret! Never share publicly.

---

### 3. FRONTEND_URL
```
https://virtual-locker-rqvu.vercel.app
```
**Note:** No trailing slash! Used for CORS configuration.

---

### 4. NODE_ENV
```
production
```

---

### 5. JWT_EXPIRES_IN (Optional)
```
7d
```
**Note:** Tokens expire after 7 days. Railway may auto-set this from .env.example.

---

## ✅ Quick Setup Steps

1. **Open Railway Dashboard**: https://railway.app/dashboard
2. **Select** your backend service (virtuallocker-production)
3. **Click** "Variables" tab
4. **Click** "+ New Variable" button
5. **Add each variable** from above (copy-paste the values)
6. **Click** "Deploy" or wait for auto-redeploy

---

## 🔍 Verification

After setting variables, check the logs. You should see:

```
✅ MongoDB connected: cluster0-shard-00-00.4eexsyv.mongodb.net
🚀 Server is running on port 8080
```

### Test Your Backend:
```bash
curl https://virtuallocker-production.up.railway.app/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

---

## 🌐 Your Deployment URLs

| Service | URL |
|---------|-----|
| **Backend API** | https://virtuallocker-production.up.railway.app |
| **Frontend** | https://virtual-locker-rqvu.vercel.app |
| **MongoDB** | cluster0.4eexsyv.mongodb.net (connected via mongoose) |

---

## 🔐 Security Reminders

- ✅ Never commit these values to Git
- ✅ `.env` files are in `.gitignore`
- ⚠️ Change MongoDB password from `admin123` to something more secure later
- ⚠️ Consider using MongoDB IP whitelist for additional security

---

## 🐛 Troubleshooting

If deployment still fails:

1. **Check logs** in Railway dashboard
2. **Verify** all 4 required variables are set (MONGODB_URI, JWT_SECRET, FRONTEND_URL, NODE_ENV)
3. **Ensure** no typos in variable names (case-sensitive!)
4. **Test MongoDB** connection string locally first
5. **Redeploy** after setting variables

---

## 📝 Next Steps After Railway Setup

1. ✅ Set all environment variables in Railway
2. ✅ Wait for successful deployment
3. ✅ Test backend health endpoint
4. ✅ Redeploy frontend on Vercel (to pick up new API URL)
5. ✅ Test full authentication flow
6. ✅ Test file upload/download features
