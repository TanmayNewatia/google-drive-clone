declare module "passport-google-oidc" {
  import { Request } from "express";

  interface GoogleStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  interface Profile {
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

  type VerifyCallback = (error?: any, user?: any, info?: any) => void;
  type VerifyFunction = (
    issuer: string,
    profile: Profile,
    done: VerifyCallback
  ) => void;

  export class Strategy {
    constructor(options: GoogleStrategyOptions, verify: VerifyFunction);
    authenticate(req: Request, options?: any): void;
    name: string;
  }
}
