import { Request } from "express";
import { UserProfile } from "../../entities/Users"

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: number;
    profile: UserProfile;
  };
}
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      profile?: string;
    }
  }
}