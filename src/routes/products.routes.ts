import { Router } from "express";
import express from "express";
import { ProductsController } from "../controllers/ProductsController";
import { Request, Response } from "express";
import { isBranch, verifyToken } from "../middlewares/auth";

const productsRouter = Router();

const productsController = new ProductsController();

productsRouter.post("/", verifyToken as express.RequestHandler, isBranch as express.RequestHandler, async (req: Request, res: Response) => {
  try {
    await productsController.createProduct(req as any, res)
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto", error });
  }
});

productsRouter.get("/", verifyToken as express.RequestHandler, isBranch as express.RequestHandler, async (req: Request, res: Response) => {
  try {
    await productsController.getAllProducts(req, res);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter produtos", error });
  }
});

export default productsRouter;
