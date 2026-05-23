import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const auth = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "my_super_secret_devpulse_key_12345");
    
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export default auth;