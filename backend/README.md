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
- **Authentication**: Passport.js with Google OAuth
- **File Uploads**: Multer
- **Session Management**: express-session

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

The server will start on `http://localhost:3000`

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
SESSION_SECRET=your-super-secret-session-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

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

# Start production server
npm start

# Type checking
npx tsc --noEmit
```

## File Storage

- Files are stored in the `./uploads` directory
- Each file gets a unique generated filename
- Original filenames are preserved in the database
- Files are organized by upload date and random identifiers

## Security Features

- Session-based authentication
- File ownership verification
- Path traversal protection
- File size limits
- Soft delete for data recovery

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
├── app.ts              # Main application setup
├── routes/
│   ├── index.ts        # Route aggregator
│   ├── auth.ts         # Authentication routes
│   └── files.ts        # File management routes
├── db/
│   └── db.ts           # Database schema and operations
└── types/
    ├── express.d.ts    # Express type extensions
    └── passport-google-oidc.d.ts  # Passport strategy types
```

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Update documentation for new features
5. Test all endpoints before submitting
