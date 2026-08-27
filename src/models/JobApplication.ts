import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface IJobApplication
  extends Document {
  jobId: Types.ObjectId;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  coverLetter?: string;

  resume?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  };

  status: ApplicationStatus;

  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema =
  new Schema<IJobApplication>(
    {
      jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },

      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      coverLetter: {
        type: String,
        trim: true,
        default: "",
      },

      resume: {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "reviewing",
          "shortlisted",
          "rejected",
          "hired",
        ],
        default: "pending",
      },

      adminNotes: {
        type: String,
        default: "",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);