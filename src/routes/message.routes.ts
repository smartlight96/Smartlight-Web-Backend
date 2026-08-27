import { Router } from "express";
import { createMessage, getMessages, getMessage, updateMessage, replyToMessage, deleteMessage } from "../controllers/message.controller";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// Public contact form.
router.post("/", createMessage);

// Everything below this point is administrator-only.
router.use(requireAuth, requireAdmin);
router.get("/", getMessages);
router.get("/:id", getMessage);
router.patch("/:id", updateMessage);
router.post("/:id/reply", replyToMessage);
router.delete("/:id", deleteMessage);

export default router;
