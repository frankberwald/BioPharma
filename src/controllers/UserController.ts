import { Request, Response } from "express"
import { User } from "../entities/Users"
import { AppDataSource } from "../data-source"

export class UserController {
  private userRespository = AppDataSource.getRepository(User)

  constructor() {
    this.userRespository = AppDataSource.getRepository(User)
  }

  userLogin = async (req: Request, res: Response) => {
    try {

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  createUser = async (req: Request, res: Response) => {
    try {

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  getAll = async (req: Request, res: Response) => {
    try {

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  userUpdate = async (req: Request, res: Response) => {
    try {

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }

  updateStatus = async (req: Request, res: Response) => {
    try {

    } catch (ex) {
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  }
}