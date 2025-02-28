import { NextFunction, Request, Response } from "express"
import { User } from "../entities/Users"
import { AppDataSource } from "../data-source"
import bcrypt from "bcrypt"
import { Drivers } from "../entities/Drivers"
import { UserProfile } from "../entities/Users"
import { UserCreateReq } from "../classes/UserCreateReq"
import { Branch } from "../entities/Branch"
import { AuthRequest } from "../middlewares/auth"
import jwt from 'jsonwebtoken';
import { TokenPayload } from "../services/AuthService"
import AppError from "../utils/AppError"

export class UserController {
  private userRespository = AppDataSource.getRepository(User)
  private driverRepository = AppDataSource.getRepository(Drivers)
  private branchRepository = AppDataSource.getRepository(Branch)

  constructor() {
    this.userRespository = AppDataSource.getRepository(User)
    this.driverRepository = AppDataSource.getRepository(Drivers)
  }

  createUser = async (req: Request, res: Response) => {
    try {
      let userBody = req.body as UserCreateReq
      let user = await this.userRespository.save({
        name: userBody.name,
        email: userBody.email,
        password_hash: await bcrypt.hash(userBody.password, 10),
        profile: userBody.profile,
        document: userBody.document
      })

      if (userBody.profile == UserProfile.DRIVER) {
        this.driverRepository.save({
          user_id: user.id,
          document: userBody.document
        })
      } else if (userBody.profile == UserProfile.BRANCH) {
        this.branchRepository.save({
          user_id: user.id,
          full_address: userBody.full_address
        })
      }
      res.status(201).json({ message: "Usuário criado com sucesso", user });
    } catch (ex) {
      console.error("Erro ao criar usuário:", ex);
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const user = req.userId || req.body;

      if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
      }

      if (!user) {
        res.status(401).json({ message: "Usuário não encontrado" })
      }

      const secret = process.env.JWT_SECRET;

      const decoded = jwt.verify(token, String(secret)) as unknown as TokenPayload;

      if (decoded.profile === 'ADMIN') {
        const users = await AppDataSource.getRepository(User).find({
          order: { id: 'ASC' }
        })
        res.status(200).json(users);
        return;
      } else {
        return res.status(403).json({ message: 'Acesso negado, você não é ADMIN ou o MOTORISTA correspondente' });
      }



    } catch (ex) {
      console.error("Erro ao buscar usuários:", ex);
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { user } = req.body;
      const { id } = req.params

      if (!user) {
        res.status(401).json({ message: "Usuário não encontrado" })
      }
      let usersReturn;

      if (user.profile == UserProfile.ADMIN) {
        usersReturn = await this.userRespository.findOne({
          where: { id: parseInt(id) },
          relations: ["driver", "branch"],
        })
      } else if (user.profile === UserProfile.DRIVER) {
        if (user.id !== parseInt(id)) {
          res.status(403).json({ message: "Acesso negado" })
        }

        usersReturn = await this.userRespository.findOne({
          where: { id: user.id },
          relations: ["drivers"]
        })
      } else if (user.profile === UserProfile.BRANCH) {
        if (user.id !== parseInt(id) && !user.driver) {
          res.status(403).json({ message: "Acesso negado" });
        }
        usersReturn = await this.userRespository.findOne({
          where: { id: parseInt(id) },
          relations: ["branches", "drivers"]
        })
      } else {
        res.status(403).json({ message: "Acesso negado" })
      }
      if (!usersReturn) {
        res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.status(200).json(usersReturn)

    } catch (ex) {
      console.error("Erro ao buscar usuário:", ex);
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  userUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params
      const body = req.body
      if (body.id || body.created_at || body.updated_at) {
        throw new AppError("Certos dados não podem ser atualizados", 403)
      }

      const userInDB = await this.userRespository.findOneBy({
        id: parseInt(params.id)
      })

      if (!userInDB) {
        throw new AppError("Usuário não encontrado", 404)
      } else {
        Object.assign(userInDB, body)
        await this.userRespository.save(userInDB)
        res.status(200).json(userInDB)
      }

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
      next(Error)
    }
  }

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const userInDB = await this.userRespository.findOneBy({
        id: parseInt(id)
      })

      if (!userInDB) {
        throw new AppError("Usuário não encontrado", 404)
      }

      userInDB.status = !userInDB.status
      await this.userRespository.save(userInDB)

      res.status(200).json({ message: "Status de usuário atualizado com sucesso", status: userInDB.status })

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
      next()
    }
  }
}