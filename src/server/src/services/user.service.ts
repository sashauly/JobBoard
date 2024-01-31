import { PrismaClient, User, Role } from "@prisma/client";
import { validate as isValidUUID } from "uuid";

import { ApiError } from "../classes/ApiError";
import HttpStatusCodes from "../constants/HttpStatusCodes";

const userClient = new PrismaClient().user;

export default {
  async getAllUsers(): Promise<User[]> {
    const users = await userClient.findMany({
      include: { vacancies: true, applications: true },
    });
    return users;
  },

  async getUserById(id: string): Promise<User | null> {
    if (!id) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing id");
    }
    if (!isValidUUID(id)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "Id must be a valid UUID"
      );
    }
    const user = await userClient.findUnique({
      where: { id },
      include: { vacancies: true, applications: true },
    });
    if (!user) {
      throw new ApiError(HttpStatusCodes.NOT_FOUND, "User not found");
    }
    return user;
  },

  async createUser(
    name: string,
    username: string,
    password: string,
    role: Role
  ) {
    const requiredFields = ["name", "username", "password", "role"];
    for (let field of requiredFields) {
      if (!field) {
        throw new ApiError(HttpStatusCodes.BAD_REQUEST, `${field} is missing`);
      }
    }
    const result = await userClient.create({
      data: { name, username, password, role },
    });
    return result;
  },

  async updateUser(
    id: string,
    name: string,
    username: string,
    password: string
  ) {
    if (!id) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing id");
    }
    if (!isValidUUID(id)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "Id must be a valid UUID"
      );
    }
    const requiredFields = ["name", "username", "password"];
    for (let field of requiredFields) {
      if (!field) {
        throw new ApiError(HttpStatusCodes.BAD_REQUEST, `${field} is missing`);
      }
    }
    const result = await userClient.update({
      where: { id },
      data: { name, username, password },
    });
    return result;
  },

  async deleteUser(id: string) {
    if (!id) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing id");
    }
    if (!isValidUUID(id)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "Id must be a valid UUID"
      );
    }
    const result = await userClient.delete({
      where: { id },
    });
    return result;
  },
};