import express from 'express';
import { init } from '@instantdb/node';

const router = express.Router();

// Initialize InstantDB
const db = init({
  appId: process.env.INSTANTDB_APP_ID,
  token: process.env.INSTANTDB_TOKEN
});

// Simple in-memory user store (in production, use InstantDB)
// For demo: admin/admin123, viewer/viewer123
const users = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
  { id: '2', username: 'viewer', password: 'viewer123', role: 'viewer' }
];

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Neteisingi prisijungimo duomenys' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Serverio klaida' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Atsijungimo klaida' });
    }
    res.json({ message: 'Sėkmingai atsijungta' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Neprisijungęs' });
  }
});

export default router;
