# Virtual Locker Backend

Backend API for the Virtual Locker file management system.

## Tech Stack
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=52428800
STORAGE_LIMIT=1073741824
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Files
- `GET /api/files` - Get all files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:fileId` - Get file details
- `GET /api/files/download/:fileId` - Download file
- `DELETE /api/files/:fileId` - Delete file
- `PUT /api/files/:fileId/rename` - Rename file
- `PUT /api/files/:fileId/move` - Move file
- `PUT /api/files/:fileId/star` - Toggle star

### Folders
- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create folder
- `GET /api/folders/:folderId` - Get folder details
- `PUT /api/folders/:folderId` - Update folder
- `DELETE /api/folders/:folderId` - Delete folder
- `PUT /api/folders/:folderId/star` - Toggle star

### Storage
- `GET /api/storage` - Get storage statistics

### Search
- `GET /api/search?q=query` - Search files and folders

## Deployment on Railway

1. Push your code to GitHub
2. Connect your repository to Railway
3. Add environment variables in Railway dashboard
4. Deploy

Railway will automatically detect the Node.js app and deploy it.
