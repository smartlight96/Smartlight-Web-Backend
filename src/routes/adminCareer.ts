import { Router } from "express";

import {
  getAdminJobs,
  getAdminJob,
  createJob,
  updateJob,
  deleteJob,
  getApplications,
  getApplication,
  updateApplicationStatus,
  getCareerStats,
  downloadApplicationResume,
} from "../controllers/career.controller";

const router = Router();

/*
 * JOBS
 */

router.get("/jobs", getAdminJobs);

router.post("/jobs", createJob);

router.get(
  "/jobs/:id",
  getAdminJob
);

router.patch(
  "/jobs/:id",
  updateJob
);

router.delete(
  "/jobs/:id",
  deleteJob
);

/*
 * APPLICATIONS
 */

router.get(
  "/applications",
  getApplications
);

router.get(
  "/applications/:id",
  getApplication
);

router.get(
  "/applications/:id/resume",
  downloadApplicationResume
);

router.patch(
  "/applications/:id/status",
  updateApplicationStatus
);

/*
 * CAREER STATISTICS
 */

router.get(
  "/stats",
  getCareerStats
);

export default router;