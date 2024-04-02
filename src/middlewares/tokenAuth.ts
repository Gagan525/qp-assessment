import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimStart();
    }

    const verified = jwt.verify(token, process.env.SECRET as string);
    (req as any).user = verified;
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default verifyToken;
