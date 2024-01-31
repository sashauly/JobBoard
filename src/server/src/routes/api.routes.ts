import { Router } from "express";

import Paths from "../constants/Paths";

import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import vacancyRouter from "./vacancy.routes";

const apiRouter = Router();

apiRouter.use(Paths.Auth.Base, authRouter);
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Vacancies.Base, vacancyRouter);

export default apiRouter;
