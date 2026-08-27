import { Schema, model, models, Document } from "mongoose";
import { Role } from "../types/auth";

export type AccountStatus =
  | "active"
  | "locked"
  | "suspended"
  | "deactivated";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone?: string;
  accountStatus: AccountStatus;
  accountStatusReason?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "USER",
        "ADMIN",
        "MANAGER",
        "ACCOUNTANT",
        "CONTENT_MANAGER",
        "CUSTOMER_CARE",
      ],
      default: "USER",
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      sparse: true,
    },

    accountStatus: {
      type: String,
      enum: [
        "active",
        "locked",
        "suspended",
        "deactivated",
      ],
      default: "active",
    },

    accountStatusReason: {
      type: String,
      default: "",
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User =
  models.User || model<IUser>("User", userSchema);