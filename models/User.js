const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// -----------------------------
// Role Schema (embedded in User)
// -----------------------------
const roleSchema = new mongoose.Schema(
  {
    organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
    role: { type: String, enum: ["admin", "manager", "user"], required: true },
  },
  { _id: false } // prevent automatic _id for each role entry
);

// -----------------------------
// User Schema
// -----------------------------
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [roleSchema], // array of role objects
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// -----------------------------
// Middleware: Hash password
// -----------------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// -----------------------------
// Method: Compare password
// -----------------------------
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
