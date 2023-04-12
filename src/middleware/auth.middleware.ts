import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TokenPayloadDto from "src/DTO/tokenPayload.dto";

export const authMiddleware = (req: Request & {user: TokenPayloadDto}, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({message:"user not authenticated"});
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload as TokenPayloadDto;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token de autenticación inválido" });
  }
};
