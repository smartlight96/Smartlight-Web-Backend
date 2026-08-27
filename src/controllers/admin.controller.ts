import { Response } from "express";
import { User } from "../models/User";
import { Service } from "../models/Service";
import { ServiceRequest, RequestStatus } from "../models/ServiceRequest";
import { ContactMessage } from "../models/ContactMessage";
import { AuthRequest } from "../types/auth";

export async function stats(_req: AuthRequest, res: Response) {
  const [users, services, requests, messages] = await Promise.all([
    User.countDocuments(),
    Service.countDocuments(),
    ServiceRequest.countDocuments(),
    ContactMessage.countDocuments(),
  ]);
  return res.json({ success: true, stats: { users, services, requests, messages } });
}

export async function users(_req: AuthRequest, res: Response) {
  const data = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
  return res.json({ success: true, users: data });
}

export async function updateUserStatus(req: AuthRequest, res: Response) {
  const allowed = ["active", "locked", "suspended", "deactivated"];
  if (!allowed.includes(req.body?.accountStatus)) return res.status(400).json({ message: "Invalid account status." });
  const user = await User.findByIdAndUpdate(req.params.id, { accountStatus: req.body.accountStatus }, { new: true, runValidators: true }).select("-passwordHash").lean();
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ success: true, user });
}

export async function updateUserRole(req: AuthRequest, res: Response) {
  const allowed = ["USER", "ADMIN", "MANAGER", "ACCOUNTANT", "CONTENT_MANAGER", "CUSTOMER_CARE"];
  if (!allowed.includes(req.body?.role)) return res.status(400).json({ message: "Invalid role." });
  if (String(req.user?.userId) === req.params.id && req.body.role !== "ADMIN") return res.status(400).json({ message: "You cannot remove your own administrator role." });
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true }).select("-passwordHash").lean();
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ success: true, user });
}

export async function verifyUser(req: AuthRequest, res: Response) {
  const user = await User.findByIdAndUpdate(req.params.id, { verified: true }, { new: true }).select("-passwordHash").lean();
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ success: true, user });
}

export async function requests(_req: AuthRequest, res: Response) {
  const data = await ServiceRequest.find().populate("userId", "name email").populate("serviceId", "name slug").sort({ createdAt: -1 }).lean();
  return res.json({ success: true, requests: data });
}

export async function updateRequest(req: AuthRequest, res: Response) {
  const statuses: RequestStatus[] = ["PENDING", "REVIEWING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  if (!statuses.includes(req.body?.status)) return res.status(400).json({ message: "Invalid request status." });
  const request = await ServiceRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }).populate("userId", "name email").populate("serviceId", "name slug").lean();
  if (!request) return res.status(404).json({ message: "Request not found." });
  return res.json({ success: true, request });
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function services(_req: AuthRequest, res: Response) {
  const data = await Service.find().sort({ featured: -1, createdAt: -1 }).lean();
  return res.json({ success: true, services: data });
}

export async function createService(req: AuthRequest, res: Response) {
  const { name, slug, category, description, priceFrom, active, featured } = req.body;
  if (!name || !category || !description) return res.status(400).json({ message: "Name, category and description are required." });
  const service = await Service.create({ name: String(name).trim(), slug: slugify(slug || name), category: String(category).trim(), description: String(description).trim(), priceFrom: priceFrom === "" || priceFrom == null ? undefined : Number(priceFrom), active: active !== false, featured: Boolean(featured) });
  return res.status(201).json({ success: true, service });
}

export async function updateService(req: AuthRequest, res: Response) {
  const payload = { ...req.body };
  if (payload.name && !payload.slug) payload.slug = slugify(payload.name);
  if (payload.priceFrom === "") payload.priceFrom = undefined;
  const service = await Service.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).lean();
  if (!service) return res.status(404).json({ message: "Service not found." });
  return res.json({ success: true, service });
}

export async function deleteService(req: AuthRequest, res: Response) {
  const service = await Service.findByIdAndUpdate(req.params.id, { active: false }, { new: true }).lean();
  if (!service) return res.status(404).json({ message: "Service not found." });
  return res.json({ success: true, service, message: "Service deactivated successfully." });
}
