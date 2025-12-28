# Google Drive Clone

A full-stack Google Drive clone application with file management capabilities, built with modern web technologies. Features secure Google OAuth authentication, file upload/download, and a responsive user interface.

## Features

### File Management

- Upload files (up to 100MB)
- Download files with secure access
- Rename and delete files
- Search functionality
- Responsive grid layout
- Drag & drop interface
- Real-time file operations

### Authentication & Security

- Google OAuth 2.0 integration
- Session-based authentication
- Secure file access control
- User management
- Protected routes

### User Interface

- Modern, responsive design
- Mobile-friendly interface
- Loading states and error handling
- Toast notifications
- Dark/light theme support

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Authentication**: Passport.js with Google OAuth 2.0
- **File Storage**: Local file system with Multer
- **Session Management**: express-session

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (pnpm recommended)
- **Git**
- **Google Cloud Console** access for OAuth setup

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/TanmayNewatia/google-drive-clone.git
cd google-drive-clone
```

### 2. Set Up Google OAuth

Before running the application, you need to set up Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Configure authorized origins and redirect URIs (see detailed setup below)
6. Copy the Client ID and Client Secret for environment configuration

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Google OAuth credentials
# (See environment variables section below)

# Build the project
npm run build

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:3001`

### 4. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or if you prefer pnpm
pnpm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with backend API URL
# (See environment variables section below)

# Start the frontend development server
npm run dev
# or
pnpm dev
```

The frontend will start on `http://localhost:3000`

### 5. Access the Application

1. Open your browser and go to `http://localhost:3000`
2. Click "Sign in with Google"
3. Complete the OAuth flow
4. Start uploading and managing files!

## Detailed Setup Guide

### Google OAuth Configuration

#### Step 1: Google Cloud Console Setup

1. **Create Project**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "Select a project" → "New Project"
   - Enter project name and click "Create"

2. **Enable APIs**:

   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity API"
   - Click "Enable"

3. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Configure consent screen if prompted
   - Select "Web application"
   - Add authorized origins and redirect URIs

#### Step 2: Configure Origins and Redirect URIs

**For Development:**

- **Authorized JavaScript origins**:
  - `http://localhost:3000`
  - `http://localhost:3001`
- **Authorized redirect URIs**:
  - `http://localhost:3001/api/auth/google/callback`

**For Production:**

- **Authorized JavaScript origins**:
  - `https://your-frontend-domain.vercel.app`
  - `https://your-backend-domain.onrender.com`
- **Authorized redirect URIs**:
  - `https://your-backend-domain.onrender.com/api/auth/google/callback`

### Environment Variables

#### Backend (.env)

Create `backend/.env` with the following:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

#### Frontend (.env.local)

Create `frontend/.env.local` with the following:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
NEXT_PUBLIC_ALLOWED_FILE_TYPES=*

# App Configuration
NEXT_PUBLIC_APP_NAME="Google Drive Clone"
NEXT_PUBLIC_COMPANY_NAME="Your Company"
```

### Database Setup

The application uses SQLite, which requires no additional setup. The database file will be automatically created at `backend/var/db/drive.db` when you first start the backend server.

#### Database Schema

The application automatically creates the following tables:

- **users**: User information and authentication data
- **federated_credentials**: OAuth provider linkage
- **files**: File metadata and ownership information

No manual database setup is required.

### File Storage Setup

Files are stored locally in the `backend/uploads` directory:

- **Location**: `backend/uploads/`
- **Structure**: Organized by upload date and random identifiers
- **Naming**: Unique generated filenames with original names stored in database
- **Size Limit**: 100MB per file (configurable)
- **Security**: Path traversal protection and ownership verification

The uploads directory will be automatically created when you first upload a file.

## Production Deployment

### Backend Deployment (Render.com)

1. **Create Render Account** and connect your GitHub repository

2. **Create Web Service**:

   - Select your repository
   - Choose "Node" environment
   - Set build command: `npm run build`
   - Set start command: `npm start`

3. **Set Environment Variables** in Render dashboard:

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain.vercel.app
SESSION_SECRET=your-super-secure-session-secret-for-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.onrender.com/api/auth/google/callback
```

4. **Update Google OAuth**:
   - Add production URLs to authorized origins
   - Add production callback URL to redirect URIs

### Frontend Deployment (Vercel)

1. **Connect Repository** to Vercel

2. **Configure Build Settings**:

   - Framework: Next.js
   - Build Command: `npm run build` or `pnpm build`
   - Output Directory: `.next`
   - Install Command: `npm install` or `pnpm install`

3. **Set Environment Variables** in Vercel dashboard:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.onrender.com/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.onrender.com
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
NEXT_PUBLIC_ALLOWED_FILE_TYPES=*
NEXT_PUBLIC_APP_NAME=Google Drive Clone
NEXT_PUBLIC_COMPANY_NAME=Your Company
```

4. **Deploy**: Vercel will automatically deploy on push to main branch

### Post-Deployment Configuration

After deploying both frontend and backend:

1. **Update Google OAuth** with production URLs
2. **Test Authentication** flow end-to-end
3. **Verify File Upload/Download** functionality
4. **Check CORS** configuration between domains

## Development Scripts

### Backend Scripts

```bash
# Development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server (after build)
npm start

# Type checking
npx tsc --noEmit

# Clean build directory
npm run clean
```

### Frontend Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check
```

## API Documentation

### Authentication Endpoints

- `GET /api/auth/user` - Get current user information
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback handler
- `POST /api/auth/logout` - Logout current user

### File Management Endpoints

- `GET /api/files` - List all user files
- `POST /api/files/upload` - Upload a new file
- `GET /api/files/:id` - Get specific file metadata
- `PUT /api/files/:id/rename` - Rename a file
- `DELETE /api/files/:id` - Delete a file (soft delete)
- `GET /api/files/:id/download` - Download a file
- `GET /api/files/search?q=term` - Search files by name

## Project Structure

```
google-drive-clone/
├── README.md                 # This file
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── app.ts           # Main application setup
│   │   ├── db/
│   │   │   └── db.ts        # Database schema and operations
│   │   ├── routes/
│   │   │   ├── auth.ts      # Authentication routes
│   │   │   ├── files.ts     # File management routes
│   │   │   └── index.ts     # Route aggregator
│   │   └── types/           # TypeScript type definitions
│   ├── uploads/             # File storage directory
│   ├── var/db/             # SQLite database
│   ├── package.json
│   └── .env.example
└── frontend/                # Next.js frontend
    ├── app/                 # Next.js App Router
    ├── components/          # React components
    │   ├── ui/             # Base UI components
    │   ├── file-grid/      # File display components
    │   ├── file-upload/    # File upload components
    │   ├── header/         # App header
    │   └── sidebar/        # Navigation sidebar
    ├── contexts/           # React contexts
    ├── hooks/              # Custom React hooks
    ├── lib/                # Utility libraries
    ├── providers/          # Global providers
    ├── package.json
    └── .env.example
```

## Security Features

- **Authentication**: Google OAuth 2.0 with session management
- **Authorization**: File ownership verification
- **Session Security**: Secure cookies with HTTPS in production
- **File Security**: Path traversal protection and file validation
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: File type and size validation
- **Data Protection**: Soft delete for data recovery

## Performance Considerations

- **Frontend Caching**: React Query for efficient data fetching
- **Backend Optimization**: Trust proxy configuration for production
- **File Handling**: Streaming for large file uploads/downloads
- **Database**: Indexed queries for fast file searches
- **Code Splitting**: Automatic component-level splitting in Next.js

## Troubleshooting

### Common Issues

#### Authentication Problems

- **"Cannot verify authorization request state"**: Check trust proxy configuration
- **CORS errors**: Verify frontend URL in backend CORS configuration
- **Session not persisting**: Ensure secure cookies are properly configured

#### File Upload Issues

- **Upload fails silently**: Check file size limits and backend connectivity
- **Files not appearing**: Verify database connection and file permissions
- **Download errors**: Check file paths and ownership verification

#### Build/Deploy Issues

- **TypeScript errors**: Ensure all @types packages are in dependencies
- **Environment variables**: Verify all required vars are set in production
- **Database connection**: Check SQLite file permissions and paths

### Development Issues

#### Backend

```bash
# Check if backend is running
curl http://localhost:3001/api/auth/user

# View backend logs
npm run dev

# Check database
sqlite3 var/db/drive.db ".tables"
```

#### Frontend

```bash
# Check build for errors
npm run build

# Type checking
npm run type-check

# Check environment variables
echo $NEXT_PUBLIC_API_BASE_URL
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow TypeScript and React best practices
4. Add tests for new functionality
5. Update documentation as needed
6. Submit a pull request

### Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Add JSDoc comments for functions
- Follow React hooks best practices

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check existing GitHub issues
4. Create a new issue with detailed information

## Roadmap

- [ ] File sharing and permissions
- [ ] File versioning
- [ ] Advanced search and filters
- [ ] Real-time collaboration
- [ ] Mobile app development
- [ ] Integration with cloud storage providers

---

**Happy coding! 🚀**
