import { PassportUser } from "../routes/auth";

declare global {
  namespace Express {
    interface Request {
      user?: PassportUser;
      isAuthenticated(): boolean;
      logout(callback?: (err: any) => void): void;
    }
  }
}

export {};
