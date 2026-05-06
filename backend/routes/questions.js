import { Router } from 'express';
import admin from 'firebase-admin';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
const db = () => admin.firestore();

// GET /api/questions?category=Science&difficulty=Easy&limit=10
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    let query = db().collection('questions');
    if (category) query = query.where('category', '==', category);
    if (difficulty) query = query.where('difficulty', '==', difficulty);
    const snap = await query.limit(Number(limit)).get();
    const questions = snap.docs.map(d => ({
      id: d.id,
      text: d.data().text,
      options: d.data().options.map(o => o.text),
      category: d.data().category,
      difficulty: d.data().difficulty,
    }));
    res.json(questions.sort(() => Math.random() - 0.5));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/questions/:id/check — verify selected answer
router.post('/:id/check', verifyToken, async (req, res) => {
  try {
    const { selectedIndex } = req.body;
    const doc = await db().collection('questions').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Question not found' });
    const { options } = doc.data();
    const correctIndex = options.findIndex(o => o.isCorrect);
    res.json({ correct: selectedIndex === correctIndex, correctIndex });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/questions/admin/all — admin: list all questions
router.get('/admin/all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const snap = await db().collection('questions')
      .orderBy('createdAt', 'desc')
      .limit(Number(limit))
      .get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/questions — admin: create question
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { text, options, correctIndex, category, difficulty } = req.body;
    if (!text || !options?.length || correctIndex === undefined || !category || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const ref = await db().collection('questions').add({
      text,
      options: options.map((t, i) => ({ text: t, isCorrect: i === Number(correctIndex) })),
      category,
      difficulty,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/questions/:id — admin: update question
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { text, options, correctIndex, category, difficulty } = req.body;
    const updates = {};
    if (text) updates.text = text;
    if (options?.length && correctIndex !== undefined) {
      updates.options = options.map((t, i) => ({ text: t, isCorrect: i === Number(correctIndex) }));
    }
    if (category) updates.category = category;
    if (difficulty) updates.difficulty = difficulty;
    await db().collection('questions').doc(req.params.id).update(updates);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/questions/:id — admin: delete question
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db().collection('questions').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
