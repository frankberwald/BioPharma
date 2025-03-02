import { NextFunction, Router } from "express";
import { UserController } from "../controllers/UserController";
import { Request, Response } from "express"

const userController = new UserController()

const userRouter = Router();

userRouter.post("/", (req: Request, res: Response) => {
  userController.createUser(req, res);
});

userRouter.get('/', (req: Request, res: Response) => {
  userController.getAll
})

userRouter.get('/:id', (req: Request, res: Response) => {
  userController.getById(req, res)
})

userRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.userUpdate(req, res, next)
})

userRouter.patch("/:id/status", (req: Request, res: Response, next: NextFunction) => {
  userController.updateStatus(req, res, next);
});

export default userRouter;
