import { Request, Response } from "express";
import ContactMessage, { ContactMessageStatus } from "../models/ContactMessage";

const VALID_STATUSES: ContactMessageStatus[] = ["NEW", "READ", "REPLIED", "ARCHIVED"];

export async function createMessage(req: Request, res: Response) {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Name, email, subject and message are required." });
    }

    const created = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      subject: String(subject).trim(),
      message: String(message).trim(),
      status: "NEW",
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully. The SMARTLIGHT team will get back to you soon.",
      data: created,
    });
  } catch (error) {
    console.error("CREATE MESSAGE ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to send message." });
  }
}

export async function getMessages(_req: Request, res: Response) {
  try {
    const rawMessages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    const messages = rawMessages.map((item) => ({
      ...item,
      status: String(item.status).toUpperCase() as ContactMessageStatus,
    }));
    return res.json({ success: true, messages, total: messages.length });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load messages." });
  }
}

export async function getMessage(req: Request, res: Response) {
  try {
    const message = await ContactMessage.findById(req.params.id).lean();
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true, data: message });
  } catch (error) {
    console.error("GET MESSAGE ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load message." });
  }
}

export async function updateMessage(req: Request, res: Response) {
  try {
    const { status } = req.body as { status?: ContactMessageStatus };
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid message status." });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("UPDATE MESSAGE ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to update message." });
  }
}

export async function replyToMessage(req: Request, res: Response) {
  try {
    const reply = typeof req.body?.reply === "string" ? req.body.reply.trim() : "";
    if (!reply) return res.status(400).json({ success: false, message: "Reply message is required." });

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { reply, repliedAt: new Date(), status: "REPLIED" },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true, message: "Reply saved successfully.", data: updated });
  } catch (error) {
    console.error("REPLY MESSAGE ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to reply to message." });
  }
}

export async function deleteMessage(req: Request, res: Response) {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("DELETE MESSAGE ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to delete message." });
  }
}
