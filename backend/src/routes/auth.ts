import express from "express";
import passport from "passport";
import { dbUtils, User, FederatedCredential } from "../db/db";
import { Strategy as GoogleStrategy } from "passport-google-oidc";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("ERROR: Google OAuth environment variables are not set!");
  console.error(
    "Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file"
  );
  process.exit(1);
}

// Type definitions for Passport user
export interface PassportUser {
  id: number;
  username?: string;
  name: string;
}

// Profile type from Google OAuth
interface GoogleProfile {
  id: string;
  displayName?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{
    value: string;
    verified?: boolean;
  }>;
}

// Configure the Google strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's
// behalf, along with the user's profile. The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function verify(issuer: string, profile: any, cb: Function) {
      try {
        // Check if user already exists with this federated credential
        const existingCredential = await dbUtils.get<FederatedCredential>(
          "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
          [issuer, profile.id]
        );

        if (!existingCredential) {
          // Create new user
          const userResult = await dbUtils.run(
            "INSERT INTO users (name, email, username) VALUES (?, ?, ?)",
            [
              profile.displayName || profile.name?.givenName || "Unknown User",
              profile.emails?.[0]?.value || "",
              profile.emails?.[0]?.value || `user_${Date.now()}`,
            ]
          );

          const userId = userResult.lastID!;

          // Create federated credential
          await dbUtils.run(
            "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)",
            [userId, issuer, profile.id]
          );

          const user: PassportUser = {
            id: userId,
            name:
              profile.displayName || profile.name?.givenName || "Unknown User",
            username: profile.emails?.[0]?.value || `user_${userId}`,
          };

          return cb(null, user);
        } else {
          // User exists, get user details
          const user = await dbUtils.get<User>(
            "SELECT * FROM users WHERE id = ?",
            [existingCredential.user_id]
          );

          if (!user) {
            return cb(null, false);
          }

          const passportUser: PassportUser = {
            id: user.id,
            name: user.name,
            username: user.username,
          };

          return cb(null, passportUser);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        return cb(error);
      }
    }
  )
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session. In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.
passport.serializeUser(function (user: any, cb: Function) {
  process.nextTick(function () {
    const serializedUser = {
      id: user.id,
      username: user.username,
      name: user.name,
    };
    cb(null, serializedUser);
  });
});

passport.deserializeUser(function (user: PassportUser, cb: Function) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const router = express.Router();

/* GET /login
 *
 * This route prompts the user to log in.
 *
 * The 'login' view renders an HTML page, which contain a button prompting the
 * user to sign in with Google. When the user clicks this button, a request
 * will be sent to the `GET /login/federated/google` route.
 */
router.get(
  "/login",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // For now, just redirect to Google auth or return JSON
    res.json({
      message: "Please authenticate with Google",
      loginUrl: "/auth/login/federated/google",
    });
  }
);

/* GET /login/federated/google
 *
 * This route redirects the user to Google, where they will authenticate.
 *
 * Signing in with Google is implemented using OAuth 2.0. This route initiates
 * an OAuth 2.0 flow by redirecting the user to Google's identity server at
 * 'https://accounts.google.com'. Once there, Google will authenticate the user
 * and obtain their consent to release identity information to this app.
 *
 * Once Google has completed their interaction with the user, the user will be
 * redirected back to the app at `GET /oauth2/redirect/google`.
 */
router.get("/google", passport.authenticate("google"));

/* GET /auth/google/callback
 *
 * This route completes the authentication sequence when Google redirects the
 * user back to the application. When a new user signs in, a user account is
 * automatically created and their Google account is linked. When an existing
 * user returns, they are signed in to their linked account.
 */
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google callback hit");
    console.log("Query params:", req.query);
    console.log("Session before auth:", req.sessionID);
    next();
  },
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/?error=auth_failed`,
  }),
  function (req: express.Request, res: express.Response) {
    console.log("Auth successful, user:", req.user);
    console.log("Session after auth:", req.sessionID);
    // Successful authentication, redirect to frontend
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback`
    );
  }
);

/* POST /logout
 *
 * This route logs the user out.
 */
router.post(
  "/logout",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.json({ message: "Logged out successfully" });
    });
  }
);

/* GET /profile
 *
 * This route returns the current user's profile information.
 */
router.get("/profile", function (req: express.Request, res: express.Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({ user: req.user });
});

/* GET /check
 *
 * This route checks if the user is authenticated.
 */
router.get("/check", function (req: express.Request, res: express.Response) {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null,
  });
});

/* GET /user
 *
 * This route returns the current authenticated user.
 */
router.get("/user", function (req: express.Request, res: express.Response) {
  if (!req.isAuthenticated() || !req.user) {
    return res.json({ user: null });
  }

  res.json({ user: req.user });
});

export default router;
