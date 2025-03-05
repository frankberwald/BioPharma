import { AppDataSource } from "../data-source";
import { Response } from "express"
import { Product } from "../entities/Products";
import { Movements } from "../entities/Movements";
import { Branch } from "../entities/Branch";
import AppError from "../utils/AppError";
import { MovementStatus } from "../entities/Movements";
import { AuthRequest } from "../middlewares/auth";
import { UserProfile } from "../entities/Users";
import { Drivers } from "../entities/Drivers";

export class MovementsController {
  private movementRepository = AppDataSource.getRepository(Movements)
  private productRepository = AppDataSource.getRepository(Product)
  private driverRepository = AppDataSource.getRepository(Drivers)

  constructor() {
    this.movementRepository = AppDataSource.getRepository(Movements)
    this.productRepository = AppDataSource.getRepository(Product)
    this.driverRepository = AppDataSource.getRepository(Drivers)
  }

  createMovement = async (req: AuthRequest, res: Response) => {
    try {
      const { profile } = req

      const { destination_branch_id, product_id, quantity } = req.body
      if (!destination_branch_id || !product_id || !quantity) {
        res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" })
        return
      }

      if (quantity <= 0) {
        res.status(400).json({ message: "A quantidade deve ser maior que 0" })
        return
      }

      if (profile === "BRANCH") {

        const product = await this.productRepository.findOne({
          where: { id: product_id },
          relations: ["branch"]
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

  listMovements = async (req: AuthRequest, res: Response) => {
    try {
      const { profile } = req
      const movementsInDB = await AppDataSource.getRepository(Movements).find({
        order: { id: 'ASC' },
      })
      return res.status(200).json({ message: "Movimentações:", movementsInDB })

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  updateProgress = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params; // O ID da movimentação passado na URL
      const { userId } = req;    // O ID do usuário do motorista

      // Encontrando o motorista com base no userId
      const driver = await this.driverRepository.findOne({
        where: { user: { id: parseInt(userId) } }
      });

      if (!driver) {
        return res.status(404).json({ message: "Motorista não encontrado" });
      }

      // Encontrando a movimentação associada ao motorista
      const movementInDB = await this.movementRepository.findOne({
        where: { id: parseInt(id), driver: { id: driver.id } }
      });

      if (!movementInDB) {
        return res.status(404).json({ message: "Movimentação não encontrada" });
      }

      // Verificando o status da movimentação
      if (movementInDB.status !== MovementStatus.PENDING) {
        return res.status(400).json({ message: "Somente movimentações pendentes podem ser iniciadas." });
      }

      // Associando a movimentação ao motorista e alterando o status para IN_PROGRESS
      movementInDB.status = MovementStatus.IN_PROGRESS;
      await this.movementRepository.save(movementInDB);

      return res.status(200).json({ message: "Status da movimentação atualizado com sucesso", movementInDB });

    } catch (ex) {
      console.error(ex);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };


  // updateProgress = async (req: Request, res: Response) => {
  //   try {
  //     const id = req.body
  //     const userId = Number(req);

  //     const driver = await this.driverRepository.findOneBy({ user_id: userId });

  //     if (!driver) {
  //       return res.status(403).json({ error: "Acesso negado. Apenas motoristas podem atualizar esta movimentação." });
  //     }

  //     const movementsInDataBase = await this.movementRepository.findOneBy({ id: Number(id) });

  //     if (!movementsInDataBase) {
  //       return res.status(404).json({ error: "Movimentação não encontrada." });
  //     }

  //     if (movementsInDataBase.status === "IN_PROGRESS" || movementsInDataBase.status === "FINISHED") {
  //       return res.status(400).json({ error: "Movimentação já iniciou ou está finalizada." });
  //     }

  //     movementsInDataBase.status = MovementStatus.IN_PROGRESS;
  //     await this.movementRepository.save(movementsInDataBase);

  //     return res.status(200).json({ message: "Movimentação atualizada com sucesso!.", movementsInDataBase });

  //   } catch (error) {
  //     return res.status(500).json({ message: "Não foi possível atualizar a movimentação." });
  //   }
  // };


  updateFinished = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params
      const { userId } = req

      const driver = await this.driverRepository.findOne({
        where: { user: { id: Number(userId) } }
      });

      if (!driver) {
        res.status(404).json({ message: "Motorista não encontrado" });
        return
      }

      const movementInDB = await this.movementRepository.findOne({
        where: { id: parseInt(id), driver: { id: driver.id } }
      });

      if (!movementInDB) {
        throw new AppError("Movimentação não encontrada", 404)
      }

      if (movementInDB.status === MovementStatus.IN_PROGRESS || movementInDB.status === MovementStatus.FINISHED) {
        return res.status(400).json({ message: "Movimentação já está em andamento ou finalizada" });
      }

      if (movementInDB.status === MovementStatus.PENDING) {
        movementInDB.status = MovementStatus.FINISHED;
        await this.movementRepository.save(movementInDB);
        return res.status(200).json({ message: "Movimentação finalizada com sucesso" });
      }


      movementInDB.status = MovementStatus.FINISHED
      await this.movementRepository.save(movementInDB)
      res.status(200).json({ message: "Movimentação finalizada com sucesso" });

    } catch (ex) {
      if (ex instanceof AppError) {
        res.status(ex.statusCode).json({ message: ex.message })
        return
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}