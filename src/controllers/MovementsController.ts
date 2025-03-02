import { AppDataSource } from "../data-source";
import { Request, Response } from "express"
import { Product } from "../entities/Products";
import { Movements } from "../entities/Movements";
import { Branch } from "../entities/Branch";
import jwt from "jsonwebtoken"
import { TokenPayload } from "../services/AuthService";
import AppError from "../utils/AppError";
import { MovementStatus } from "../entities/Movements";

export class MovementsController {
  private movementRepository = AppDataSource.getRepository(Movements)
  private productRepository = AppDataSource.getRepository(Product)

  constructor() {
    this.movementRepository = AppDataSource.getRepository(Movements)
    this.productRepository = AppDataSource.getRepository(Product)
  }

  createMovement = async (req: Request, res: Response) => {
    try {

      const token = req.headers.authorization?.split(" ")[1]

      if (!token) {
        res.status(401).json({ message: "Token não fornecido" })
        return
      }

      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, String(secret)) as TokenPayload

      if (!decoded) {
        res.status(401).json({ message: "Token inválido" })
      }

      const { destination_branch_id, product_id, quantity } = req.body
      if (!destination_branch_id || !product_id || !quantity) {
        res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" })
        return
      }

      if (quantity <= 0) {
        res.status(400).json({ message: "A quantidade deve ser maior que 0" })
        return
      }

      if (decoded.profile === "BRANCH" || decoded.profile === "DRIVER") {

        const product = await this.productRepository.findOne({
          where: { id: product_id },
          relations: ["branch"] // Ensure that the branch is loaded
        });
        const destinationBranch = await AppDataSource.getRepository(Branch).findOne({
          where: { id: destination_branch_id }
        });

        if (!product || !destinationBranch) {
          return res.status(404).json({ message: "Produto ou filial não encontrados" });
        }

        if (product.branch.id === destinationBranch.id) {
          return res.status(400).json({ message: "A filial de origem não pode ser a mesma que a filial de destino" });
        }

        if (product.amount < quantity) {
          return res.status(400).json({ message: "Estoque insuficiente para essa movimentação" });
        }
        product.amount -= quantity;
        await this.productRepository.save(product);

        const movement = new Movements();
        movement.destinationBranch = destinationBranch;
        movement.product = product;
        movement.quantity = quantity;
        movement.status;
        await this.movementRepository.save(movement);
        res.status(201).json({ message: "Movimentação cadastrada com sucesso" })
      } else {
        throw new AppError("Você não tem permissão para criar movimentações", 403)
      }

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  listMovements = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]

      if (!token) {
        res.status(401).json({ message: "Token não fornecido" })
        return
      }

      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, String(secret)) as TokenPayload

      if (!decoded) {
        res.status(401).json({ message: "Token inválido" })
      }

      if (decoded.profile === "BRANCH" || decoded.profile === "DRIVER") {
        const productsInDB = await AppDataSource.getRepository(Product).find({
          order: { id: 'ASC' },
        })
        return res.status(200).json({ message: "Produtos:", productsInDB })
      } else {
        res.status(403).json({ message: "Você não tem permissão para acessar esses dados." })
      }

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  updateProgress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      const movementInDB = await this.movementRepository.findOneBy({
        id: parseInt(id)
      })

      if (!movementInDB) {
        throw new AppError("Movimentação não encontrada", 404)
      }

      if (movementInDB.status === "IN_PROGRESS" || movementInDB.status === "FINISHED") {
        res.status(400).json({ message: "Movimentação já está em andamento ou finalizada" });
        return
      }

      movementInDB.status = MovementStatus.IN_PROGRESS
      await this.movementRepository.save(movementInDB)

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  updateFinished = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      const movementInDB = await this.movementRepository.findOneBy({
        id: parseInt(id)
      })

      if (!movementInDB) {
        throw new AppError("Movimentação não encontrada", 404)
      }

      if (movementInDB.status === "IN_PROGRESS" || movementInDB.status === "FINISHED") {
        res.status(400).json({ message: "Movimentação já está em andamento ou finalizada" });
        return
      }

      movementInDB.status = MovementStatus.FINISHED
      await this.movementRepository.save(movementInDB)

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}