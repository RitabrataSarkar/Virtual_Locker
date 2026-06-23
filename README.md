# Virtual Locker - File Manager

A modern, secure file management system with separate frontend and backend deployments.

## 🏗️ Architecture

This project is split into two main directories:

- **`frontend/`** - Next.js application (Deploy on Vercel)
- **`backend/`** - Express.js API server (Deploy on Railway)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (MongoDB Atlas recommended)
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/RitabrataSarkar/Virtual_Locker.git
cd Virtual_Locker
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
cp .env.example .env.local
# .env.local should have NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📦 Deployment

### Deploy Backend to Railway

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `FRONTEND_URL` - Your Vercel frontend URL (for CORS)
   - `PORT` - 5000 (Railway will override this automatically)
7. Deploy!

Railway will provide you with a public URL (e.g., `https://your-app.railway.app`)

### Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` - Your Railway backend URL
5. Deploy!

### Update CORS After Deployment

After deploying frontend to Vercel:
1. Copy your Vercel URL
2. Update `FRONTEND_URL` in Railway environment variables
3. Redeploy backend on Railway

## 📁 Project Structure

```
Virtual_Locker/
├── frontend/                 # Next.js Frontend
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities & API config
│   ├── public/              # Static assets
│   ├── package.json
│   └── README.md
│
├── backend/                  # Express.js Backend
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   └── index.js         # Entry point
│   ├── uploads/             # User uploaded files
│   ├── package.json
│   └── README.md
│
└── README.md                 # This file
```

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=52428800
STORAGE_LIMIT=1073741824
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn/ui components

### Backend
- Express.js
- MongoDB & Mongoose
- JWT authentication
- Multer (file uploads)
- bcryptjs (password hashing)

## ✨ Features

- 🔐 Secure authentication with JWT
- 📁 Create and manage folders
- ⬆️ Upload files with drag & drop support
- ⬇️ Download files
- ⭐ Star/favorite files and folders
- 🗑️ Delete files (soft delete)
- 🔍 Global search functionality
- 📊 Storage usage tracking
- 🎨 Modern, responsive UI
- 🔒 File type validation
- 💾 Size limit enforcement

## 📝 API Documentation

See `backend/README.md` for detailed API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👤 Author

RitabrataSarkar

---

**Note**: This is a full-stack application with separated frontend and backend. Make sure both are deployed and properly configured to work together.
