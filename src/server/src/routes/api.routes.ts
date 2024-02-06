import { Router } from "express";

import Paths from "../constants/Paths";

import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import vacancyRouter from "./vacancy.routes";
import checkAuth from "../middleware/checkAuth";

const apiRouter = Router();

apiRouter.use(Paths.Auth.Base, authRouter);
apiRouter.use(Paths.Users.Base, checkAuth, userRouter);
apiRouter.use(Paths.Vacancies.Base, checkAuth, vacancyRouter);

export default apiRouter;
