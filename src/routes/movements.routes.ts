import { Router } from "express";
import express from "express";
import { MovementsController } from "../controllers/MovementsController";
import { Request, Response } from "express";
import { isBranch, isBranchOrDriver, isDriver, verifyToken } from "../middlewares/auth";

const movementsRouter = Router();
const movementController = new MovementsController();

movementsRouter.post("/", verifyToken as express.RequestHandler, isBranch as express.RequestHandler, async (req: Request, res: Response) => {
  try {
    await movementController.createMovement(req as any, res)
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar movimentação", error });
  }
});

movementsRouter.get("/", verifyToken as express.RequestHandler, isBranchOrDriver as express.RequestHandler, async (req: Request, res: Response) => {
  try {
    await movementController.listMovements(req as any, res)
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar movimentações", error });
  }
});

movementsRouter.patch("/:id/start", verifyToken as express.RequestHandler, isDriver as express.RequestHandler, async (req: Request, res: Response) => {
  try {
    await movementController.updateProgress(req as any, res)
  } catch (error) {
    res.status(500).json({ message: "Erro ao iniciar movimentação", error });
  }
});

movementsRouter.patch("/:id/end", verifyToken as express.RequestHandler, isDriver as express.RequestHandler, async (req: Request, res: Response) => {
  try {
    await movementController.updateFinished(req as any, res)
  } catch (error) {
    res.status(500).json({ message: "Erro ao finalizar movimentação", error });
  }
});

export default movementsRouter;
