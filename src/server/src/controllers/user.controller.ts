import { NextFunction, Request, Response } from "express";

import HttpStatusCodes from "../constants/HttpStatusCodes";
import userService from "../services/user.service";

export default {
  async getAllUsers(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res.status(HttpStatusCodes.OK).json({ users });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(HttpStatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, username, password, role } = req.body;
      await userService.createUser(name, username, password, role);
      return res.status(HttpStatusCodes.CREATED).end();
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      await userService.updateUser(id, updatedData);
      return res.status(HttpStatusCodes.OK).end();
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      return res.status(HttpStatusCodes.OK).end();
    } catch (error) {
      next(error);
    }
  },
};
