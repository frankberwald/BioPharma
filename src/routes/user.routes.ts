import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userController = new UserController()

const userRouter = Router();

userRouter.post('/', userController.createUser)

userRouter.get('/', userController.getAll)

userRouter.get('/:id', userController.getById)

userRouter.put('/:id', userController.userUpdate)

userRouter.patch('/:id/status', userController.updateStatus)

export default userRouter;
