import { PrismaClient, User, Role } from "@prisma/client";
import { validate as isValidUUID } from "uuid";
import process from "process";
import bcrypt from "bcrypt";

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
      where: { uid: id },
      include: { vacancies: true, applications: true },
    });
    if (!user) {
      throw new ApiError(HttpStatusCodes.NOT_FOUND, "User not found");
    }
    return user;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await userClient.findUnique({
      where: { email },
      include: { vacancies: true, applications: true },
    });
    return user;
  },

  async createUser(name: string, email: string, password: string, role: Role) {
    const requiredFields = ["name", "email", "password", "role"];
    for (let field of requiredFields) {
      if (!field) {
        throw new ApiError(HttpStatusCodes.BAD_REQUEST, `${field} is missing`);
      }
    }
    const user = await userClient.create({
      data: { name, email, password, role },
    });
    return user;
  },

  async updateUser(id: string, updatedData: Partial<User>) {
    if (!id) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing id");
    }
    if (!isValidUUID(id)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "Id must be a valid UUID"
      );
    }
    const result = await userClient.update({
      where: { uid: id },
      data: updatedData,
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
      where: { uid: id },
    });
    return result;
  },
};
