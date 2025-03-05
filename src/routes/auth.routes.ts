import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { Request, Response } from "express";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/", async (req: Request, res: Response) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login", error });
  }
});

export default authRouter;
