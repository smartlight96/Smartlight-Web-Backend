import mongoose, { Document, Model, Schema } from "mongoose";

export type ContactMessageStatus =
  | "NEW"
  | "READ"
  | "REPLIED"
  | "ARCHIVED";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactMessageStatus;
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true, default: "" },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["NEW", "READ", "REPLIED", "ARCHIVED"],
      default: "NEW",
      index: true,
    },
    reply: { type: String, trim: true, default: "" },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

export const ContactMessage =
  (mongoose.models.ContactMessage as Model<IContactMessage>) ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
