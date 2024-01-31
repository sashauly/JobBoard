import { Request, Response, NextFunction } from "express";

import HttpStatusCodes from "../constants/HttpStatusCodes";
import { ApiError } from "../classes/ApiError";
import { Prisma } from "@prisma/client";

function errorHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) {
  // if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
  //     logger.err(err, true);
  //   }
  let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  if (err instanceof ApiError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    message = err.message;
    if (err.code === "P2002") {
      status = HttpStatusCodes.CONFLICT;
      message = "Record Already Exists";
    } else if (err.code === "P2025") {
      status = HttpStatusCodes.NOT_FOUND;
      message = "Record Not Found";
    } else if (err.code === "P2016") {
      status = HttpStatusCodes.BAD_REQUEST;
      message = "Invalid Input";
    }
  }
  res.status(status).json({ status, message });
}

export default errorHandler;
