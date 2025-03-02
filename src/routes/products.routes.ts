import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController";
import { Request, Response } from "express"

const productsRouter = Router();

const productsController = new ProductsController()

productsRouter.post("/", (req: Request, res: Response) => {
  productsController.createProduct(req, res);
});

productsRouter.get("/", (req: Request, res: Response) => {
  productsController.getAllProducts(req, res);
});


export default productsRouter;
