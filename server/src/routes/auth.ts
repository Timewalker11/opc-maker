import { randomUUID } from "node:crypto";
import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { signToken } from "../authUtils.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
}

function publicUser(row: UserRow) {
  return { name: row.name, email: row.email };
}

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name?.trim()) return res.status(400).json({ error: "Enter your name." });
  if (!EMAIL_RE.test(email ?? "")) return res.status(400).json({ error: "Enter a valid email address." });
  if (!password || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: string } | undefined;
  if (existing) return res.status(409).json({ error: "An account with that email already exists." });

  const id = randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);
  db.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").run(id, name.trim(), email, passwordHash);

  const token = signToken({ sub: id, email });
  res.status(201).json({ token, user: { name: name.trim(), email } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
  if (!row) return res.status(401).json({ error: "Incorrect email or password." });

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: "Incorrect email or password." });

  const token = signToken({ sub: row.id, email: row.email });
  res.json({ token, user: publicUser(row) });
});

router.get("/me", requireAuth, (req, res) => {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId!) as UserRow | undefined;
  if (!row) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(row) });
});

export default router;
