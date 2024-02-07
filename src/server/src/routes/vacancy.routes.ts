import { Router } from "express";
import vacancyController from "../controllers/vacancy.controller";
import ensureRole from "../middleware/ensureRole";
import { Role } from "@prisma/client";

const vacancyRouter = Router();

vacancyRouter.get("/", vacancyController.getAllVacancies);
vacancyRouter.get("/:id", vacancyController.getVacancyById);
vacancyRouter.post(
  "/",
  ensureRole(Role.EMPLOYER),
  vacancyController.createVacancy
);
vacancyRouter.put(
  "/:id",
  ensureRole(Role.EMPLOYER),
  vacancyController.updateVacancy
);
vacancyRouter.patch(
  "/:id",
  ensureRole(Role.EMPLOYER),
  vacancyController.changeStatusVacancy
);
vacancyRouter.delete(
  "/:id",
  ensureRole(Role.EMPLOYER),
  vacancyController.deleteVacancy
);

export default vacancyRouter;
