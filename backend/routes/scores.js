import { Router } from 'express';
import admin from 'firebase-admin';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const db = () => admin.firestore();

// POST /api/scores — submit quiz score
router.post('/', verifyToken, async (req, res) => {
  try {
    const { score, category, difficulty, correctAnswers, totalQuestions, timeTaken } = req.body;
    const { uid, name, picture } = req.user;

    await db().collection('scores').add({
      userId: uid,
      userName: name || 'Anonymous',
      userPhoto: picture || '',
      score: Number(score),
      category: category || 'General',
      difficulty: difficulty || 'Easy',
      correctAnswers: Number(correctAnswers),
      totalQuestions: Number(totalQuestions),
      timeTaken: Number(timeTaken),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const userRef = db().collection('users').doc(uid);
    await userRef.set({
      uid,
      displayName: name || 'Anonymous',
      photoURL: picture || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    await userRef.update({
      totalScore: admin.firestore.FieldValue.increment(Number(score)),
      quizzesTaken: admin.firestore.FieldValue.increment(1),
    });

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
