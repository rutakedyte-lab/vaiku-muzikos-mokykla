import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../db/instantdb.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Tik video failai leidžiami (mp4, webm, ogg)'));
    }
  }
});

// Upload video for lesson (admin only)
router.post('/upload/:lessonId', requireAdmin, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video failas nebuvo įkeltas' });
    }

    const lessonId = req.params.lessonId;
    const videoPath = `/uploads/videos/${req.file.filename}`;

    // Update lesson with video path in InstantDB
    // Note: You may need to add a video_path field to your lessons schema
    const { data, error } = await db.transact([
      db.tx.lessons[lessonId].update({
        video_path: videoPath
      })
    ]);

    if (error) throw error;

    res.status(201).json({
      message: 'Video sėkmingai įkeltas',
      videoPath: videoPath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Klaida įkeliant video' });
  }
});

// Get video by lesson ID
router.get('/lesson/:lessonId', requireAuth, async (req, res) => {
  try {
    const { data, error } = await db.query({
      lessons: {
        $: { where: { id: req.params.lessonId } }
      }
    });
    
    if (error) throw error;
    
    if (!data.lessons || data.lessons.length === 0) {
      return res.status(404).json({ error: 'Pamoka nerasta' });
    }

    const lesson = data.lessons[0];
    
    if (!lesson.video_path) {
      return res.status(404).json({ error: 'Video nerastas šiai pamokai' });
    }

    res.json({ videoPath: lesson.video_path });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Klaida gaunant video' });
  }
});

// Delete video (admin only)
router.delete('/:lessonId', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await db.query({
      lessons: {
        $: { where: { id: req.params.lessonId } }
      }
    });
    
    if (error) throw error;
    
    if (!data.lessons || data.lessons.length === 0) {
      return res.status(404).json({ error: 'Pamoka nerasta' });
    }

    const lesson = data.lessons[0];
    
    if (lesson.video_path) {
      const videoPath = path.join(__dirname, '..', lesson.video_path);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    // Remove video_path from lesson
    const { data: updateData, error: updateError } = await db.transact([
      db.tx.lessons[req.params.lessonId].update({
        video_path: null
      })
    ]);

    if (updateError) throw updateError;

    res.json({ message: 'Video sėkmingai ištrintas' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Klaida ištrinant video' });
  }
});

export default router;
