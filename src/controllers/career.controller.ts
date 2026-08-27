import {
  Request,
  Response,
} from "express";

import fs from "fs";

import Job from "../models/Job";
import JobApplication from "../models/JobApplication";

/* =====================================================
   PUBLIC — GET ALL JOBS
===================================================== */

export async function getPublicJobs(
  _req: Request,
  res: Response
) {
  try {
    const jobs = await Job.find({
      $or: [
        { status: "active" },
        { isPublished: true },
      ],
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      jobs,
    });
  } catch (error) {
    console.error(
      "GET PUBLIC JOBS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load vacancies.",
    });
  }
}

/* =====================================================
   PUBLIC — GET SINGLE JOB
===================================================== */

export async function getPublicJob(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Job ID is required.",
      });
    }

    const job = await Job.findOne({
      _id: id,
      $or: [
        { status: "active" },
        { isPublished: true },
      ],
    }).lean();

    if (!job) {
      return res.status(404).json({
        message:
          "Vacancy not found.",
      });
    }

    return res.status(200).json({
      job,
    });
  } catch (error) {
    console.error(
      "GET PUBLIC JOB ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load vacancy.",
    });
  }
}

/* =====================================================
   PUBLIC — SUBMIT APPLICATION
===================================================== */

export async function submitApplication(
  req: Request,
  res: Response
) {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "SUBMIT APPLICATION REQUEST"
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "FILE:",
      req.file
        ? {
            fieldname:
              req.file.fieldname,
            originalname:
              req.file.originalname,
            filename:
              req.file.filename,
            mimetype:
              req.file.mimetype,
            size:
              req.file.size,
            path:
              req.file.path,
          }
        : "NO FILE"
    );

    console.log(
      "===================================="
    );

    const {
      jobId,
      firstName,
      lastName,
      email,
      phone,
      coverLetter,
    } = req.body;

    /* -------------------------------------------------
       VALIDATE JOB ID
    ------------------------------------------------- */

    if (
      !jobId ||
      typeof jobId !== "string" ||
      !jobId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Job ID is required.",
      });
    }

    /* -------------------------------------------------
       VALIDATE PERSONAL INFORMATION
    ------------------------------------------------- */

    if (
      !firstName ||
      typeof firstName !== "string" ||
      !firstName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name is required.",
      });
    }

    if (
      !lastName ||
      typeof lastName !== "string" ||
      !lastName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Last name is required.",
      });
    }

    if (
      !email ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email address is required.",
      });
    }

    if (
      !phone ||
      typeof phone !== "string" ||
      !phone.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number is required.",
      });
    }

    /* -------------------------------------------------
       VALIDATE RESUME
    ------------------------------------------------- */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload your resume.",
      });
    }

    /* -------------------------------------------------
       FIND JOB
    ------------------------------------------------- */

    const job = await Job.findOne({
      _id: jobId.trim(),
      $or: [
        { status: "active" },
        { isPublished: true },
      ],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "This vacancy is no longer available.",
      });
    }

    /* -------------------------------------------------
       CHECK DEADLINE
    ------------------------------------------------- */

    if (
      job.deadline &&
      new Date(job.deadline).getTime() <
        Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The application deadline for this vacancy has passed.",
      });
    }

    /* -------------------------------------------------
       NORMALIZE EMAIL
    ------------------------------------------------- */

    const normalizedEmail =
      email.trim().toLowerCase();

    /* -------------------------------------------------
       CHECK DUPLICATE APPLICATION
    ------------------------------------------------- */

    const existingApplication =
      await JobApplication.findOne({
        jobId: job._id,
        email: normalizedEmail,
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied for this position.",
      });
    }

    /* -------------------------------------------------
       CREATE APPLICATION
    ------------------------------------------------- */

    const application =
      await JobApplication.create({
        jobId: job._id,

        firstName:
          firstName.trim(),

        lastName:
          lastName.trim(),

        email:
          normalizedEmail,

        phone:
          phone.trim(),

        coverLetter:
          typeof coverLetter === "string"
            ? coverLetter.trim()
            : "",

        resume: {
          filename:
            req.file.filename,

          originalName:
            req.file.originalname,

          mimetype:
            req.file.mimetype,

          size:
            req.file.size,

          path:
            req.file.path,
        },

        status: "pending",
      });

    console.log(
      "APPLICATION CREATED:",
      application._id
    );

    /* -------------------------------------------------
       SUCCESS
    ------------------------------------------------- */

    return res.status(201).json({
      success: true,

      message:
        "Application submitted successfully.",

      application: {
        _id:
          application._id,

        jobId:
          application.jobId,

        firstName:
          application.firstName,

        lastName:
          application.lastName,

        email:
          application.email,

        phone:
          application.phone,

        status:
          application.status,

        createdAt:
          application.createdAt,
      },

      applicationId:
        application._id,
    });
  } catch (error: any) {
    console.error(
      "SUBMIT APPLICATION ERROR:",
      error
    );

    /* -------------------------------------------------
       DUPLICATE KEY ERROR
    ------------------------------------------------- */

    if (
      error?.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied for this position.",
      });
    }

    /* -------------------------------------------------
       MONGOOSE VALIDATION ERROR
    ------------------------------------------------- */

    if (
      error?.name ===
      "ValidationError"
    ) {
      const details =
        Object.values(
          error.errors || {}
        )
          .map(
            (item: any) =>
              item.message
          )
          .join(", ");

      return res.status(400).json({
        success: false,
        message:
          "Application validation failed.",
        details,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit application.",
      details:
        process.env.NODE_ENV ===
        "development"
          ? error?.message
          : undefined,
    });
  }
}

/* =====================================================
   ADMIN — GET ALL JOBS
===================================================== */

export async function getAdminJobs(
  _req: Request,
  res: Response
) {
  try {
    const jobs =
      await Job.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      jobs,
    });
  } catch (error) {
    console.error(
      "GET ADMIN JOBS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load vacancies.",
    });
  }
}

/* =====================================================
   ADMIN — GET SINGLE JOB
===================================================== */

export async function getAdminJob(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message:
          "Job ID is required.",
      });
    }

    const job =
      await Job.findById(id).lean();

    if (!job) {
      return res.status(404).json({
        message:
          "Vacancy not found.",
      });
    }

    return res.status(200).json({
      job,
    });
  } catch (error) {
    console.error(
      "GET ADMIN JOB ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load vacancy.",
    });
  }
}

/* =====================================================
   ADMIN — CREATE JOB
===================================================== */

export async function createJob(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      department,
      location,
      type,
      employmentType,
      experience,
      salary,
      description,
      requirements,
      responsibilities,
      benefits,
      status,
      isPublished,
      deadline,
    } = req.body;

    /* -------------------------------------------------
       REQUIRED FIELDS
    ------------------------------------------------- */

    if (
      !title ||
      !department ||
      !location ||
      !description
    ) {
      return res.status(400).json({
        message:
          "Please complete all required fields.",
      });
    }

    /* -------------------------------------------------
       SUPPORT BOTH TYPE AND EMPLOYMENT TYPE
    ------------------------------------------------- */

    const finalType =
      employmentType ||
      type ||
      "FULL_TIME";

    /* -------------------------------------------------
       PARSE DEADLINE
    ------------------------------------------------- */

    let parsedDeadline:
      | Date
      | undefined;

    if (deadline) {
      parsedDeadline =
        new Date(deadline);

      if (
        Number.isNaN(
          parsedDeadline.getTime()
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid application deadline.",
        });
      }
    }

    /* -------------------------------------------------
       CREATE JOB
    ------------------------------------------------- */

    const job =
      await Job.create({
        title:
          String(title).trim(),

        department:
          String(
            department
          ).trim(),

        location:
          String(
            location
          ).trim(),

        type: finalType,

        employmentType:
          finalType,

        experience:
          experience
            ? String(
                experience
              ).trim()
            : "",

        salary:
          salary
            ? String(
                salary
              ).trim()
            : "",

        description:
          String(
            description
          ).trim(),

        requirements:
          Array.isArray(
            requirements
          )
            ? requirements
                .map(
                  (item: unknown) =>
                    String(
                      item
                    ).trim()
                )
                .filter(Boolean)
            : [],

        responsibilities:
          Array.isArray(
            responsibilities
          )
            ? responsibilities
                .map(
                  (item: unknown) =>
                    String(
                      item
                    ).trim()
                )
                .filter(Boolean)
            : [],

        benefits:
          Array.isArray(
            benefits
          )
            ? benefits
                .map(
                  (item: unknown) =>
                    String(
                      item
                    ).trim()
                )
                .filter(Boolean)
            : [],

        deadline:
          parsedDeadline,

        isPublished:
          isPublished !== undefined
            ? Boolean(
                isPublished
              )
            : status ===
              "active",

        status:
          status ||
          (isPublished
            ? "active"
            : "draft"),
      });

    return res.status(201).json({
      success: true,

      message:
        "Vacancy created successfully.",

      job,
    });
  } catch (error: any) {
    console.error(
      "CREATE JOB ERROR:",
      error
    );

    if (
      error?.name ===
      "ValidationError"
    ) {
      const details =
        Object.values(
          error.errors || {}
        )
          .map(
            (item: any) =>
              item.message
          )
          .join(", ");

      return res.status(400).json({
        message:
          "Job validation failed.",
        details,
      });
    }

    return res.status(500).json({
      message:
        "Unable to create vacancy.",
      details:
        process.env.NODE_ENV ===
        "development"
          ? error?.message
          : undefined,
    });
  }
}

/* =====================================================
   ADMIN — UPDATE JOB
===================================================== */

export async function updateJob(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message:
          "Job ID is required.",
      });
    }

    const updates: any = {
      ...req.body,
    };

    /* -------------------------------------------------
       CLEAN STRING FIELDS
    ------------------------------------------------- */

    const stringFields = [
      "title",
      "department",
      "location",
      "experience",
      "salary",
      "description",
    ];

    for (
      const field of stringFields
    ) {
      if (
        updates[field] !==
        undefined
      ) {
        updates[field] =
          String(
            updates[field]
          ).trim();
      }
    }

    /* -------------------------------------------------
       TYPE / EMPLOYMENT TYPE
    ------------------------------------------------- */

    if (
      updates.employmentType &&
      !updates.type
    ) {
      updates.type =
        updates.employmentType;
    }

    if (
      updates.type &&
      !updates.employmentType
    ) {
      updates.employmentType =
        updates.type;
    }

    /* -------------------------------------------------
       ARRAYS
    ------------------------------------------------- */

    const arrayFields = [
      "requirements",
      "responsibilities",
      "benefits",
    ];

    for (
      const field of arrayFields
    ) {
      if (
        updates[field] !==
        undefined
      ) {
        updates[field] =
          Array.isArray(
            updates[field]
          )
            ? updates[field]
                .map(
                  (item: unknown) =>
                    String(
                      item
                    ).trim()
                )
                .filter(Boolean)
            : [];
      }
    }

    /* -------------------------------------------------
       DEADLINE
    ------------------------------------------------- */

    if (
      updates.deadline ===
      ""
    ) {
      updates.deadline =
        undefined;
    }

    if (
      updates.deadline
    ) {
      const date =
        new Date(
          updates.deadline
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid application deadline.",
        });
      }

      updates.deadline =
        date;
    }

    /* -------------------------------------------------
       PUBLISHED / STATUS
    ------------------------------------------------- */

    if (
      updates.isPublished !==
      undefined
    ) {
      updates.isPublished =
        Boolean(
          updates.isPublished
        );

      if (
        updates.isPublished
      ) {
        updates.status =
          "active";
      } else if (
        !updates.status ||
        updates.status ===
          "active"
      ) {
        updates.status =
          "draft";
      }
    }

    /* -------------------------------------------------
       UPDATE
    ------------------------------------------------- */

    const job =
      await Job.findByIdAndUpdate(
        id,
        {
          $set: updates,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!job) {
      return res.status(404).json({
        message:
          "Vacancy not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Vacancy updated successfully.",

      job,
    });
  } catch (error: any) {
    console.error(
      "UPDATE JOB ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update vacancy.",
      details:
        process.env.NODE_ENV ===
        "development"
          ? error?.message
          : undefined,
    });
  }
}

/* =====================================================
   ADMIN — DELETE JOB
===================================================== */

export async function deleteJob(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message:
          "Job ID is required.",
      });
    }

    const job =
      await Job.findByIdAndDelete(
        id
      );

    if (!job) {
      return res.status(404).json({
        message:
          "Vacancy not found.",
      });
    }

    /* -------------------------------------------------
       DELETE ASSOCIATED APPLICATIONS
    ------------------------------------------------- */

    const applications =
      await JobApplication.find({
        jobId: job._id,
      });

    for (
      const application of applications
    ) {
      const resumePath =
        application.resume?.path;

      if (
        resumePath &&
        fs.existsSync(
          resumePath
        )
      ) {
        try {
          fs.unlinkSync(
            resumePath
          );
        } catch (fileError) {
          console.error(
            "RESUME DELETE ERROR:",
            fileError
          );
        }
      }
    }

    await JobApplication.deleteMany({
      jobId: job._id,
    });

    return res.status(200).json({
      success: true,

      message:
        "Vacancy deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE JOB ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to delete vacancy.",
    });
  }
}

/* =====================================================
   ADMIN — GET APPLICATIONS
===================================================== */

export async function getApplications(
  req: Request,
  res: Response
) {
  try {
    const {
      jobId,
      status,
    } = req.query;

    const filter: Record<
      string,
      unknown
    > = {};

    if (
      jobId &&
      typeof jobId === "string"
    ) {
      filter.jobId =
        jobId;
    }

    if (
      status &&
      typeof status === "string"
    ) {
      filter.status =
        status;
    }

    const applications =
      await JobApplication.find(
        filter
      )
        .populate(
          "jobId",
          "title department location type employmentType"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error(
      "GET APPLICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load applications.",
    });
  }
}

/* =====================================================
   ADMIN — GET SINGLE APPLICATION
===================================================== */

export async function getApplication(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message:
          "Application ID is required.",
      });
    }

    const application =
      await JobApplication.findById(
        id
      )
        .populate(
          "jobId",
          "title department location type employmentType"
        )
        .lean();

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found.",
      });
    }

    return res.status(200).json({
      application,
    });
  } catch (error) {
    console.error(
      "GET APPLICATION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load application.",
    });
  }
}

/* =====================================================
   ADMIN — UPDATE APPLICATION STATUS
===================================================== */

export async function updateApplicationStatus(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

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

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid application status.",
      });
    }

    const application =
      await JobApplication.findByIdAndUpdate(
        id,
        {
          $set: {
            status,

            ...(adminNotes !==
            undefined
              ? {
                  adminNotes:
                    String(
                      adminNotes
                    ).trim(),
                }
              : {}),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "jobId",
          "title department location type employmentType"
        );

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Application status updated successfully.",

      application,
    });
  } catch (error: any) {
    console.error(
      "UPDATE APPLICATION STATUS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update application status.",
      details:
        process.env.NODE_ENV ===
        "development"
          ? error?.message
          : undefined,
    });
  }
}

/* =====================================================
   ADMIN — DOWNLOAD RESUME
===================================================== */

export async function downloadApplicationResume(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    if (!id) {
      return res.status(400).json({
        message:
          "Application ID is required.",
      });
    }

    const application =
      await JobApplication.findById(
        id
      ).lean();

    if (
      !application?.resume?.path
    ) {
      return res.status(404).json({
        message:
          "Resume not found.",
      });
    }

    if (
      !fs.existsSync(
        application.resume.path
      )
    ) {
      return res.status(404).json({
        message:
          "Resume file no longer exists.",
      });
    }

    return res.download(
      application.resume.path,
      application.resume.originalName ||
        application.resume.filename
    );
  } catch (error) {
    console.error(
      "DOWNLOAD RESUME ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to download resume.",
    });
  }
}

/* =====================================================
   ADMIN — CAREER STATISTICS
===================================================== */

export async function getCareerStats(
  _req: Request,
  res: Response
) {
  try {
    const [
      totalJobs,
      activeJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      pendingApplications,
      reviewingApplications,
      shortlistedApplications,
      rejectedApplications,
      hiredApplications,
    ] =
      await Promise.all([
        Job.countDocuments(),

        Job.countDocuments({
          $or: [
            {
              status:
                "active",
            },
            {
              isPublished:
                true,
            },
          ],
        }),

        Job.countDocuments({
          status: "draft",
        }),

        Job.countDocuments({
          status: "closed",
        }),

        JobApplication.countDocuments(),

        JobApplication.countDocuments({
          status:
            "pending",
        }),

        JobApplication.countDocuments({
          status:
            "reviewing",
        }),

        JobApplication.countDocuments({
          status:
            "shortlisted",
        }),

        JobApplication.countDocuments({
          status:
            "rejected",
        }),

        JobApplication.countDocuments({
          status: "hired",
        }),
      ]);

    return res.status(200).json({
      stats: {
        totalJobs,

        activeJobs,

        draftJobs,

        closedJobs,

        totalApplications,

        pendingApplications,

        reviewingApplications,

        shortlistedApplications,

        rejectedApplications,

        hiredApplications,
      },
    });
  } catch (error) {
    console.error(
      "CAREER STATS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load career statistics.",
    });
  }
}