import { Request, Response } from "express"
import { User } from "../entities/Users"
import { AppDataSource } from "../data-source"
import AuthService from "../services/AuthService";

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
    const { email, password } = req.body;

    try {
      const result = await AuthService.login(email, password);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ message: Error });
    }
  }
}
