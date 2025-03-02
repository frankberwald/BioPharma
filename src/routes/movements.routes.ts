import { Router } from "express";
import { MovementsController } from "../controllers/MovementsController";
import { Request, Response } from "express"
import { verifyToken } from "../middlewares/auth";
import { verifyProfile } from "../middlewares/verifyProfile";

const movementsRouter = Router();
const movementController = new MovementsController()

movementsRouter.post("/", (req: Request, res: Response) => {
  movementController.createMovement(req, res)
})

movementsRouter.get("/", (req: Request, res: Response) => {
  movementController.listMovements(req, res)
})

movementsRouter.patch("/:id/start", verifyToken, verifyProfile, (req: Request, res: Response) => {
  movementController.updateProgress(req, res)
})

movementsRouter.patch("/:id/end", (req: Request, res: Response) => {
  movementController.updateFinished(req, res)
})

export default movementsRouter;
