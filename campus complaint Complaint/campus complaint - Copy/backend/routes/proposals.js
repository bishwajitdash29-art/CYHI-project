const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

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

const UPVOTE_THRESHOLD = 5;

// GET /api/proposals - List all proposals
router.get('/', authenticate, async (req, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        upvotes: { select: { userId: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Calculate upvote counts and whether current user has upvoted
    const enriched = proposals.map(p => ({
      ...p,
      upvoteCount: p.upvotes.length,
      hasUpvoted: p.upvotes.some(u => u.userId === req.user.id),
      upvotes: undefined
    }));
    
    // Sort by upvotes desc, then by date desc
    enriched.sort((a, b) => b.upvoteCount - a.upvoteCount || new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/proposals - Create a proposal (ANONYMOUS)
router.post('/', authenticate, async (req, res) => {
  const { title, description, department } = req.body;
  if (req.user.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Only students can submit proposals.' });
  }

  try {
    const proposal = await prisma.proposal.create({
      data: {
        title,
        description,
        department: department || 'General',
        // authorId is completely omitted to ensure 100% anonymity
      }
    });
    res.json({ success: true, proposal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/proposals/:id/upvote - Toggle upvote
router.post('/:id/upvote', authenticate, async (req, res) => {
  const proposalId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { upvotes: true }
    });
    if (!proposal) return res.status(404).json({ error: 'Not found' });

    const existing = await prisma.upvote.findUnique({
      where: { userId_proposalId: { userId, proposalId } }
    });

    if (existing) {
      await prisma.upvote.delete({ where: { id: existing.id } });
      res.json({ success: true, action: 'removed' });
    } else {
      await prisma.upvote.create({ data: { userId, proposalId } });
      
      // Check if threshold met
      if (proposal.status === 'OPEN' && proposal.upvotes.length + 1 >= UPVOTE_THRESHOLD) {
        await prisma.proposal.update({
          where: { id: proposalId },
          data: { status: 'IN_REVIEW' }
        });
      }
      
      res.json({ success: true, action: 'added' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/proposals/:id/status - Update status (SAC/Director)
router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body; // OPEN, IN_REVIEW, APPROVED, DENIED
  const proposalId = parseInt(req.params.id);
  
  try {
    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const userName = (user.name || '').toLowerCase();

    // Check permissions based on department
    if (proposal.department === 'General Campus' || proposal.department === 'General') {
      if (!userName.includes('bhupendra') && user.username !== 'director@iiitdmj.ac.in') {
        return res.status(403).json({ error: 'Only Prof. Bhupendra can approve General Campus proposals.' });
      }
    } else if (proposal.department === 'Head of CSE' || proposal.department === 'Computer Science') {
      if (!userName.includes('ranjeet') && user.username !== 'director@iiitdmj.ac.in') {
        return res.status(403).json({ error: 'Only Ranjeet Kumar Ranjan can approve CSE proposals.' });
      }
    } else {
      if (req.user.role !== 'COMMITTEE' && req.user.role !== 'SAC' && user.username !== 'director@iiitdmj.ac.in') {
         return res.status(403).json({ error: 'Forbidden. You do not have permission to approve this proposal.' });
      }
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BACKGROUND JOB: Push proposals to "IN_REVIEW" if they stay OPEN for > 1 minute
setInterval(async () => {
  const oneMinuteAgo = new Date(Date.now() - 60000);
  try {
    await prisma.proposal.updateMany({
      where: {
        status: 'OPEN',
        createdAt: { lte: oneMinuteAgo }
      },
      data: { status: 'IN_REVIEW' }
    });
  } catch(err) {
    console.error("Proposal Sweeper error:", err.message);
  }
}, 10000); // Check every 10 seconds

module.exports = router;
