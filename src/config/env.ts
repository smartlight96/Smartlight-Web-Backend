import "dotenv/config";
import { z } from "zod";
export const env=z.object({PORT:z.coerce.number().default(5000),NODE_ENV:z.enum(["development","production","test"]).default("development"),MONGODB_URI:z.string().min(1),JWT_SECRET:z.string().min(32),CLIENT_URL:z.string().url(),COOKIE_NAME:z.string().default("smartlight_token"),GOOGLE_CLIENT_ID:z.string().optional()}).parse(process.env);
