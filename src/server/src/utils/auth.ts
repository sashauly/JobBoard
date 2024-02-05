import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";

const accessTokenExpiresIn = parseFloat(
  process.env.ACCESS_EXPIRES || "15 * 60 * 1000"
);
const refreshTokenExpiresIn = parseFloat(
  process.env.REFRESH_EXPIRES || "7 * 24 * 60 * 60 * 1000"
);

export default {
  createAccessToken(userId: string, expiresIn: number = accessTokenExpiresIn) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not set");
    }
    return sign({ userId }, secret, {
      expiresIn,
    });
  },

  createRefreshToken(
    userId: string,
    expiresIn: number = refreshTokenExpiresIn
  ) {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw new Error("REFRESH_TOKEN_SECRET is not set");
    }
    return sign({ userId }, secret, {
      expiresIn,
    });
  },

  verifyRefreshToken(refreshToken: string) {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw new Error("REFRESH_TOKEN_SECRET is not set");
    }
    return verify(refreshToken, secret);
  },

  verifyAccessToken(accessToken: string) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not set");
    }
    return verify(accessToken, secret);
  },

  hashPassword(password: string) {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    if (!Number.isInteger(saltRounds)) {
      throw new Error("SALT_ROUNDS must be an integer");
    }
    return bcrypt.hashSync(password, saltRounds);
  },

  async comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  },
};
