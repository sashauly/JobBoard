import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../classes/ApiError";
import HttpStatusCodes from "../constants/HttpStatusCodes";

const accessTokenExpiresIn = Number(
  eval(process.env.ACCESS_EXPIRES || "15 * 60 * 1000")
);
const refreshTokenExpiresIn = Number(
  eval(process.env.REFRESH_EXPIRES || "7 * 24 * 60 * 60 * 1000")
);

export default {
  createAccessToken(userId: string) {
    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "ACCESS_SECRET is not set"
      );
    }
    return sign({ userId }, secret, {
      expiresIn: accessTokenExpiresIn,
    });
  },

  createRefreshToken(userId: string) {
    const secret = process.env.REFRESH_SECRET;
    if (!secret) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "REFRESH_SECRET is not set"
      );
    }
    return sign({ userId }, secret, {
      expiresIn: refreshTokenExpiresIn,
    });
  },

  verifyRefreshToken(refreshToken: string) {
    const secret = process.env.REFRESH_SECRET;
    if (!secret) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "REFRESH_SECRET is not set"
      );
    }
    return verify(refreshToken, secret);
  },

  verifyAccessToken(accessToken: string) {
    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "ACCESS_SECRET is not set"
      );
    }
    return verify(accessToken, secret);
  },

  hashPassword(password: string) {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    if (!Number.isInteger(saltRounds)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "SALT_ROUNDS must be an integer"
      );
    }
    return bcrypt.hashSync(password, saltRounds);
  },

  async comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  },
};
