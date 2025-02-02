import jwt from "jsonwebtoken";
import { User, userModel } from "../users/model";
import { Document } from "mongoose";

type JWTToken = {
  accessToken: string;
  refreshToken: string;
};

export const generateToken = (userId: string): JWTToken | null => {
  if (!process.env.SERVER_TOKEN_SECRET || !process.env.TOKEN_EXPIRES) {
    return null;
  }
  // generate token
  const random = Math.random().toString();
  const accessToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.SERVER_TOKEN_SECRET,
    { expiresIn: parseInt(process.env.TOKEN_EXPIRES, 10) }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.SERVER_TOKEN_SECRET,
    { expiresIn: parseInt(process.env.TOKEN_EXPIRES, 10) }
  );
  return {
    accessToken,
    refreshToken,
  };
};

export type TokenUser = Document<string, unknown, User> & User;

export const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<TokenUser>((resolve, reject) => {
    //get refresh token from body
    if (!refreshToken || !process.env.SERVER_TOKEN_SECRET) {
      reject("fail");
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.SERVER_TOKEN_SECRET,
      async (err, payload) => {
        if (err || typeof payload !== "object") {
          reject("fail");
          return;
        }
        //get the user id fromn token
        const userId = payload._id;
        try {
          //get the user form the db
          const user = await userModel.findById(userId);
          if (!user) {
            reject("fail");
            return;
          }
          if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            await user.save();
            reject("fail");
            return;
          }
          const tokens = user.refreshToken.filter(
            (token) => token !== refreshToken
          );
          user.refreshToken = tokens;

          resolve(user);
        } catch (err) {
          reject("fail " + err);
          return;
        }
      }
    );
  });
};
