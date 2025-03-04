import { Router } from "express";
import express from "express"
import { MovementsController } from "../controllers/MovementsController";
import { Request, Response } from "express"
import { isBranch, isBranchOrDriver, isDriver, verifyToken } from "../middlewares/auth";

const movementsRouter = Router();
const movementController = new MovementsController()

movementsRouter.post("/", verifyToken as express.RequestHandler, isBranch as express.RequestHandler, (req: Request, res: Response) => {
  movementController.createMovement;
})

movementsRouter.get("/", verifyToken as express.RequestHandler, isBranchOrDriver as express.RequestHandler, (req: Request, res: Response) => {
  movementController.listMovements;
})

movementsRouter.patch("/:id/start", verifyToken as express.RequestHandler, isDriver as express.RequestHandler, (req: Request, res: Response) => {
  movementController.updateProgress
})

movementsRouter.patch("/:id/end", verifyToken as express.RequestHandler, isDriver as express.RequestHandler, (req: Request, res: Response) => {
  movementController.updateFinished
})

export default movementsRouter;
