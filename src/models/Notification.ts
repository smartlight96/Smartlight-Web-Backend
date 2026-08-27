import mongoose, { Document, Schema } from "mongoose";

export type NotificationType =
  | "MESSAGE"
  | "REQUEST"
  | "USER"
  | "REVIEW"
  | "SYSTEM";

export interface INotification extends Document {
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "MESSAGE",
        "REQUEST",
        "USER",
        "REVIEW",
        "SYSTEM",
      ],
      default: "SYSTEM",
    },

    link: {
      type: String,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ read: 1, createdAt: -1 });

export const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>(
    "Notification",
    notificationSchema
  );

export default Notification;