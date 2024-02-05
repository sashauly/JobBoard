import { Role, Token, User } from "@prisma/client";

import userService from "./user.service";
import { ApiError } from "../classes/ApiError";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import authUtils from "../utils/auth";
import tokenService from "./token.service";

export default {
  async register(name: string, email: string, password: string, role: Role) {
    // const candidate = await userService.getUserByEmail(email);
    // if (candidate) {
    //   throw new ApiError(HttpStatusCodes.BAD_REQUEST, "User already exists");
    // }
    const hashedPassword = authUtils.hashPassword(password);
    const user = await userService.createUser(
      name,
      email,
      hashedPassword,
      role
    );
    return user;
  },

  async login(userId: string, expiredIn: number) {
    const accessToken = authUtils.createAccessToken(userId);
    const refreshToken = authUtils.createRefreshToken(userId);

    const expiresAt = new Date(Date.now() + expiredIn); // 7 days from now in milliseconds
    const token = await tokenService.createToken(
      userId,
      refreshToken,
      expiresAt
    );

    return { accessToken, refreshToken };
  },

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing refresh token");
    }
    const token = await tokenService.deleteTokenByRefreshToken(refreshToken);
    return token;
  },

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing refresh token");
    }
    const decoded = authUtils.verifyRefreshToken(refreshToken) as Token;
    if (decoded.expiresAt < new Date()) {
      throw new ApiError(HttpStatusCodes.UNAUTHORIZED, "Refresh token expired");
    }
    const { userId } = decoded;
    const storedToken = await tokenService.getTokenByUserId(
      userId,
      refreshToken
    );
    if (!storedToken) {
      throw new ApiError(HttpStatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }
    if (storedToken.refreshToken !== refreshToken) {
      throw new ApiError(HttpStatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }
    const newAccessToken = authUtils.createAccessToken(userId);
    return newAccessToken;
  },
};
