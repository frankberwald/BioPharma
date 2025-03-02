import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth";

export const verifyProfile = (expectedProfile: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const { profile } = req;

    if (profile !== expectedProfile) {
      return res.status(403).json({ message: "Acesso negado: perfil inválido" });
    }

    next();
  };
};
