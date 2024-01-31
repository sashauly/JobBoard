import { Router } from "express";
import vacancyController from "../controllers/vacancy.controller";

const vacancyRouter = Router();

vacancyRouter.get("/", vacancyController.getAllVacancies);
vacancyRouter.get("/:id", vacancyController.getVacancyById);
vacancyRouter.post("/", vacancyController.createVacancy);
vacancyRouter.put("/:id", vacancyController.updateVacancy);
vacancyRouter.patch("/:id", vacancyController.changeStatusVacancy);
vacancyRouter.delete("/:id", vacancyController.deleteVacancy);

export default vacancyRouter;
