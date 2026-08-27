import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { AuthUser } from "../types/auth";
export function signToken(payload: AuthUser){return jwt.sign(payload,env.JWT_SECRET,{expiresIn:"7d"});}
export function verifyToken(token:string):AuthUser{return jwt.verify(token,env.JWT_SECRET) as AuthUser;}
