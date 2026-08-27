import { Response, NextFunction } from "express";
import { AuthRequest, Role } from "../types/auth";
import { env } from "../config/env";
import { verifyToken } from "../utils/auth";
export function requireAuth(req:AuthRequest,res:Response,next:NextFunction){const cookieToken=req.cookies?.[env.COOKIE_NAME];const auth=req.headers.authorization;const bearer=auth?.startsWith("Bearer ")?auth.slice(7):undefined;const token=cookieToken||bearer;if(!token)return res.status(401).json({message:"Authentication required."});try{req.user=verifyToken(token);next();}catch{return res.status(401).json({message:"Session expired. Please log in again."});}}
export function requireRoles(...roles:Role[]){return (req:AuthRequest,res:Response,next:NextFunction)=>{if(!req.user||!roles.includes(req.user.role))return res.status(403).json({message:"You do not have permission to perform this action."});next();};}
export const requireAdmin=requireRoles("ADMIN");
