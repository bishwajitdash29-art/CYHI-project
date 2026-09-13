const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

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

router.post('/', async (req, res) => {
  const { title, description, targetId } = req.body;
  
  let authorId = null;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized. Please log in.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    authorId = payload.id;

    if (payload.role === 'STUDENT') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const existingComplaint = await prisma.complaint.findFirst({
        where: {
          authorId: authorId,
          createdAt: {
            gte: startOfDay
          }
        }
      });

      if (existingComplaint) {
        return res.status(429).json({ error: 'You can only file 1 complaint per day.' });
      }
    }
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  try {
    const trackingToken = crypto.randomBytes(8).toString('hex');
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        trackingToken,
        targetId: targetId ? parseInt(targetId) : null,
        authorId
      }
    });
    res.json({ success: true, trackingToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/track/:token', async (req, res) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { trackingToken: req.params.token },
      include: {
        target: { select: { name: true, role: true } },
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

router.get('/targets', async (req, res) => {
  const { role } = req.query; // PROFESSOR or STUDENT
  try {
    const targets = await prisma.user.findMany({
      where: { role: role ? role.toUpperCase() : undefined },
      select: { id: true, name: true, username: true, role: true }
    });
    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/public', authenticate, async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        target: { select: { name: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    // Sanitize data for public viewing
    const publicComplaints = complaints.map(c => ({
      id: c.id,
      title: c.title,
      trackingToken: c.trackingToken,
      description: c.description,
      status: c.status,
      createdAt: c.createdAt,
      targetName: c.target?.name,
      targetRole: c.target?.role
    }));
    res.json(publicComplaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/escalated', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.username !== 'director@iiitdmj.ac.in') {
      return res.json([]);
    }
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000);
    const escalated = await prisma.complaint.findMany({
      where: {
        status: { in: ['PENDING', 'REOPENED'] },
        createdAt: { lt: twoMinsAgo },
        targetId: { not: req.user.id }
      },
      include: {
        target: { select: { name: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(escalated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/ping', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.username !== 'director@iiitdmj.ac.in') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const complaintId = parseInt(req.params.id);
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    await prisma.reply.create({
      data: {
        message: "URGENT PING FROM DIRECTOR: Please resolve this issue immediately. Escalation timeline has been breached.",
        complaintId: complaint.id,
        userId: req.user.id
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'STUDENT') {
      complaints = await prisma.complaint.findMany({
        where: { OR: [{ targetId: req.user.id }, { authorId: req.user.id }] },
        include: {
          target: { select: { name: true, role: true } },
          replies: { include: { user: { select: { name: true, role: true, username: true } } }, orderBy: { createdAt: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (req.user.role === 'PROFESSOR' || req.user.role === 'MESS' || req.user.role === 'SAC' || req.user.role === 'FIC') {
      complaints = await prisma.complaint.findMany({
        where: { targetId: req.user.id },
        include: {
          target: { select: { name: true } },
          replies: { include: { user: { select: { name: true, role: true, username: true } } }, orderBy: { createdAt: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (req.user.role === 'COMMITTEE') {
      complaints = await prisma.complaint.findMany({
        include: {
          target: { select: { name: true, role: true } },
          replies: { include: { user: { select: { name: true, role: true, username: true } } }, orderBy: { createdAt: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // inject userId so the frontend knows who the current user is
    res.json({ complaints, currentUserId: req.user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        target: { select: { name: true, role: true } },
        replies: {
          include: { user: { select: { name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    if (!complaint) return res.status(404).json({ error: 'Not found' });
    
    if (req.user.role !== 'COMMITTEE' && complaint.targetId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/reply', authenticate, async (req, res) => {
  const { message } = req.body;
  const complaintId = parseInt(req.params.id);
  try {
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    if (req.user.role !== 'COMMITTEE' && complaint.targetId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const reply = await prisma.reply.create({
      data: {
        message,
        complaintId,
        userId: req.user.id
      }
    });

    // Auto-update status to AWAITING_REVIEW when a target replies
    if (req.user.role === 'PROFESSOR' || req.user.role === 'MESS' || req.user.role === 'SAC' || req.user.role === 'FIC') {
      await prisma.complaint.update({
        where: { id: complaintId },
        data: { status: 'AWAITING_REVIEW' }
      });
    }

    res.json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/track/:token/reply', async (req, res) => {
  const { content } = req.body;
  try {
    const complaint = await prisma.complaint.findUnique({ where: { trackingToken: req.params.token } });
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    await prisma.reply.create({
      data: {
        message: content,
        complaintId: complaint.id,
        userId: complaint.authorId // Use the original author (student)
      }
    });

    const updated = await prisma.complaint.findUnique({
      where: { id: complaint.id },
      include: {
        target: { select: { name: true, role: true } },
        replies: { include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: 'asc' } }
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/track/:token/review', async (req, res) => {
  const { resolution } = req.body; // 'RESOLVED' or 'REOPENED'
  try {
    const complaint = await prisma.complaint.findUnique({ where: { trackingToken: req.params.token } });
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    const updated = await prisma.complaint.update({
      where: { id: complaint.id },
      data: { status: resolution },
      include: {
        target: { select: { name: true, role: true } },
        replies: { include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: 'asc' } }
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const complaintId = parseInt(req.params.id);
  
  try {
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    if (req.user.role !== 'COMMITTEE' && complaint.targetId !== req.user.id) {
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
