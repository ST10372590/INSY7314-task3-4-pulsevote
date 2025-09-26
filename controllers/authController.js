const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// -----------------------------
// Helper: Generate JWT with roles
// -----------------------------
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

// -----------------------------
// Register User (default role: user)
// -----------------------------
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ message: "Invalid input", errors: errors.array() });

  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "user" }],
    });

    const token = generateToken(user);
    res.status(201).json({
      message: "User registered",
      token,
      user: { id: user._id, email: user.email, roles: user.roles },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err });
  }
};

// -----------------------------
// Register Manager (only admin can create managers)
// -----------------------------
exports.registerManager = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ message: "Invalid input", errors: errors.array() });

  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.roles.some((r) => r.role === "admin")) {
      return res
        .status(403)
        .json({ message: "Only admins can create managers" });
    }

    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const managerUser = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "manager" }],
    });

    const token = generateToken(managerUser);
    res.status(201).json({
      message: "Manager registered",
      token,
      user: {
        id: managerUser._id,
        email: managerUser.email,
        roles: managerUser.roles,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err });
  }
};

// -----------------------------
// Register Admin
// -----------------------------
exports.registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ message: "Invalid input", errors: errors.array() });

  try {
    const { email, password } = req.body;

    // Check if at least one admin already exists
    const adminExists = await User.exists({ "roles.role": "admin" });

    if (adminExists) {
      const requestingUser = await User.findById(req.user.id);
      const isAdmin = requestingUser?.roles?.some((r) => r.role === "admin");
      if (!isAdmin) {
        return res
          .status(403)
          .json({ message: "Only admins can create new admins" });
      }
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const adminUser = await User.create({
      email,
      password,
      roles: [{ organisationId: null, role: "admin" }],
    });

    const token = generateToken(adminUser);
    res.status(201).json({
      message: "Admin registered",
      token,
      user: { id: adminUser._id, email: adminUser.email, roles: adminUser.roles },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err });
  }
};

// -----------------------------
// Login
// -----------------------------
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ message: "Invalid input", errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, roles: user.roles },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err });
  }
};
