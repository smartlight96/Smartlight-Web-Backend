import { Router } from "express";

import { Service } from "../models/Service";
import { Review } from "../models/Review";
import { SiteSetting } from "../models/SiteSetting";

import {
  createMessage,
} from "../controllers/message.controller";

const r = Router();

/**
 * =========================================================
 * PUBLIC SERVICES
 * =========================================================
 */

/**
 * GET /api/public/services
 */
r.get("/services", async (_req, res) => {
  try {
    const services = await Service.find({
      active: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      services,
    });
  } catch (error) {
    console.error(
      "GET PUBLIC SERVICES ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load services.",
    });
  }
});

/**
 * =========================================================
 * PUBLIC REVIEWS
 * =========================================================
 */

/**
 * GET /api/public/reviews
 */
r.get("/reviews", async (_req, res) => {
  try {
    const reviews = await Review.find({
      status: "approved",
      featured: true,
    })
      .populate("user", "name")
      .populate("service", "name")
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    return res.status(200).json({
      reviews,
    });
  } catch (error) {
    console.error(
      "GET PUBLIC REVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load reviews.",
    });
  }
});

/**
 * =========================================================
 * PUBLIC SITE SETTINGS
 * =========================================================
 */

/**
 * GET /api/public/settings
 */
r.get("/settings", async (_req, res) => {
  try {
    const rows = await SiteSetting.find().lean();

    return res.status(200).json({
      settings: Object.fromEntries(
        rows.map((x) => [
          x.key,
          x.value,
        ])
      ),
    });
  } catch (error) {
    console.error(
      "GET PUBLIC SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load site settings.",
    });
  }
});

/**
 * =========================================================
 * PUBLIC CONTACT MESSAGE
 * =========================================================
 */

/**
 * POST /api/public/contact
 *
 * Used by the public SMARTLIGHT contact form.
 */
r.post(
  "/contact",
  createMessage
);

export default r;