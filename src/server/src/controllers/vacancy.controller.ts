import { validate as isValidUUID } from "uuid";
import { NextFunction, Request, Response } from "express";

import vacancyService from "../services/vacancy.service";
import HttpStatusCodes from "../constants/HttpStatusCodes";

export default {
  async getAllVacancies(_: Request, res: Response, next: NextFunction) {
    try {
      const vacancies = await vacancyService.getAllVacancies();
      return res.status(HttpStatusCodes.OK).json({ vacancies });
    } catch (error) {
      next(error);
    }
  },

  async getVacancyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vacancy = await vacancyService.getVacancyById(id);
      return res.status(HttpStatusCodes.OK).json(vacancy);
    } catch (error) {
      next(error);
    }
  },

  async createVacancy(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        description,
        englishLevel,
        grade,
        tags,
        isActive,
        employerId,
      } = req.body;
      const result = await vacancyService.createVacancy(
        title,
        description,
        englishLevel,
        grade,
        tags,
        isActive,
        employerId
      );
      return res.status(HttpStatusCodes.CREATED).end();
    } catch (error) {
      next(error);
    }
  },

  async updateVacancy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      /**
     * {
      title,
      description,
      englishLevel,
      grade,
      tags,
      isActive,
      employerId,
    }
     */
      const updatedData = req.body;
      const result = await vacancyService.updateVacancy(id, updatedData);
      res.status(HttpStatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },

  async changeStatusVacancy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, isActive } = req.params;
      const result = await vacancyService.updateVacancy(id, {
        isActive: JSON.parse(isActive),
      });
      res.status(HttpStatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteVacancy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await vacancyService.deleteVacancy(id);
      res.status(HttpStatusCodes.OK).end();
    } catch (error) {
      next(error);
    }
  },
};
