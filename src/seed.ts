import bcrypt from "bcryptjs";

import { connectDatabase } from "./config/database";

import { User } from "./models/User";
import { Service } from "./models/Service";
import { SiteSetting } from "./models/SiteSetting";

/* =====================================================
   SERVICES
===================================================== */

const items = [
  "Web Development",
  "Graphic Design & Branding",
  "Video & Media Production",
  "Digital Marketing",
  "Education & Skills Development",
  "IT Solutions & Support",
  "Business & Professional Services",
].map((name, i) => ({
  name,

  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),

  description: [
    "Modern websites and web applications built for growth.",
    "Professional visual identities, marketing materials and brand systems.",
    "Engaging videos, editing, social content and promotional media.",
    "Content, social media, SEO and digital campaigns that grow visibility.",
    "Practical technology, AI and digital skills training.",
    "Reliable technology support and business IT solutions.",
    "Research, business development, accounting and professional support.",
  ][i],

  category: [
    "Technology",
    "Creative",
    "Media",
    "Marketing",
    "Education",
    "Technology",
    "Business",
  ][i],

  active: true,

  featured: i < 3,
}));

/* =====================================================
   SEED
===================================================== */

async function seed() {
  try {
    await connectDatabase();

    console.log("MongoDB connected");

    /* =================================================
       ADMIN USER
    ================================================= */

    const passwordHash = await bcrypt.hash(
      "@Edemattoe1",
      12
    );

    await User.findOneAndUpdate(
      {
        email: "admin@smartlight.ng",
      },
      {
        name: "SMARTLIGHT Administrator",

        email: "admin@smartlight.ng",

        passwordHash,

        role: "ADMIN",

        accountStatus: "active",

        verified: true,
      },
      {
        upsert: true,

        new: true,

        setDefaultsOnInsert: true,
      }
    );

    console.log("Admin user seeded");

    /* =================================================
       SERVICES
    ================================================= */

    for (const service of items) {
      /*
       * First search by NAME because the database
       * already has a unique index on name.
       *
       * This prevents E11000 duplicate-name errors
       * when an older record has a different slug.
       */

      await Service.findOneAndUpdate(
        {
          name: service.name,
        },
        {
          $set: service,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log(
      `${items.length} services seeded`
    );

    /* =================================================
       SITE SETTINGS
    ================================================= */

    await SiteSetting.findOneAndUpdate(
      {
        key: "site",
      },
      {
        $set: {
          key: "site",

          value: {
            name: "SMARTLIGHT",

            tagline:
              "Technology, creativity and professional solutions.",
          },
        },
      },
      {
        upsert: true,

        new: true,

        setDefaultsOnInsert: true,
      }
    );

    console.log("Site settings seeded");

    /* =================================================
       COMPLETE
    ================================================= */

    console.log("");
    console.log("==============================");
    console.log("SMARTLIGHT SEED COMPLETE");
    console.log("==============================");
    console.log("");
    console.log(
      "Admin email: admin@smartlight.ng"
    );
    console.log(
      "Admin password: @Edemattoe1"
    );
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("==============================");
    console.error("SMARTLIGHT SEED FAILED");
    console.error("==============================");
    console.error("");

    console.error(error);

    process.exit(1);
  }
}

seed();