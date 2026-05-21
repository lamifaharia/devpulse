import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const auth = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  // Reject immediately if no token is found in the headers
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing token",
    });
  }

  try {
    // Verify the token signature using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "my_super_secret_devpulse_key_12345");
    
    // Attach decoded user data (id, name, role) directly to the request object
    req.user = decoded;
    
    // Pass control cleanly to the next step
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export default auth;