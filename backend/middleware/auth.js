// Middleware to check authentication
export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Reikalingas prisijungimas' });
  }
  next();
};

// Middleware to check admin role
export const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Reikalingas prisijungimas' });
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Reikalingos administratoriaus teisės' });
  }
  next();
};
