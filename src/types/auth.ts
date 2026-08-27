import { Request } from "express";
export type Role="USER"|"ADMIN"|"MANAGER"|"ACCOUNTANT"|"CONTENT_MANAGER"|"CUSTOMER_CARE";
export type AuthUser={userId:string;role:Role};
export interface AuthRequest extends Request{user?:AuthUser}
