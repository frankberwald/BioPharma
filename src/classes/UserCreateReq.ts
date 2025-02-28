import { UserProfile } from "../entities/Users";

export class UserCreateReq {
  name: string;
  email: string;
  profile: UserProfile;
  password: string;
  document: string;
  full_address?: string;
}