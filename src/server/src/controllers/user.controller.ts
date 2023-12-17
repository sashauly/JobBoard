import { PrismaClient } from '@prisma/client';

import { Request, Response } from 'express';

const userClient = new PrismaClient().user;

export default {
  async getAllUsers(req: Request, res: Response) {
    const users = await userClient.findMany({
      include: { vacancies: true, applications: true },
    });
    res.json(users).status(200);
  },

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userClient.findUnique({
      where: { id },
      include: { vacancies: true, applications: true },
    });
    res.json(user).status(200);
  },

  async createUser(req: Request, res: Response) {
    const { name, username, password, role } = req.body;
    const result = await userClient.create({
      data: { name, username, password, role },
    });
    res.json(result).status(200);
  },
};
