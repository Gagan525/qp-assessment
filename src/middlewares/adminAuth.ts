import { Request, Response, NextFunction } from "express";

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(req as any).user.isAdmin) {
      throw new Error("User is not an Admin");
    }
    next();
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export default adminAuth;
