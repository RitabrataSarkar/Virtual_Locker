# File Manager Virtual Locker - MERN Stack Conversion Plan

## Overview
Converting the Flask-based File Manager to a modern MERN stack application using:
- **MongoDB**: Database for user authentication and file metadata
- **Express** (via Next.js API Routes): Backend API
- **React** (via Next.js 14+): Frontend framework
- **Node.js**: Runtime environment

## Deployment Strategy
- **Frontend**: Vercel (Next.js optimized hosting)
- **Backend API**: Railway (Separate Next.js API deployment) or Vercel serverless functions
- **Database**: MongoDB Atlas (Cloud database)
- **File Storage**: 
  - Development: Local filesystem
  - Production: AWS S3, Cloudinary, or similar cloud storage service

---

## Architecture

### Technology Stack

#### Frontend (Next.js App Router)
- **Next.js 14+** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** for premium components
- **React Query** for data fetching and caching
- **Zustand** or **Context API** for state management
- **Axios** for HTTP requests

#### Backend (Next.js API Routes)
- **Next.js API Routes** for RESTful endpoints
- **Mongoose** for MongoDB ODM
- **JWT** for authentication
- **Bcrypt.js** for password hashing
- **Multer** for file uploads
- **Express-validator** for input validation

#### Database Schema (MongoDB)
```typescript
// User Model
{
  _id: ObjectId,
  username: string (unique, indexed),
  email: string (unique),
  password: string (hashed),
  createdAt: Date,
  updatedAt: Date
}

// File Metadata Model
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  name: string,
  originalName: string,
  path: string,
  size: number,
  mimeType: string,
  isFolder: boolean,
  parentId: ObjectId (reference to File, null for root),
  storagePath: string (S3 key or local path),
  createdAt: Date,
  updatedAt: Date,
  isDeleted: boolean (soft delete)
}

// Session/Token Model (optional - can use JWT only)
{
  _id: ObjectId,
  userId: ObjectId,
  token: string,
  expiresAt: Date,
  createdAt: Date
}
```

---

## File Structure

```
file-manager-nextjs/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (file manager interface)
│   │   └── files/
│   │       └── [folderId]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── signup/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   └── forgot-password/
│   │   │       └── route.ts
│   │   ├── files/
│   │   │   ├── route.ts (GET all files, POST upload)
│   │   │   ├── [fileId]/
│   │   │   │   └── route.ts (GET, PATCH, DELETE specific file)
│   │   │   ├── download/
│   │   │   │   └── [fileId]/
│   │   │   │       └── route.ts
│   │   │   └── search/
│   │   │       └── route.ts
│   │   ├── folders/
│   │   │   ├── route.ts (GET all folders, POST create)
│   │   │   └── [folderId]/
│   │   │       └── route.ts (GET, PATCH, DELETE specific folder)
│   │   └── user/
│   │       └── route.ts (GET user info)
│   ├── layout.tsx
│   ├── page.tsx (landing/redirect page)
│   └── globals.css
├── components/
│   ├── ui/ (Shadcn components)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── file-manager/
│   │   ├── FileList.tsx
│   │   ├── FileItem.tsx
│   │   ├── FolderItem.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── FileUpload.tsx
│   │   ├── CreateFolderDialog.tsx
│   │   ├── CreateFileDialog.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterSort.tsx
│   │   └── FilePreview.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Navigation.tsx
├── lib/
│   ├── db.ts (MongoDB connection)
│   ├── auth.ts (Auth utilities)
│   ├── middleware.ts (Auth middleware for API routes)
│   └── utils.ts
├── models/
│   ├── User.ts
│   ├── File.ts
│   └── Session.ts (optional)
├── hooks/
│   ├── useAuth.ts
│   ├── useFiles.ts
│   └── useUpload.ts
├── types/
│   ├── auth.ts
│   ├── file.ts
│   └── api.ts
├── public/
│   └── uploads/ (for local development)
├── .env.local
├── .env.example
├── middleware.ts (Next.js middleware for route protection)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## API Endpoints

### Authentication APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | Login and get JWT token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/forgot-password` | Reset password | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### File Management APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/files?folderId={id}` | List files in folder | Yes |
| POST | `/api/files` | Upload file | Yes |
| GET | `/api/files/{fileId}` | Get file details | Yes |
| PATCH | `/api/files/{fileId}` | Update file (rename) | Yes |
| DELETE | `/api/files/{fileId}` | Delete file | Yes |
| GET | `/api/files/download/{fileId}` | Download file | Yes |
| GET | `/api/files/search?q={query}` | Search files | Yes |

### Folder Management APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/folders?parentId={id}` | List folders | Yes |
| POST | `/api/folders` | Create new folder | Yes |
| GET | `/api/folders/{folderId}` | Get folder details | Yes |
| PATCH | `/api/folders/{folderId}` | Update folder (rename) | Yes |
| DELETE | `/api/folders/{folderId}` | Delete folder | Yes |

---

## Implementation Steps

### Phase 1: Project Setup ✓
1. ✓ Create Next.js application with TypeScript and Tailwind CSS
2. Install required dependencies
3. Setup project structure
4. Configure environment variables

### Phase 2: Database & Models
1. Setup MongoDB connection
2. Create Mongoose models (User, File)
3. Create database utility functions
4. Test database connection

### Phase 3: Authentication System
1. Implement JWT authentication utilities
2. Create auth API routes (signup, login, logout)
3. Create auth middleware for API routes
4. Implement Next.js middleware for route protection
5. Create auth context/hooks for frontend

### Phase 4: Frontend UI Components
1. Setup Shadcn/UI components
2. Create authentication pages (Login, Signup, Forgot Password)
3. Create file manager layout (Header, Sidebar)
4. Create file management components (FileList, FileItem, etc.)
5. Implement responsive design with Tailwind CSS

### Phase 5: File Management Backend
1. Implement file upload API with Multer
2. Create file CRUD API routes
3. Create folder CRUD API routes
4. Implement file search functionality
5. Add file download functionality
6. Implement proper error handling

### Phase 6: File Management Frontend
1. Create file browser interface
2. Implement file upload with drag-and-drop
3. Add folder navigation with breadcrumbs
4. Implement file/folder operations (create, delete, rename)
5. Add search functionality
6. Implement filter and sort features

### Phase 7: Advanced Features
1. Add file preview functionality
2. Implement file editing for text files
3. Add batch operations (multi-select)
4. Implement file sharing (optional)
5. Add storage quota tracking

### Phase 8: Testing & Optimization
1. Test all API endpoints
2. Test frontend components
3. Optimize file upload performance
4. Implement proper loading states
5. Add error boundaries

### Phase 9: Deployment
1. Setup MongoDB Atlas
2. Configure environment variables for production
3. Deploy frontend to Vercel
4. Deploy backend API to Railway (or use Vercel serverless)
5. Configure CORS and security headers
6. Test production deployment

---

## Environment Variables

### `.env.local`
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/file-manager-dev
MONGODB_URI_PROD=mongodb+srv://user:pass@cluster.mongodb.net/file-manager

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# File Storage
STORAGE_TYPE=local # or 's3'
MAX_FILE_SIZE=52428800 # 50MB in bytes

# AWS S3 (if using S3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

# App
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

---

## Key Features to Implement

### Essential Features
- ✅ User authentication (signup, login, logout)
- ✅ File upload and download
- ✅ Folder creation and navigation
- ✅ File and folder deletion
- ✅ File and folder renaming
- ✅ Search functionality
- ✅ Breadcrumb navigation
- ✅ File type icons
- ✅ File size display
- ✅ Last modified date

### Enhanced Features
- 📁 Drag and drop file upload
- 🔍 Advanced search with filters
- 📊 Storage quota tracking
- 📝 Text file editor
- 👁️ File preview (images, PDFs)
- 🎨 Modern UI with animations
- 📱 Responsive design
- 🌙 Dark mode (optional)
- 📋 Context menu for files/folders
- ⚡ Infinite scroll for large file lists

---

## Security Considerations

1. **Authentication**
   - Use HTTP-only cookies for JWT tokens
   - Implement CSRF protection
   - Add rate limiting for auth endpoints

2. **File Access**
   - Validate user ownership before allowing file operations
   - Sanitize file names to prevent path traversal attacks
   - Implement file type validation
   - Set maximum file size limits

3. **API Security**
   - Use CORS properly
   - Validate and sanitize all inputs
   - Implement request rate limiting
   - Use HTTPS in production

4. **Database**
   - Use parameterized queries (Mongoose handles this)
   - Implement indexes for performance
   - Regular backups

---

## Performance Optimization

1. **Frontend**
   - Code splitting with Next.js
   - Image optimization with next/image
   - Lazy loading for file lists
   - Optimize bundle size

2. **Backend**
   - Use database indexes
   - Implement pagination for file lists
   - Cache frequently accessed data
   - Optimize file upload with streaming

3. **File Storage**
   - Use CDN for file delivery (if using S3)
   - Implement multipart upload for large files
   - Compress files when appropriate

---

## Migration Strategy from Flask

1. **User Data**
   - Export users from `users.json`
   - Hash passwords are already SHA-256, will need to re-hash with bcrypt
   - Migrate to MongoDB User collection

2. **File Data**
   - Current files are in `uploads/` directory
   - Create File documents in MongoDB with metadata
   - Keep files in local storage or migrate to S3

3. **Session Management**
   - Replace Flask sessions with JWT tokens
   - No need to migrate session data (users will need to login again)

---

## Next Steps

1. Wait for Next.js installation to complete
2. Install additional dependencies (mongoose, bcryptjs, jsonwebtoken, etc.)
3. Create database models and connection
4. Implement authentication system
5. Build file management APIs
6. Create frontend components
7. Test and deploy

---

## Dependencies to Install

```bash
npm install mongoose bcryptjs jsonwebtoken
npm install multer formidable
npm install zustand # or use Context API
npm install @tanstack/react-query
npm install axios
npm install date-fns humanize-duration
npm install lucide-react # for icons
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu # for Shadcn
npm install class-variance-authority clsx tailwind-merge
npm install zod # for validation

# Dev dependencies
npm install -D @types/bcryptjs @types/jsonwebtoken @types/multer
```

---

## Notes

- The conversion maintains all features from the Flask version
- Modern React best practices with TypeScript
- Improved UI/UX with Tailwind CSS and Shadcn/UI
- Scalable architecture with separation of concerns
- Production-ready with proper error handling and security
- Optimized for deployment on Vercel and Railway
