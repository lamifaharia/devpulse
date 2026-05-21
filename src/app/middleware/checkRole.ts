import { NextFunction, Response } from "express";

const checkRole = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // Double-check if the authenticated user has one of the allowed roles
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to perform this action",
      });
    }

    next();
  };
};

export default checkRole;