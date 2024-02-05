import { NextFunction, Request, Response } from "express";

import HttpStatusCodes from "../constants/HttpStatusCodes";
import authService from "../services/auth.service";
import { ApiError } from "../classes/ApiError";
import userService from "../services/user.service";
import authUtils from "../utils/auth";
import Paths from "../constants/Paths";

const accessTokenExpiresIn = Number(
  eval(process.env.ACCESS_EXPIRES || "15 * 60 * 1000")
);
const refreshTokenExpiresIn = Number(
  eval(process.env.REFRESH_EXPIRES || "7 * 24 * 60 * 60 * 1000")
);

export default {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const user = await authService.register(name, email, password, role);
      return res.status(HttpStatusCodes.CREATED).json(user);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(
          HttpStatusCodes.BAD_REQUEST,
          "Missing email or password"
        );
      }
      const user = await userService.getUserByEmail(email);
      if (!user) {
        throw new ApiError(HttpStatusCodes.NOT_FOUND, "User not found");
      }
      const isPasswordValid = await authUtils.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        throw new ApiError(HttpStatusCodes.UNAUTHORIZED, "Invalid password");
      }
      const { accessToken, refreshToken } = await authService.login(
        user.uid,
        refreshTokenExpiresIn
      );
      console.log("🚀 ~ login ~ accessToken:", accessToken);
      console.log("🚀 ~ login ~ refreshToken:", refreshToken);

      res.set("Authorization", `Bearer ${accessToken}`);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: accessTokenExpiresIn,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: Paths.Base + Paths.Auth.Base + Paths.Auth.Refresh,
        maxAge: refreshTokenExpiresIn,
      });
      return res.status(HttpStatusCodes.OK).end();
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new ApiError(
          HttpStatusCodes.BAD_REQUEST,
          "Missing refresh token"
        );
      }
      await authService.logout(refreshToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(HttpStatusCodes.OK).end();
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const newAccessToken = await authService.refresh(refreshToken);
      res.clearCookie("accessToken");
      // res.cookie("accessToken", newAccessToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   maxAge: accessTokenExpiresIn,
      // });
      res.set("Authorization", `Bearer ${newAccessToken}`);

      return res.status(HttpStatusCodes.OK).end();
    } catch (error) {
      next(error);
    }
  },
};
