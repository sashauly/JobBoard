import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";

import Paths from "./constants/Paths";
import BaseRouter from "./routes/api.routes";
import errorHandler from "./middleware/errorHandler";
import HttpStatusCodes from "./constants/HttpStatusCodes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
    resave: false,
    saveUninitialized: false,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

app.use(Paths.Base, BaseRouter);

app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatusCodes.NOT_FOUND).json({
    status: HttpStatusCodes.NOT_FOUND,
    data: {
      error: "Not found",
    },
  });
});

export default app;
