const fs = require('fs');
const filepath = 'backend/routes/proposals.js';
let content = fs.readFileSync(filepath, 'utf-8');

const targetLogic = // PUT /api/proposals/:id/status - Update status (SAC/Director)
router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body; // OPEN, IN_REVIEW, APPROVED, DENIED
  const proposalId = parseInt(req.params.id);
  
  if (req.user.role !== 'COMMITTEE' && req.user.role !== 'SAC') {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.username !== 'director@iiitdmj.ac.in') {
       return res.status(403).json({ error: 'Forbidden' });
    }
  }

  try {
    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});;

const newLogic = // PUT /api/proposals/:id/status - Update status (SAC/Director)
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
});;

if (content.includes('router.put(\\'/:id/status\\', authenticate')) {
    content = content.replace(targetLogic, newLogic);
    fs.writeFileSync(filepath, content);
    console.log("Updated proposals.js logic successfully");
} else {
    console.log("Could not find the target logic to replace.");
}
