import admin from 'firebase-admin';

export async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  const adminUids = (process.env.ADMIN_UIDS || '').split(',').map(u => u.trim());
  if (!adminUids.includes(req.user.uid)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
