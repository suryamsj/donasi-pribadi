import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  username: string;
}

export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
