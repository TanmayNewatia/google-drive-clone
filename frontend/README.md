# Google Drive Clone - Frontend

A modern, responsive frontend for a Google Drive clone built with Next.js and TypeScript. Features a clean interface for file management, Google OAuth authentication, and real-time file operations.

## Features

- **File Management**

  - Upload files
  - View files in grid layout
  - Download files
  - Rename files
  - Delete files
  - Search functionality

- **Authentication**

  - Google OAuth 2.0 integration
  - Secure session management
  - Protected routes
  - User profile display

- **User Interface**
  - Modern, responsive design
  - Mobile-friendly interface
  - Loading states and error handling
  - Toast notifications

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Authentication**: Session-based with backend API
- **Icons**: Lucide React
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm or yarn
- Backend server running (see backend README)

### Installation

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your backend API URL
```

4. Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

### Development (.env.local)

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

### Production (Vercel Dashboard)

Set these environment variables in your Vercel project settings:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.onrender.com/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.onrender.com
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
NEXT_PUBLIC_ALLOWED_FILE_TYPES=*
NEXT_PUBLIC_APP_NAME=Google Drive Clone
NEXT_PUBLIC_COMPANY_NAME=Your Company
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── auth/             # Authentication pages
│       └── callback/     # OAuth callback
├── components/           # Reusable components
│   ├── ui/              # Base UI components (Shadcn)
│   ├── file-grid/       # File display components
│   ├── file-upload/     # File upload components
│   ├── header/          # App header
│   ├── sidebar/         # Navigation sidebar
│   ├── login-page.tsx   # Login interface
│   └── theme-provider.tsx # Theme management
├── contexts/            # React contexts
│   ├── auth-context.tsx # Authentication state
│   └── files-context.tsx # File management state
├── hooks/               # Custom React hooks
│   ├── use-auth-queries.ts # Auth API hooks
│   ├── use-file-queries.ts # File API hooks
│   └── use-file-upload.ts  # File upload logic
├── lib/                 # Utility libraries
│   ├── auth-api.ts      # Authentication API
│   ├── file-api.ts      # File management API
│   ├── config.ts        # App configuration
│   └── utils.ts         # Utility functions
└── providers/           # Global providers
    └── query-provider.tsx # React Query setup
```

## Key Components

### Authentication Flow

1. **Login Page** (`components/login-page.tsx`)

   - Google OAuth integration
   - Handles authentication state

2. **Auth Context** (`contexts/auth-context.tsx`)

   - Manages user session
   - Provides authentication status

3. **Auth Callback** (`app/auth/callback/page.tsx`)
   - Handles OAuth redirect
   - Processes authentication result

### File Management

1. **File Grid** (`components/file-grid/`)

   - Displays files in responsive grid
   - File actions (rename, delete, download)

2. **File Upload** (`components/file-upload/`)

   - Drag & drop interface
   - Progress tracking
   - File validation

3. **File API** (`lib/file-api.ts`)
   - RESTful API integration
   - File operations
   - Error handling

## API Integration

The frontend communicates with the backend through RESTful APIs:

### Authentication Endpoints

- `GET /api/auth/user` - Get current user
- `GET /api/auth/google` - Initiate OAuth
- `POST /api/auth/logout` - Logout user

### File Management Endpoints

- `GET /api/files` - List user files
- `POST /api/files/upload` - Upload file
- `PUT /api/files/:id/rename` - Rename file
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/:id/download` - Download file
- `GET /api/files/search?q=term` - Search files

## Development Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type checking
pnpm type-check
```

## Production Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel

2. **Environment Variables**: Set production environment variables in Vercel dashboard

3. **Build Settings**:

   - Build Command: `pnpm build` or `npm run build`
   - Output Directory: `.next`
   - Install Command: `pnpm install` or `npm install`

4. **Domain Configuration**:
   - Add your custom domain
   - Ensure backend CORS allows your domain

### Manual Deployment

```bash
# Build the application
pnpm build

# Export static files (if needed)
pnpm export

# Deploy dist folder to your hosting provider
```

## Configuration

### File Upload Configuration

Configure file uploads through environment variables:

- `NEXT_PUBLIC_MAX_FILE_SIZE`: Maximum file size in bytes
- `NEXT_PUBLIC_ALLOWED_FILE_TYPES`: Allowed MIME types or "\*" for all

## Security Considerations

- **HTTPS Only**: Production deployment requires HTTPS
- **CORS Configuration**: Backend must allow frontend domain
- **Session Cookies**: Secure cookie handling for authentication
- **File Validation**: Client-side file type and size validation
- **API Rate Limiting**: Handled by backend, displayed in UI

## Performance Optimizations

- **Next.js App Router**: Efficient routing and caching
- **React Query**: Smart data fetching and caching
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic component-level code splitting
- **Lazy Loading**: Components loaded on demand

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

1. **Authentication Not Working**

   - Check backend URL in environment variables
   - Verify CORS configuration in backend
   - Ensure cookies are enabled

2. **File Upload Failing**

   - Check file size limits
   - Verify backend is running
   - Check network connectivity

3. **API Errors**
   - Verify `NEXT_PUBLIC_API_BASE_URL` is correct
   - Check backend server status
   - Review browser network tab for errors

### Development Issues

1. **Build Errors**

   - Run `npm install` to ensure dependencies
   - Check TypeScript errors with `npm type-check`
   - Verify environment variables are set

2. **Styling Issues**
   - Ensure Tailwind CSS is configured correctly
   - Check component imports from `@/components/ui`
   - Verify CSS modules are working

## Contributing

1. **Code Style**: Follow TypeScript and React best practices
2. **Components**: Use Shadcn/ui components when possible
3. **State Management**: Use React Query for server state
4. **Testing**: Add tests for new features
5. **Documentation**: Update README for new features

```

```
