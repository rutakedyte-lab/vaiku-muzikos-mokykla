import express from 'express';
import db from '../db/instantdb.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all lessons
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({
      lessons: {},
      students: {},
      teachers: {}
    });
    if (error) throw error;
    
    // Join lessons with students and teachers
    const lessons = (data.lessons || []).map(lesson => {
      const student = (data.students || []).find(s => s.id === lesson.student_id);
      const teacher = (data.teachers || []).find(t => t.id === lesson.teacher_id);
      return {
        ...lesson,
        student,
        teacher
      };
    });
    
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Klaida gaunant pamokų duomenis' });
  }
});

// Get lesson by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({
      lessons: {
        $: { where: { id: req.params.id } }
      },
      students: {},
      teachers: {}
    });
    if (error) throw error;
    
    if (!data.lessons || data.lessons.length === 0) {
      return res.status(404).json({ error: 'Pamoka nerasta' });
    }
    
    const lesson = data.lessons[0];
    const student = (data.students || []).find(s => s.id === lesson.student_id);
    const teacher = (data.teachers || []).find(t => t.id === lesson.teacher_id);
    
    res.json({
      ...lesson,
      student,
      teacher
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Klaida gaunant pamokos duomenis' });
  }
});

// Create lesson (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { student_id, teacher_id, laikas } = req.body;
    
    if (!student_id || !teacher_id || !laikas) {
      return res.status(400).json({ error: 'Visi laukai privalomi' });
    }

    const { data, error } = await db.transact([
      db.tx.lessons[db.id()].update({
        student_id,
        teacher_id,
        laikas
      })
    ]);

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Klaida kuriant pamoką' });
  }
});

// Update lesson (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { student_id, teacher_id, laikas } = req.body;
    
    const { data, error } = await db.transact([
      db.tx.lessons[req.params.id].update({
        ...(student_id && { student_id }),
        ...(teacher_id && { teacher_id }),
        ...(laikas && { laikas })
      })
    ]);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Klaida atnaujinant pamoką' });
  }
});

// Delete lesson (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await db.transact([
      db.tx.lessons[req.params.id].delete()
    ]);

    if (error) throw error;
    res.json({ message: 'Pamoka sėkmingai ištrinta' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Klaida ištrinant pamoką' });
  }
});

export default router;
