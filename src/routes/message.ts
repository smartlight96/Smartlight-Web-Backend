import { Router, type Request, type Response } from "express";
import { ContactMessage } from "../models/ContactMessage";

const router = Router();

/**
 * POST /api/messages
 * Public contact form
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message:
          "Name, email, subject and message are required.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone
        ? String(phone).trim()
        : undefined,
      subject: String(subject).trim(),
      message: String(message).trim(),
      status: "NEW",
    });

    return res.status(201).json({
      message: "Message sent successfully.",
      contactMessage,
    });
  } catch (error) {
    console.error("CREATE MESSAGE ERROR:", error);

    return res.status(500).json({
      message: "Could not send your message.",
    });
  }
});

/**
 * GET /api/messages
 * Admin messages
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      messages,
      total: messages.length,
    });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);

    return res.status(500).json({
      message: "Could not load messages.",
    });
  }
});

/**
 * PATCH /api/messages/:id
 */
router.patch(
  "/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, reply } = req.body;

      const allowedStatuses = [
        "NEW",
        "READ",
        "REPLIED",
        "ARCHIVED",
      ];

      if (
        status &&
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message: "Invalid message status.",
        });
      }

      const update: Record<string, unknown> = {};

      if (status) {
        update.status = status;
      }

      if (reply !== undefined) {
        update.reply = String(reply).trim();
        update.status = "REPLIED";
        update.repliedAt = new Date();
      }

      const updated =
        await ContactMessage.findByIdAndUpdate(
          id,
          update,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updated) {
        return res.status(404).json({
          message: "Message not found.",
        });
      }

      return res.json({
        message: "Message updated successfully.",
        contactMessage: updated,
      });
    } catch (error) {
      console.error("UPDATE MESSAGE ERROR:", error);

      return res.status(500).json({
        message: "Could not update message.",
      });
    }
  }
);

/**
 * DELETE /api/messages/:id
 */
router.delete(
  "/:id",
  async (req: Request, res: Response) => {
    try {
      const deleted =
        await ContactMessage.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {
        return res.status(404).json({
          message: "Message not found.",
        });
      }

      return res.json({
        message: "Message deleted successfully.",
      });
    } catch (error) {
      console.error("DELETE MESSAGE ERROR:", error);

      return res.status(500).json({
        message: "Could not delete message.",
      });
    }
  }
);

export default router;