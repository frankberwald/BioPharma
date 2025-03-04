import { AppDataSource } from "../data-source";
import { Request, Response } from "express"
import { Product } from "../entities/Products";
import { AuthRequest } from "../middlewares/auth";

export class ProductsController {
  private productRepository = AppDataSource.getRepository(Product)

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product)
    this.createProduct = this.createProduct.bind(this)
    this.getAllProducts = this.getAllProducts.bind(this)
  }

  createProduct = async (req: AuthRequest, res: Response) => {
    try {
      const { profile } = req

      if (profile !== "BRANCH") {
        res.status(403).json({ message: "Acesso negado, apenas filiais podem cadastrar produtos." });
        return
      }
      let productsBody = req.body as Product

      if (!productsBody.name || !productsBody.amount || !productsBody.description || !productsBody.branch_id) {
        res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" })
        return
      }
      const product = await this.productRepository.save({
        name: productsBody.name,
        amount: productsBody.amount,
        description: productsBody.description,
        url_cover: productsBody.url_cover || "",
        branch_id: productsBody.branch_id
      })
      res.status(201).json({ message: "Produto cadastrado com sucesso:", productName: product.name, productAmount: product.amount, branch: product.branch_id })

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const { profile } = req
      if (profile === "BRANCH") {
        const productsInDB = await AppDataSource.getRepository(Product).find({
          order: { id: 'ASC' },
        })
        return res.status(200).json({ message: "Produtos:", productsInDB })
      } else {
        res.status(403).json({ message: "Você não tem permissão para acessar esses dados." })
      }
    } catch (ex) {
      console.error("Erro ao buscar produtos:", ex);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
