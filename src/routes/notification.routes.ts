import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controller";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", getNotifications);

router.get(
  "/unread-count",
  getUnreadNotificationCount
);

router.patch(
  "/read-all",
  markAllNotificationsAsRead
);

router.patch(
  "/:id/read",
  markNotificationAsRead
);

router.delete(
  "/:id",
  deleteNotification
);

export default router;