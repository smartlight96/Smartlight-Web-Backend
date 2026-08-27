import "dotenv/config";
import mongoose from "mongoose";

import { app } from "./app";
import { env } from "./config/env";

async function startServer() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected");

    app.listen(env.PORT, () => {
      console.log(`SMARTLIGHT API running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("SERVER START ERROR:", error);
    process.exit(1);
  }
}

startServer();
