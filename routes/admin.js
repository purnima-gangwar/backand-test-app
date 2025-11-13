import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

const router = express.Router();
const USERS_FILE = "./data/users.json";

// Helper: Admin auth
function adminAuth(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token !== process.env.ADMIN_TOKEN)
    return res.status(403).json({ message: "Forbidden" });
  next();
}

// GET all users OR single user by ID (admin only)
router.get("/admin/users", adminAuth, (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  const { id } = req.query; // ?id=<userId>

  if (id) {
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  }

  res.json({ users });
});

// GET user password by ID (admin only)
router.get("/admin/users/:id/password", adminAuth, (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ password: user.password });
});

// CREATE user (admin only) — id required
router.post("/admin/users", adminAuth, (req, res) => {
  const { id, username, email, password } = req.body;
  if (!id || !username || !email || !password)
    return res
      .status(400)
      .json({ message: "All fields required including id" });

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  if (users.some((u) => u.id === id))
    return res.status(400).json({ message: "ID already exists" });

  const newUser = { id, username, email, password };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.status(201).json({ message: "User created", user: newUser });
});

// DELETE user (admin only)
router.delete("/admin/users/:id", adminAuth, (req, res) => {
  let users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  const userExists = users.some((u) => u.id === req.params.id);
  if (!userExists) return res.status(404).json({ message: "User not found" });

  users = users.filter((u) => u.id !== req.params.id);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ message: "User deleted" });
});

export default router;
