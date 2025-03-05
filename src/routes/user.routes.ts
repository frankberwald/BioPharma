import { NextFunction, Router } from "express";
import express from "express";
import { UserController } from "../controllers/UserController";
import { Request, Response } from "express";
import { AuthRequest, isAdmin, isAdminOrDriver, isBranch, verifyToken } from "../middlewares/auth";

const userController = new UserController();

const userRouter = Router();

userRouter.post("/", async (req: Request, res: Response) => {
  try {
    await userController.createUser(req, res);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o usuário", error });
  }
});

userRouter.get('/', verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, async (req: Request, res: Response) => {
  try {
    await userController.getAll(req as any, res)
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter usuários", error });
  }
});

userRouter.get('/:id', verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, async (req: Request, res: Response) => {
  try {
    await userController.getById(req, res);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter usuário", error });
  }
});


userRouter.put('/:id', verifyToken as express.RequestHandler, isAdminOrDriver as express.RequestHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.userUpdate(req, res, next);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
});

userRouter.patch("/:id/status", verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.updateStatus(req, res, next);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar status", error });
  }
});

export default userRouter;
