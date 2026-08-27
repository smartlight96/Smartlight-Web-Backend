import { Router } from "express";
import {
  getPublicJobs,
  getPublicJob,
  submitApplication,
} from "../controllers/career.controller";
import { careerUpload } from "../middleware/upload";

const router = Router();

// Public careers API. Keep both the explicit /jobs endpoints and the
// shorter aliases used by the frontend for backwards compatibility.
router.get("/", getPublicJobs);
router.get("/jobs", getPublicJobs);
router.get("/jobs/:id", getPublicJob);
router.get("/:id", getPublicJob);

router.post(
  "/apply",
  careerUpload.single("resume"),
  submitApplication
);
router.post(
  "/applications",
  careerUpload.single("resume"),
  submitApplication
);

export default router;
