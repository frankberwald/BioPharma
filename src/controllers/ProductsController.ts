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
      let productsBody = req.body as Product;

      const { name, amount, description, branch_id } = productsBody;
      if (!name || !amount || !description || !branch_id) {
        res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
        return
      }
      console.log("Salvando produto no banco de dados...");

      const product = await this.productRepository.save({
        name,
        amount,
        description,
        url_cover: productsBody.url_cover || "",
        branch_id
      });
      res.status(201).json({ message: "Produto cadastrado com sucesso", product });
      return

    } catch (ex) {
      console.error("Erro ao cadastrar produto:", ex);
      res.status(500).json({ message: "Erro interno do servidor", Error });
      return
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
