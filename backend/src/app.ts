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

// Trust proxy (required for Render and other hosting platforms)
app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: true, // Try enabling resave for better persistence
    saveUninitialized: true, // Required for OAuth state handling
    name: "connect.sid", // Use default session name
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // Shorter timeout - 1 hour
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Error handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

console.log("Server setup complete, waiting for requests...");
