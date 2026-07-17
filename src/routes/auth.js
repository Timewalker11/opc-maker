const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(row) {
  return { id: row.id, username: row.username, email: row.email, name: row.name };
}

router.post('/signup', async (req, res) => {
  const { username, email, name, password } = req.body || {};

  if (!username || !email || !name || !password) {
    return res.status(400).json({ error: 'username, email, name, and password are all required' });
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'username must be at least 3 characters' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'email is not valid' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'password must be at least 8 characters' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, name, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, name`,
      [username, email, name, passwordHash]
    );
    const user = result.rows[0];
    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    if (err.code === '23505') {
      const field = err.constraint && err.constraint.includes('email') ? 'email' : 'username';
      return res.status(409).json({ error: `that ${field} is already taken` });
    }
    console.error(err);
    res.status(500).json({ error: 'something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const result = await pool.query(
      `SELECT id, username, email, name, password_hash FROM users WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'invalid username or password' });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'invalid username or password' });
    }
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = router;
