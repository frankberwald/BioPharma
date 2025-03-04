import { Router } from "express";
import express from "express";
import { ProductsController } from "../controllers/ProductsController";
import { Request, Response } from "express";
import { isBranch, verifyToken } from "../middlewares/auth";


const productsRouter = Router();

const productsController = new ProductsController()

productsRouter.post("/", verifyToken as express.RequestHandler, isBranch as express.RequestHandler, (req: Request, res: Response) => {
  productsController.createProduct
});

productsRouter.get("/", verifyToken as express.RequestHandler, isBranch as express.RequestHandler, (req: Request, res: Response) => {
  productsController.getAllProducts
});


export default productsRouter;
