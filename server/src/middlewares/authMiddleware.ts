// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/PrismaClient";

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
       // console.log(req.cookies.token)
      // console.log(5)
      // console.log(req.cookies.token)
      const token = req.cookies.token; 
      // console.log(token)
    if (!token) return res.status(401).json({ message: " Not authorized, no token" });
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: Number(decoded.id) } });
    if (!user) return res.status(401).json({ message: "User not found" });

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// middleware/authMiddleware.ts (continue)
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (user && user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden - Admins only" });
 }
}