import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId: string;
  profile: string;
}

// Middleware to verify the token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Acesso não autorizado: Token não fornecido" });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string, profile: string };

    // Attach user information to the request object
    (req as AuthRequest).userId = decoded.userId;
    (req as AuthRequest).profile = decoded.profile;

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Acesso não autorizado: Token inválido" });
  }
};
