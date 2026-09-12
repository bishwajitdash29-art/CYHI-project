const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to verify auth
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Student: Submit complaint
router.post('/', async (req, res) => {
  const { title, description, professorId } = req.body;
  try {
    const trackingToken = crypto.randomBytes(8).toString('hex');
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        trackingToken,
        professorId: professorId ? parseInt(professorId) : null
      }
    });
    res.json({ success: true, trackingToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student: Track complaint
router.get('/track/:token', async (req, res) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { trackingToken: req.params.token },
      include: {
        professor: { select: { name: true } },
        replies: {
          include: { user: { select: { name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    if (!complaint) return res.status(404).json({ error: 'Not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all professors
router.get('/professors', async (req, res) => {
  try {
    const professors = await prisma.user.findMany({
      where: { role: 'PROFESSOR' },
      select: { id: true, name: true }
    });
    res.json(professors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Professor/Committee: Get complaints
router.get('/', authenticate, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'PROFESSOR') {
      complaints = await prisma.complaint.findMany({
        where: { professorId: req.user.id },
        include: {
          professor: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (req.user.role === 'COMMITTEE') {
      complaints = await prisma.complaint.findMany({
        include: {
          professor: { select: { name: true } },
          replies: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single complaint details by ID (authenticated)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        professor: { select: { name: true } },
        replies: {
          include: { user: { select: { name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    if (!complaint) return res.status(404).json({ error: 'Not found' });
    
    // Authorization check
    if (req.user.role === 'PROFESSOR' && complaint.professorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Professor/Committee: Reply to complaint
router.post('/:id/reply', authenticate, async (req, res) => {
  const { message } = req.body;
  const complaintId = parseInt(req.params.id);
  try {
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    if (req.user.role === 'PROFESSOR' && complaint.professorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const reply = await prisma.reply.create({
      data: {
        message,
        complaintId,
        userId: req.user.id
      }
    });

    res.json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update complaint status
router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const complaintId = parseInt(req.params.id);
  
  try {
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    if (req.user.role === 'PROFESSOR' && complaint.professorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
