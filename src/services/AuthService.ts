import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/Users';

export interface TokenPayload extends Request {
  userId: number;
  email: string;
  name: string;
  profile: string;
}



class AuthService {
  async login(email: string, password: string) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(password, user.password_hash);

    if (!senhaValida) {
      throw new Error('Senha incorreta');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      profile: user.profile,
    } as TokenPayload;

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return {
      message: 'Usuário autenticado com sucesso',
      name: user.name,
      profile: user.profile,
      token,
    };

  }
}

export default new AuthService();