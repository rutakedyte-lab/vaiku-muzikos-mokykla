import express from 'express';
import db from '../db/instantdb.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all students
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({ students: {} });
    if (error) throw error;
    res.json(data.students || []);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Klaida gaunant mokinių duomenis' });
  }
});

// Get student by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({
      students: {
        $: { where: { id: req.params.id } }
      }
    });
    if (error) throw error;
    if (!data.students || data.students.length === 0) {
      return res.status(404).json({ error: 'Mokinys nerastas' });
    }
    res.json(data.students[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Klaida gaunant mokinio duomenis' });
  }
});

// Filter students by instrument
router.get('/filter/instrument/:instrument', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({
      students: {
        $: { where: { instrumentas: req.params.instrument } }
      }
    });
    if (error) throw error;
    res.json(data.students || []);
  } catch (error) {
    console.error('Error filtering students:', error);
    res.status(500).json({ error: 'Klaida filtruojant mokinius' });
  }
});

// Create student (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { vardas, amžius, instrumentas } = req.body;
    
    if (!vardas || !amžius || !instrumentas) {
      return res.status(400).json({ error: 'Visi laukai privalomi' });
    }

    const { data, error } = await db.transact([
      db.tx.students[db.id()].update({
        vardas,
        amžius: parseInt(amžius),
        instrumentas
      })
    ]);

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Klaida kuriant mokinį' });
  }
});

// Update student (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { vardas, amžius, instrumentas } = req.body;
    
    const { data, error } = await db.transact([
      db.tx.students[req.params.id].update({
        ...(vardas && { vardas }),
        ...(amžius && { amžius: parseInt(amžius) }),
        ...(instrumentas && { instrumentas })
      })
    ]);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Klaida atnaujinant mokinį' });
  }
});

// Delete student (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await db.transact([
      db.tx.students[req.params.id].delete()
    ]);

    if (error) throw error;
    res.json({ message: 'Mokinys sėkmingai ištrintas' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Klaida ištrinant mokinį' });
  }
});

export default router;
