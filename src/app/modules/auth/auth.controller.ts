import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signupUser(req.body);
  sendResponse(res, 201, true, "User registered successfully", result);
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  sendResponse(res, 200, true, "Login successful", result);
});

export const AuthController = {
  signup,
  login,
};