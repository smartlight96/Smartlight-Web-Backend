# Register the addon routes in your existing Express app

Use the same authentication/protection middleware already used by your existing admin routes.

Example:

import adminUsersRouter from "./routes/adminUsers.js";
import adminReviewsRouter from "./routes/adminReviews.js";
import adminSupportRouter from "./routes/adminSupport.js";
import adminLogsRouter from "./routes/adminLogs.js";
import adminBusinessRouter from "./routes/adminBusiness.js";

app.use("/api/admin/users", protect, adminOnly, adminUsersRouter);
app.use("/api/admin/reviews", protect, adminOnly, adminReviewsRouter);
app.use("/api/admin/support", protect, adminOnly, adminSupportRouter);
app.use("/api/admin/logs", protect, adminOnly, adminLogsRouter);
app.use("/api/admin/business", protect, adminOnly, adminBusinessRouter);

IMPORTANT:
- Replace protect/adminOnly with the exact middleware names used by your current project.
- Do not create a second authentication system.
- The business module records quotations/invoices only. It contains NO payment gateway integration.
