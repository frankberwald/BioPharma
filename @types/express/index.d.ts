import { Request } from "express";
import { UserProfile } from "../../src/entities/Users"

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: number;
    profile: UserProfile;
  };
}
