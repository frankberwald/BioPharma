import { NextFunction, Router } from "express";
import express from "express"
import { UserController } from "../controllers/UserController";
import { Request, Response } from "express"
import { isAdmin, isAdminOrDriver, isBranch, verifyToken } from "../middlewares/auth";


const userController = new UserController()

const userRouter = Router();

userRouter.post("/", verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, (req: Request, res: Response) => {
  userController.createUser
});

userRouter.get('/', verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, (req: Request, res: Response) => {
  userController.getAll
})

userRouter.get('/:id', verifyToken as express.RequestHandler, isAdminOrDriver as express.RequestHandler, (req: Request, res: Response) => {
  userController.getById
})

userRouter.put('/:id', verifyToken as express.RequestHandler, isAdminOrDriver as express.RequestHandler, (req: Request, res: Response, next: NextFunction) => {
  userController.userUpdate
})

userRouter.patch("/:id/status", verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, (req: Request, res: Response, next: NextFunction) => {
  userController.updateStatus;
});

export default userRouter;
