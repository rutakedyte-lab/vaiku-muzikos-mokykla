import express from 'express';
import db from '../db/instantdb.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all teachers
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({ teachers: {} });
    if (error) throw error;
    res.json(data.teachers || []);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Klaida gaunant mokytojų duomenis' });
  }
});

// Get teacher by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({
      teachers: {
        $: { where: { id: req.params.id } }
      }
    });
    if (error) throw error;
    if (!data.teachers || data.teachers.length === 0) {
      return res.status(404).json({ error: 'Mokytojas nerastas' });
    }
    res.json(data.teachers[0]);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Klaida gaunant mokytojo duomenis' });
  }
});

// Get teacher schedule
router.get('/:id/schedule', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({
      lessons: {
        $: { where: { teacher_id: req.params.id } }
      },
      students: {}
    });
    if (error) throw error;
    
    // Join lessons with students
    const lessons = (data.lessons || []).map(lesson => {
      const student = (data.students || []).find(s => s.id === lesson.student_id);
      return {
        ...lesson,
        student
      };
    });
    
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching teacher schedule:', error);
    res.status(500).json({ error: 'Klaida gaunant mokytojo tvarkaraštį' });
  }
});

// Create teacher (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { vardas, specialybė } = req.body;
    
    if (!vardas || !specialybė) {
      return res.status(400).json({ error: 'Visi laukai privalomi' });
    }

    const { data, error } = await db.transact([
      db.tx.teachers[db.id()].update({
        vardas,
        specialybė
      })
    ]);

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Klaida kuriant mokytoją' });
  }
});

// Update teacher (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { vardas, specialybė } = req.body;
    
    const { data, error } = await db.transact([
      db.tx.teachers[req.params.id].update({
        ...(vardas && { vardas }),
        ...(specialybė && { specialybė })
      })
    ]);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Klaida atnaujinant mokytoją' });
  }
});

// Delete teacher (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await db.transact([
      db.tx.teachers[req.params.id].delete()
    ]);

    if (error) throw error;
    res.json({ message: 'Mokytojas sėkmingai ištrintas' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Klaida ištrinant mokytoją' });
  }
});

export default router;
