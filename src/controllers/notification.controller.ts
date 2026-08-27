import { Request, Response } from "express";
import Notification from "../models/Notification";

/**
 * GET /api/admin/notifications
 *
 * Get notifications for admin.
 */
export async function getNotifications(
  _req: Request,
  res: Response
) {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const unreadCount = await Notification.countDocuments({
      read: false,
    });

    return res.status(200).json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load notifications.",
    });
  }
}

/**
 * GET /api/admin/notifications/unread-count
 */
export async function getUnreadNotificationCount(
  _req: Request,
  res: Response
) {
  try {
    const unreadCount =
      await Notification.countDocuments({
        read: false,
      });

    return res.status(200).json({
      unreadCount,
    });
  } catch (error) {
    console.error(
      "GET UNREAD NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load notification count.",
    });
  }
}

/**
 * PATCH /api/admin/notifications/:id/read
 */
export async function markNotificationAsRead(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findByIdAndUpdate(
        id,
        {
          read: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to update notification.",
    });
  }
}

/**
 * PATCH /api/admin/notifications/read-all
 */
export async function markAllNotificationsAsRead(
  _req: Request,
  res: Response
) {
  try {
    await Notification.updateMany(
      {
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error(
      "MARK ALL NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to mark notifications as read.",
    });
  }
}

/**
 * DELETE /api/admin/notifications/:id
 */
export async function deleteNotification(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE NOTIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to delete notification.",
    });
  }
}