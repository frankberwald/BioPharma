import { Request, Response } from "express"
import { User } from "../entities/Users"
import { AppDataSource } from "../data-source"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export interface TokenPayload {
  userId: number;
  email: string;
  name: string;
  profile: string;
}

export class AuthController {
  private userRespository = AppDataSource.getRepository(User)

  constructor() {
    this.userRespository = AppDataSource.getRepository(User)
  }

  login = async (req: Request, res: Response) => {
    try {
      let userBody = req.body as {
        email: string,
        password: string
      }
      const userEntity = await this.userRespository.findOneBy({ name: userBody.email })

      if (!userEntity) {
        res.status(400).json({ message: "Usuario não encontrado" })
        return
      }

      const valid = await bcrypt.compare(userBody.password, userEntity?.password_hash)

      if (!valid) {
        res.status(401).json({ message: "Usuário e/ou senha inválido" })
        return
      }

      const payLoad = {
        userId: userEntity.id,
        name: userEntity.name,
        profile: userEntity.profile
      }

      const token = await jwt.sign(payLoad, process.env.JWT_SECRET ?? "")

      res.status(200).json({ token: token, name: userEntity.name, profile: userEntity.profile })

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }
}