import { NextFunction, Request, Response } from "express";
import { validate as isValidUUID } from "uuid";

import HttpStatusCodes from "../constants/HttpStatusCodes";
import userService from "../services/user.service";
import { ApiError } from "../classes/ApiError";

export default {
  async getAllUsers(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res.status(HttpStatusCodes.OK).send({
        status: HttpStatusCodes.OK,
        message: "Users found",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing id");
    }
    if (!isValidUUID(id)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "Id must be a valid UUID"
      );
    }
    try {
      const user = await userService.getUserById(id);
      res.status(HttpStatusCodes.OK).send({
        status: HttpStatusCodes.OK,
        message: "User found",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, role } = req.body;
    const requiredFields = ["name", "email", "password", "role"];
    for (let field of requiredFields) {
      if (!field) {
        throw new ApiError(HttpStatusCodes.BAD_REQUEST, `${field} is missing`);
      }
    }
    try {
      const user = await userService.createUser(name, email, password, role);
      return res.status(HttpStatusCodes.CREATED).json({
        status: HttpStatusCodes.CREATED,
        message: "User created",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const updatedData = req.body;

    if (!id) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing id");
    }
    if (!isValidUUID(id)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "Id must be a valid UUID"
      );
    }
    try {
      const user = await userService.updateUser(id, updatedData);
      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "User updated",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing id");
    }
    if (!isValidUUID(id)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "Id must be a valid UUID"
      );
    }
    try {
      await userService.deleteUser(id);
      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "User deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};
