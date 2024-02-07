import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { ApiError } from "../classes/ApiError";

function ensureRole(requiredRole: Role) {
  return (req: Request, _: Response, next: NextFunction) => {
    if (req.session.user?.role !== requiredRole) {
      throw new ApiError(HttpStatusCodes.FORBIDDEN, "Access denied");
    }
    next();
  };
}

export default ensureRole;
