import { PrismaClient, Token } from "@prisma/client";
import { validate as isValidUUID } from "uuid";

import { ApiError } from "../classes/ApiError";
import HttpStatusCodes from "../constants/HttpStatusCodes";

const tokenClient = new PrismaClient().token;

export default {
  async getTokenByUserId(userId: string, refreshToken: string): Promise<Token> {
    const token = await tokenClient.findUnique({
      where: {
        userId_refreshToken: {
          userId: userId,
          refreshToken: refreshToken,
        },
      },
    });

    if (!token) {
      throw new ApiError(HttpStatusCodes.NOT_FOUND, "Token not found");
    }

    return token;
  },

  async createToken(
    userId: string,
    refreshToken: string,
    expiresAt: Date
  ): Promise<Token> {
    const requiredFields = ["userId", "refreshToken", "expiresAt"];
    for (let field of requiredFields) {
      if (!field) {
        throw new ApiError(HttpStatusCodes.BAD_REQUEST, `${field} is missing`);
      }
    }
    const token = await tokenClient.create({
      data: {
        userId,
        refreshToken,
        expirationDate: expiresAt,
      },
    });
    return token;
  },

  async deleteTokenByUserId(userId: string, refreshToken: string) {
    if (!userId) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing id");
    }
    if (!isValidUUID(userId)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "Id must be a valid UUID"
      );
    }
    await tokenClient.delete({
      where: {
        userId_refreshToken: {
          userId: userId,
          refreshToken: refreshToken,
        },
      },
    });
  },
};
