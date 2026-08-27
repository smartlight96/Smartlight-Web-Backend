import mongoose, { Document, Model, Schema } from "mongoose";

export type MessageStatus =
  | "NEW"
  | "READ"
  | "REPLIED"
  | "ARCHIVED";

export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: ["NEW", "READ", "REPLIED", "ARCHIVED"],
      default: "NEW",
      index: true,
    },

    reply: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ createdAt: -1 });
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ email: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Message", messageSchema);

export default Message;