import { Router } from "express";
import { subscribe,getSubscribers,removeSubscriber } from "../controllers/newsletter.controller";
import { requireAuth,requireAdmin } from "../middleware/auth";
const r=Router();r.post("/",subscribe);r.get("/",requireAuth,requireAdmin,getSubscribers);r.delete("/:id",requireAuth,requireAdmin,removeSubscriber);export default r;
