import { Response } from "express";
import fs from "fs";
import { Types } from "mongoose";

import { AuthRequest } from "../types/auth";
import Job from "../models/Job";
import JobApplication from "../models/JobApplication";

export async function createJob(
  req: AuthRequest,
  res: Response
) {
  const job = await Job.create(req.body);

  res.status(201).json({
    job,
  });
}

export async function getAdminJobs(
  _req: AuthRequest,
  res: Response
) {
  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    jobs,
  });
}

export async function getAdminJob(
  req: AuthRequest,
  res: Response
) {
  const job = await Job.findById(
    req.params.id
  ).lean();

  if (!job) {
    return res.status(404).json({
      message: "Job not found.",
    });
  }

  res.json({
    job,
  });
}

export async function updateJob(
  req: AuthRequest,
  res: Response
) {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    return res.status(404).json({
      message: "Job not found.",
    });
  }

  res.json({
    job,
  });
}

export async function deleteJob(
  req: AuthRequest,
  res: Response
) {
  const job = await Job.findByIdAndDelete(
    req.params.id
  );

  if (!job) {
    return res.status(404).json({
      message: "Job not found.",
    });
  }

  res.json({
    message: "Job deleted successfully.",
  });
}

export async function getApplications(
  req: AuthRequest,
  res: Response
) {
  const filter: Record<string, unknown> = {};

  if (req.query.jobId) {
    filter.jobId = req.query.jobId;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const applications =
    await JobApplication.find(filter)
      .populate(
        "jobId",
        "title department location"
      )
      .select("-resume.path")
      .sort({ createdAt: -1 })
      .lean();

  res.json({
    applications,
  });
}

export async function getApplication(
  req: AuthRequest,
  res: Response
) {
  const application =
    await JobApplication.findById(
      req.params.id
    )
      .populate(
        "jobId",
        "title department location type"
      )
      .select("-resume.path")
      .lean();

  if (!application) {
    return res.status(404).json({
      message: "Application not found.",
    });
  }

  res.json({
    application,
  });
}

export async function downloadResume(
  req: AuthRequest,
  res: Response
) {
  const application =
    await JobApplication.findById(
      req.params.id
    );

  if (!application?.resume) {
    return res.status(404).json({
      message: "Resume not found.",
    });
  }

  const resumePath = application.resume.path;

  if (!resumePath || !fs.existsSync(resumePath)) {
    return res.status(404).json({
      message: "Resume file not found on server.",
    });
  }

  res.setHeader(
    "Content-Type",
    application.resume.mimetype
  );

  return res.download(
    resumePath,
    application.resume.originalName,
    (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({
          message: "Failed to download resume.",
        });
      }
    }
  );
}

export async function updateApplicationStatus(
  req: AuthRequest,
  res: Response
) {
  const {
    status,
    adminNotes,
  } = req.body;

  const allowedStatuses = [
    "pending",
    "reviewing",
    "shortlisted",
    "rejected",
    "hired",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid application status.",
    });
  }

  const application =
    await JobApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(adminNotes !== undefined
          ? { adminNotes }
          : {}),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "jobId",
        "title department location"
      )
      .select("-resume.path");

  if (!application) {
    return res.status(404).json({
      message: "Application not found.",
    });
  }

  res.json({
    application,
  });
}

export async function careerStats(
  _req: AuthRequest,
  res: Response
) {
  const [
    totalJobs,
    activeJobs,
    totalApplications,
    pendingApplications,
    shortlistedApplications,
    hiredApplications,
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({
      status: "active",
    }),
    JobApplication.countDocuments(),
    JobApplication.countDocuments({
      status: "pending",
    }),
    JobApplication.countDocuments({
      status: "shortlisted",
    }),
    JobApplication.countDocuments({
      status: "hired",
    }),
  ]);

  res.json({
    stats: {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      hiredApplications,
    },
  });
}