import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

export interface AuthRequest extends Request {
  userId: string;
  profile: string;
}


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Acesso não autorizado: Token não fornecido" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: string, profile: string };


    (req as AuthRequest).userId = decoded.userId;
    (req as AuthRequest).profile = decoded.profile;

    next();
  } catch (error) {
    throw new AppError("Acesso não autorizado, Token Inválido", 401)
  }
};
