# File Manager Virtual Locker - MERN Stack

A modern, secure cloud file storage application built with the MERN stack (MongoDB, Express via Next.js API Routes, React via Next.js, Node.js).

## 🚀 Features

### Implemented (Backend)
- ✅ User authentication with JWT
- ✅ Secure file upload and storage
- ✅ Folder management with hierarchy
- ✅ File download
- ✅ File and folder deletion
- ✅ File renaming
- ✅ User isolation (private storage)
- ✅ RESTful API with TypeScript
- ✅ MongoDB integration
- ✅ Input validation

### Coming Soon (Frontend)
- 🚧 Modern responsive UI
- 🚧 Drag and drop file upload
- 🚧 File preview
- 🚧 Search and filter
- 🚧 Batch operations
- 🚧 Dark mode

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcryptjs
- **File Upload:** Multer/Formidable
- **Validation:** Zod
- **State Management:** Zustand, React Query

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
```bash
cd file-manager-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create `.env.local` file (already created) and update:
```env
MONGODB_URI=mongodb://localhost:27017/file-manager-dev
JWT_SECRET=your-secret-key-min-32-characters
```

4. **Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string
```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
file-manager-nextjs/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── files/        # File management endpoints
│   │   └── folders/      # Folder management endpoints
│   ├── (auth)/           # Auth pages (login, signup)
│   └── (dashboard)/      # Dashboard pages
├── components/           # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configs
│   ├── auth.ts          # JWT utilities
│   ├── db.ts            # MongoDB connection
│   ├── middleware.ts    # Auth middleware
│   └── utils.ts         # Helper functions
├── models/              # Mongoose models
│   ├── User.ts
│   └── File.ts
├── types/               # TypeScript definitions
└── public/uploads/      # File storage
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Files
- `GET /api/files?folderId={id}` - List files
- `POST /api/files` - Upload file
- `GET /api/files/{id}` - Get file details
- `PATCH /api/files/{id}` - Rename file
- `DELETE /api/files/{id}` - Delete file
- `GET /api/files/download/{id}` - Download file

### Folders
- `POST /api/folders` - Create folder

## 🧪 Testing API

You can test the API using curl, Postman, or Thunder Client:

**Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Upload File:**
```bash
curl -X POST http://localhost:3000/api/files \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy --prod
```

### Railway (Backend API)
1. Create Railway project
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### MongoDB Atlas
1. Create free cluster
2. Get connection string
3. Update MONGODB_URI in environment

## 📖 Documentation

- [MERN_CONVERSION_PLAN.md](../MERN_CONVERSION_PLAN.md) - Detailed conversion plan
- [PROGRESS.md](./PROGRESS.md) - Implementation progress

## 🔒 Security

- Password hashing with bcrypt
- JWT authentication
- Input validation with Zod
- User ownership verification
- File size limits
- Soft delete for recovery

## 🤝 Contributing

This is a conversion project from Flask to MERN stack. Feel free to contribute!

## 📝 License

MIT

## 👨‍💻 Original Project

Converted from Flask-based File Manager Virtual Locker to modern MERN stack.

---

**Status:** Backend Complete ✅ | Frontend In Progress 🚧

For detailed progress, see [PROGRESS.md](./PROGRESS.md)
