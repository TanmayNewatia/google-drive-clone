# Google Drive Clone - Backend

A TypeScript Express.js backend for a Google Drive clone application with file management capabilities.

## Features

- **File Management**

  - Upload files (up to 100MB)
  - Download files
  - Rename files
  - Delete files (soft delete)
  - Search files by name
  - List all user files

- **Authentication**

  - Google OAuth 2.0 integration
  - Session-based authentication
  - User management

- **Database**
  - SQLite database with TypeScript interfaces
  - File metadata storage
  - User and authentication data

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Authentication**: Passport.js with Google OAuth 2.0
- **File Uploads**: Multer
- **Session Management**: express-session with trust proxy support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google OAuth credentials

### Installation

1. Clone the repository and navigate to backend:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your Google OAuth credentials
```

4. Build the project:

```bash
npm run build
```

5. Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Production Deployment

### Render.com Deployment

The backend is configured for deployment on Render.com:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Environment**: Node.js

### Environment Variables for Production

Set these environment variables in your Render dashboard:

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain.vercel.app
SESSION_SECRET=your-super-secure-session-secret-for-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.onrender.com/api/auth/google/callback
```

## Environment Variables

### Development (.env)

Create a `.env` file with the following variables:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-super-secret-session-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

### Production

Use the values from `.env.production` or set them directly in your hosting platform:

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain.vercel.app
SESSION_SECRET=your-super-secure-session-secret-for-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.onrender.com/api/auth/google/callback
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized origins:
   - Development: `http://localhost:3001`
   - Production: `https://your-backend-domain.onrender.com`
   - Frontend: `https://your-frontend-domain.vercel.app`
6. Add authorized redirect URIs:
   - Development: `http://localhost:3001/api/auth/google/callback`
   - Production: `https://your-backend-domain.onrender.com/api/auth/google/callback`
7. Copy Client ID and Client Secret to your environment variables

### Important Notes

- Uses `passport-google-oauth20` strategy for reliable session handling
- Supports cross-origin authentication between frontend and backend
- Session persistence is handled with trust proxy configuration for production

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for detailed API documentation.

### Quick API Overview

- `POST /api/files/upload` - Upload a file
- `GET /api/files` - Get all user files
- `GET /api/files/:id` - Get specific file metadata
- `PUT /api/files/:id/rename` - Rename a file
- `DELETE /api/files/:id` - Delete a file
- `GET /api/files/search?q=term` - Search files
- `GET /api/files/:id/download` - Download a file
- `GET /api/auth/google` - Start Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

## Database Schema

### Users Table

- id, username, hashed_password, salt, name, email
- created_at, updated_at

### Federated Credentials Table

- id, user_id, provider, subject

### Files Table

- id, filename, original_name, file_path, file_size, mime_type
- owner_id, created_at, modified_at, uploaded_at, is_deleted

## Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server (after build)
npm start

# Start production server (alternative)
npm run start:prod

# Clean build directory
npm run clean

# Type checking
npx tsc --noEmit
```

## File Storage

- Files are stored in the `./uploads` directory
- Each file gets a unique generated filename
- Original filenames are preserved in the database
- Files are organized by upload date and random identifiers

## Security Features

- Session-based authentication with Google OAuth 2.0
- Trust proxy configuration for production hosting
- Cross-origin request handling (CORS)
- File ownership verification
- Path traversal protection
- File size limits (100MB)
- Soft delete for data recovery
- Secure cookie handling in production (HTTPS)

## Production Considerations

- **Session Management**: Configured for hosting platforms like Render.com
- **Trust Proxy**: Enabled for proper session handling behind reverse proxies
- **CORS**: Configured to allow frontend domains (localhost, Vercel, etc.)
- **Environment Variables**: TypeScript types moved to dependencies for production builds
- **Database**: SQLite with persistent file system storage

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Testing

You can test the API using curl, Postman, or any HTTP client. Make sure to include authentication cookies in your requests after logging in via Google OAuth.

## Project Structure

```
src/
├── app.ts              # Main application setup with trust proxy
├── routes/
│   ├── index.ts        # Route aggregator
│   ├── auth.ts         # Authentication routes (Google OAuth 2.0)
│   └── files.ts        # File management routes
├── db/
│   └── db.ts           # Database schema and operations
└── types/
    ├── express.d.ts    # Express type extensions
    └── passport-google-oidc.d.ts  # Legacy type definitions
```

## Troubleshooting

### Authentication Issues

If you encounter authentication problems:

1. **Session State Errors**: Ensure `trust proxy` is enabled for production
2. **CORS Issues**: Verify frontend domain is in CORS whitelist
3. **Cookie Issues**: Check secure/sameSite settings for production
4. **Type Errors**: Ensure `@types/passport-google-oauth20` is in dependencies

### Common Production Issues

- **Environment Variables**: Must be set in hosting platform dashboard
- **Build Errors**: TypeScript types must be in `dependencies`, not `devDependencies`
- **Session Persistence**: Requires proper trust proxy configuration
- **Cross-Origin Cookies**: Requires `sameSite: "none"` and `secure: true` in production

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Update documentation for new features
5. Test all endpoints before submitting
