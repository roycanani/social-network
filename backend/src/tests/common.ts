import { User as UserModel } from "../users/model";

export type User = UserModel & {
  accessToken?: string;
  refreshToken?: string;
};
