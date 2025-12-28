import dotenv from "dotenv";

// Load environment variables first, before any other imports
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
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
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
  console.log(`Server running on http://localhost:${port}`);
});
