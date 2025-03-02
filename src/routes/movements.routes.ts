import { Router } from "express";
import { MovementsController } from "../controllers/MovementsController";
import { Request, Response } from "express"

const movementsRouter = Router();
const movementController = new MovementsController()

movementsRouter.post("/", (req: Request, res: Response) => {
  movementController.createMovement(req, res)
})

movementsRouter.get("/", (req: Request, res: Response) => {
  movementController.listMovements(req, res)
})

movementsRouter.patch("/:id/start", (req: Request, res: Response) => {
  movementController.updateProgress(req, res)
})

movementsRouter.patch("/:id/end", (req: Request, res: Response) => {
  movementController.updateFinished(req, res)
})

export default movementsRouter;
