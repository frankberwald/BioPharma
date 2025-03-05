import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";

// Definindo a estrutura dos dados no token JWT
type dataJwt = JwtPayload & { userId: string; profile: string };


export interface AuthRequest extends Request {
  userId: string;
  profile: string;
  params: { id: string };
}

export const verifyToken = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      throw new AppError("Token não informado", 401);
    }

    const data = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;

    req.userId = data.userId;
    req.profile = data.profile;

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 401));
    } else {
      next(new AppError("Erro desconhecido", 401));
    }
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.profile !== "ADMIN") {
    throw new AppError(
      "Acesso negado: apenas administradores podem acessar esta rota.", 403);
  }
  next();
};

export const isBranch = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.profile !== "BRANCH") {
    throw new AppError(
      "Acesso negado: apenas filial podem acessar esta rota.", 403);
  }
  next();
};

export const isDriver = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.profile !== "DRIVER") {
    throw new AppError(
      "Acesso negado: apenas motoristas podem acessar esta rota.", 403);
  }
  next();
};

export const isBranchOrDriver = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.profile !== "BRANCH" && req.profile !== "DRIVER") {
    throw new AppError("Acesso negado: apenas filiais ou motoristas podem acessar esta rota.", 403);
  }
  next();
};

export const isAdminOrDriver = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.profile !== "ADMIN" && req.profile !== "DRIVER") {
    throw new AppError("Acesso negado: apenas filiais ou motoristas podem acessar esta rota.", 403);
  }
  next();
};