import Router from "express";
import { AuthController } from "../controllers/AuthController";
import { Request, Response } from "express"

const authRouter = Router();

const authController = new AuthController()

authRouter.post("/", (req: Request, res: Response) => {
  authController.login(req, res)
})

export default authRouter;
