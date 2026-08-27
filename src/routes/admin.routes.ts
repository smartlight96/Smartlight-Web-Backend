import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAdmin, requireAuth } from "../middleware/auth";
import {
  stats, users, updateUserStatus, updateUserRole, verifyUser,
  requests, updateRequest,
  services, createService, updateService, deleteService,
} from "../controllers/admin.controller";
import adminCareers from "./adminCareer";

const r = Router();
r.use(requireAuth, requireAdmin);

r.get("/stats", asyncHandler(stats));
r.get("/users", asyncHandler(users));
r.patch("/users/:id/status", asyncHandler(updateUserStatus));
r.patch("/users/:id/role", asyncHandler(updateUserRole));
r.patch("/users/:id/verify", asyncHandler(verifyUser));

r.get("/requests", asyncHandler(requests));
r.patch("/requests/:id", asyncHandler(updateRequest));

r.get("/services", asyncHandler(services));
r.post("/services", asyncHandler(createService));
r.patch("/services/:id", asyncHandler(updateService));
r.delete("/services/:id", asyncHandler(deleteService));

r.use("/careers", adminCareers);

export default r;
