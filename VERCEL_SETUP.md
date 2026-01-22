# 🚀 How to Host on Vercel

Since this is a full-stack Next.js app, Vercel is the perfect place to host it.

## ⚠️ Critical Checks Before Deploying

1.  **Database**: You MUST use the **MongoDB Atlas** connection string, NOT the local one (`localhost` won't work on Vercel).
2.  **File Storage**: On Vercel, uploaded files will vanish when the app redeploys (ephemeral storage). For production, you should eventually switch to AWS S3 or Vercel Blob. For now, just be aware that uploads are temporary.

## Method 1: The Easy Way (Vercel Dashboard)

1.  Go to [https://vercel.com/new](https://vercel.com/new).
2.  Select your GitHub repository: **Virtual_Locker**.
3.  **Project Name**: `virtual-locker` (or leave default).
4.  **Framework Preset**: It should auto-detect **Next.js**.
5.  **Root Directory**: Click `Edit` and select `file-manager-nextjs`.
6.  **Environment Variables** (Expand this section):
    *   Copy and paste these exact values:

    | Name | Value |
    |------|-------|
    | `MONGODB_URI` | `mongodb+srv://admin:admin123@cluster0.4eexsyv.mongodb.net/file-manager?retryWrites=true&w=majority&appName=Cluster0` |
    | `JWT_SECRET` | `your-super-secret-jwt-key-change-in-production-min-32-chars-file-manager-2026` |
    | `MAX_FILE_SIZE` | `52428800` |
    | `STORAGE_TYPE` | `local` |
    | `NODE_ENV` | `production` |

7.  Click **Deploy**.

## Method 2: The Command Line Way

Run the following command in your terminal:

```powershell
cd file-manager-nextjs
npx vercel
```

1.  Follow the prompts (Log in in your browser if asked).
2.  Set up and deploy? **Y**
3.  Which scope? (Select your account)
4.  Link test to existing project? **N**
5.  Project name? (Press Enter)
6.  In which directory? **./** (Press Enter)
7.  Want to modify these settings? **N** (We'll set env vars in the dashboard or via CLI later, or you can say **Y** and paste them now).

## After Deployment

If you see a "Server Selection Error" on Vercel:
1.  Go to your **MongoDB Atlas Dashboard**.
2.  Go to **Network Access** (Security tab).
3.  Ensure your IP Whitelist includes `0.0.0.0/0` (Allow Access from Anywhere).
