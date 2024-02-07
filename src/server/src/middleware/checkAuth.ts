import authUtils from "../utils/auth";
import { ApiError } from "../classes/ApiError";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { Request, Response, NextFunction } from "express";

function checkAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new ApiError(
      HttpStatusCodes.UNAUTHORIZED,
      "No authorization header provided"
    );
  }
  const accessToken = authHeader?.split(" ")[1];
  // const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new ApiError(
      HttpStatusCodes.UNAUTHORIZED,
      "No access token provided"
    );
  }

  try {
    const user = authUtils.verifyAccessToken(accessToken);
    res.locals.user = user;
    next();
  } catch (err) {
    delete req.headers["authorization"];
    throw new ApiError(
      HttpStatusCodes.UNAUTHORIZED,
      err as string || "Access token invalid, need to get a new one"
    );
  }
}

export default checkAuth;
