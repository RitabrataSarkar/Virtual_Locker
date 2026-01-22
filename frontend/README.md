# Virtual Locker Frontend

Next.js frontend for the Virtual Locker file management system.

## Tech Stack
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production (Vercel), set this to your Railway backend URL:
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm start
```

## Deployment on Vercel

### Option 1: Using Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set the root directory to `frontend`
5. Add environment variable: `NEXT_PUBLIC_API_URL` = your Railway backend URL
6. Deploy

## Environment Variables in Vercel

Add these in your Vercel project settings:

- `NEXT_PUBLIC_API_URL` - Your Railway backend URL (e.g., `https://your-app.railway.app`)

## Features

- 📁 File and folder management
- ⬆️ File upload with drag & drop
- ⬇️ File download
- ⭐ Star important files
- 🔍 Global search
- 📊 Storage tracking
- 🎨 Modern, responsive UI
- 🔐 Secure authentication

## Project Structure

```
frontend/
├── app/              # Next.js app directory
│   ├── (auth)/      # Authentication pages
│   ├── dashboard/   # Main dashboard
│   └── layout.tsx   # Root layout
├── components/       # React components
│   ├── ui/          # Shadcn UI components
│   ├── layout/      # Layout components
│   └── file-manager/# File manager components
├── lib/             # Utilities and configurations
│   ├── api-config.ts # API endpoints configuration
│   ├── auth.ts      # Auth utilities
│   └── utils.ts     # Helper functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── public/          # Static assets
```

## Important Notes

- This frontend connects to a separate Express.js backend
- All API calls go through the `lib/api-config.ts` file
- Authentication uses JWT tokens stored in localStorage
- File uploads are handled by the backend (multer)
