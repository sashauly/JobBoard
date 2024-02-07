import { validate as isValidUUID } from "uuid";
import { NextFunction, Request, Response } from "express";

import vacancyService from "../services/vacancy.service";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { ApiError } from "../classes/ApiError";

export default {
  async getAllVacancies(_: Request, res: Response, next: NextFunction) {
    try {
      const vacancies = await vacancyService.getAllVacancies();
      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "Vacancies found",
        data: vacancies,
      });
    } catch (error) {
      next(error);
    }
  },

  async getVacancyById(req: Request, res: Response, next: NextFunction) {
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
      const vacancy = await vacancyService.getVacancyById(id);
      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "Vacancy found",
        data: vacancy,
      });
    } catch (error) {
      next(error);
    }
  },

  async createVacancy(req: Request, res: Response, next: NextFunction) {
    const {
      title,
      description,
      englishLevel,
      grade,
      tags,
      isActive,
      employerId,
    } = req.body;

    const requiredFields = ["title", "description", "employeeId"];
    for (let field of requiredFields) {
      if (!field) {
        throw new ApiError(HttpStatusCodes.BAD_REQUEST, `${field} is missing`);
      }
    }

    try {
      const result = await vacancyService.createVacancy(
        title,
        description,
        englishLevel,
        grade,
        tags,
        isActive,
        employerId
      );
      return res.status(HttpStatusCodes.CREATED).json({
        status: HttpStatusCodes.CREATED,
        message: "Vacancy created",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateVacancy(req: Request, res: Response, next: NextFunction) {
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
      const result = await vacancyService.updateVacancy(id, updatedData);
      res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "Vacancy updated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async changeStatusVacancy(req: Request, res: Response, next: NextFunction) {
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
      const candidate = await vacancyService.getVacancyById(id);
      const currentStatus = candidate?.isActive;
      const result = await vacancyService.updateVacancy(id, {
        isActive: !currentStatus,
      });
      res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "Vacancy updated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteVacancy(req: Request, res: Response, next: NextFunction) {
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
      await vacancyService.deleteVacancy(id);
      res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "Vacancy deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};
