import { NextFunction, Request, Response } from "express";

import HttpStatusCodes from "../constants/HttpStatusCodes";
import authService from "../services/auth.service";
import { ApiError } from "../classes/ApiError";
import userService from "../services/user.service";
import authUtils from "../utils/auth";
import { User } from "@prisma/client";

import "express-session";

declare module "express-session" {
  interface SessionData {
    user: User;
    refreshToken: string;
  }
}

const accessTokenExpiresIn = Number(
  eval(process.env.ACCESS_EXP || "15 * 60 * 1000")
);
const refreshTokenExpiresIn = Number(
  eval(process.env.REFRESH_EXP || "7 * 24 * 60 * 60 * 1000")
);

export default {
  async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, role } = req.body;

    const requiredFields = ["name", "email", "password", "role"];
    for (let field of requiredFields) {
      if (!field) {
        throw new ApiError(HttpStatusCodes.BAD_REQUEST, `${field} is missing`);
      }
    }

    try {
      const user = await authService.register(name, email, password, role);
      return res.status(HttpStatusCodes.CREATED).json({
        status: HttpStatusCodes.CREATED,
        message: `User ${user.email} successfully registered`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing email or password")
      );
    }
    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return next(new ApiError(HttpStatusCodes.NOT_FOUND, "User not found"));
      }
      const isPasswordValid = await authUtils.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return next(
          new ApiError(HttpStatusCodes.UNAUTHORIZED, "Invalid password")
        );
      }
      const { accessToken, refreshToken } = await authService.login(
        user.uid,
        refreshTokenExpiresIn
      );

      res.set("Authorization", `Bearer ${accessToken}`);

      // res.cookie("accessToken", accessToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   maxAge: accessTokenExpiresIn,
      // });
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   path: Paths.Base + Paths.Auth.Base + Paths.Auth.Refresh,
      //   maxAge: refreshTokenExpiresIn,
      // });

      req.session.user = user;
      req.session.refreshToken = refreshToken;

      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "User logged in",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.session;
    if (!refreshToken) {
      return next(
        new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing refresh token")
      );
    }
    const { uid } = req.session.user || {};
    try {
      await authService.logout(uid as string, refreshToken);
      // res.clearCookie("accessToken");
      // res.clearCookie("refreshToken");
      req.session.destroy((error) => {
        if (error) {
          next(error);
        }
      });
      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "User logged out",
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.session;
    if (!refreshToken) {
      return next(
        new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing refresh token")
      );
    }
    try {
      const newAccessToken = await authService.refresh(refreshToken);
      // res.clearCookie("accessToken");
      // res.cookie("accessToken", newAccessToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   maxAge: accessTokenExpiresIn,
      // });
      res.set("Authorization", `Bearer ${newAccessToken}`);

      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "Token refreshed",
      });
    } catch (error) {
      next(error);
    }
  },
};
