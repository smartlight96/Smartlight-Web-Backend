import mongoose, {
  Document,
  Schema,
} from "mongoose";

/* =====================================================
   JOB TYPES
===================================================== */

export type JobType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Remote";

/* =====================================================
   JOB STATUS
===================================================== */

export type JobStatus =
  | "active"
  | "closed"
  | "draft";

/* =====================================================
   JOB INTERFACE
===================================================== */

export interface IJob extends Document {
  title: string;
  department: string;
  location: string;

  type: JobType;

  experience: string;

  salary?: string;

  description: string;

  requirements: string[];

  responsibilities: string[];

  benefits: string[];

  /**
   * Optional application deadline.
   */
  deadline?: Date;

  status: JobStatus;

  createdAt: Date;
  updatedAt: Date;
}

/* =====================================================
   JOB SCHEMA
===================================================== */

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Remote",
      ],
      required: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    deadline: {
      type: Date,
      default: undefined,
    },

    status: {
      type: String,
      enum: [
        "active",
        "closed",
        "draft",
      ],
      default: "draft",
    },
  },

  {
    timestamps: true,
  }
);

/* =====================================================
   INDEXES
===================================================== */

JobSchema.index({
  status: 1,
  createdAt: -1,
});

JobSchema.index({
  department: 1,
});

JobSchema.index({
  location: 1,
});

/* =====================================================
   MODEL
===================================================== */

export default mongoose.model<IJob>(
  "Job",
  JobSchema
);