import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import Paths from "./constants/Paths";
import BaseRouter from "./routes/api.routes";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(Paths.Base, BaseRouter);

app.use(errorHandler);

export default app;
