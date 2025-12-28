import dotenv from "dotenv";

// Load environment variables first, before any other imports
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import routes from "./routes";

// For production, we'll use a simple fallback instead of connect-sqlite3
// This avoids the MemoryStore warning while keeping things simple

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
      ].filter(Boolean);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    optionsSuccessStatus: 200, // For legacy browser support
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    name: "google-drive-session",
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-site cookies for production
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware for authentication issues
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log("Session ID:", req.sessionID);
    console.log("Is Authenticated:", req.isAuthenticated?.());
    console.log("User:", req.user);
    console.log("Origin:", req.headers.origin);
    console.log("---");
    next();
  });
}

// Routes
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Google Drive Clone API" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Google Callback URL: ${process.env.GOOGLE_CALLBACK_URL}`);
});
