import { PrismaClient } from '@prisma/client';

import { Request, Response } from 'express';

const vacancyClient = new PrismaClient().vacancy;

export default {
  async getAllVacancies(req: Request, res: Response) {
    const vacancies = await vacancyClient.findMany({
      include: { employer: true, Application: true },
    });
    res.json(vacancies).status(200);
  },

  async getVacancyById(req: Request, res: Response) {
    const { id } = req.params;
    const vacancy = await vacancyClient.findUnique({
      where: { id },
      include: { employer: true, Application: true },
    });
    res.json(vacancy).status(200);
  },

  async createVacancy(req: Request, res: Response) {
    const {
      title,
      description,
      englishLevel,
      grade,
      tags,
      isActive,
      employerId,
    } = req.body;
    const result = await vacancyClient.create({
      data: {
        title,
        description,
        englishLevel,
        grade,
        tags,
        isActive,
        employer: { connect: { id: employerId } },
      },
    });
    res.json(result).status(200);
  },

  async updateVacancy(req: Request, res: Response) {
    const { id } = req.params;
    const {
      title,
      description,
      englishLevel,
      grade,
      tags,
      isActive,
      employerId,
    } = req.body;
    const result = await vacancyClient.update({
      where: { id },
      data: {
        title,
        description,
        englishLevel,
        grade,
        tags,
        isActive,
        employer: { connect: { id: employerId } },
      },
    });
    res.json(result).status(200);
  },

  async changeStatusVacancy(req: Request, res: Response) {
    const { id, isActive } = req.params;
    const result = await vacancyClient.update({
      where: { id },
      data: { isActive: isActive === 'true' },
    });
    res.json(result).status(200);
  },

  async deleteVacancy(req: Request, res: Response) {
    const { id } = req.params;
    const result = await vacancyClient.delete({ where: { id } });
    res.json(result).status(200);
  },
};
