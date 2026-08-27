# Add these fields to the existing User schema

accountStatus: {
  type: String,
  enum: ["active", "locked", "suspended", "deactivated"],
  default: "active"
},
accountStatusReason: { type: String, default: "" },
accountStatusChangedAt: { type: Date, default: null },
accountStatusChangedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
lastLoginAt: { type: Date, default: null }

# Expand the existing role enum to:
["user", "admin", "customer_care", "manager", "accountant", "content_manager", "super_admin"]

# IMPORTANT:
# Merge these into your existing schema. Do not replace the existing User model.
