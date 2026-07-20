import jwt from "jsonwebtoken";
import { env } from "./env.js";

export interface AuthTokenPayload {
  sub: string;
  email: string;
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
