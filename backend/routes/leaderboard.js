import { Router } from 'express';
import admin from 'firebase-admin';

const router = Router();
const db = () => admin.firestore();

// GET /api/leaderboard?limit=10
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const snap = await db().collection('users')
      .orderBy('totalScore', 'desc')
      .limit(Number(limit))
      .get();
    const leaderboard = snap.docs.map((d, i) => ({
      rank: i + 1,
      ...d.data(),
    }));
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leaderboard/user/:uid
router.get('/user/:uid', async (req, res) => {
  try {
    const userDoc = await db().collection('users').doc(req.params.uid).get();
    if (!userDoc.exists) return res.json({ rank: null, totalScore: 0 });
    const userData = userDoc.data();
    const countSnap = await db().collection('users')
      .where('totalScore', '>', userData.totalScore || 0)
      .count()
      .get();
    res.json({ rank: countSnap.data().count + 1, ...userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
