
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.role !== "ADMIN" && user.username !== "director@iiitdmj.ac.in") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

router.get("/", authenticate, async (req, res) => {
  try {
    const elections = await prisma.election.findMany({
      include: { candidates: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(elections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/eligibility", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const usernamePrefix = user.username.split("@")[0].toLowerCase();
    
    const eligibility = await prisma.eligibleVoter.findFirst({
      where: {
        electionId: parseInt(req.params.id),
        studentId: usernamePrefix
      }
    });

    if (!eligibility) return res.json({ eligible: false, hasVoted: false });
    res.json({ eligible: true, hasVoted: eligibility.hasVoted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const election = await prisma.election.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { candidates: true, voters: true }
    });
    if (!election) return res.status(404).json({ error: "Election not found" });
    res.json(election);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { title } = req.body;
    const election = await prisma.election.create({
      data: { title, status: "UPCOMING" }
    });
    res.status(201).json(election);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/status", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    let data = { status };
    if (status === "ACTIVE") data.startTime = new Date();
    if (status === "CLOSED") data.endTime = new Date();

    const election = await prisma.election.update({
      where: { id: parseInt(req.params.id) },
      data
    });
    res.json(election);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/candidates", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, manifesto } = req.body;
    const candidate = await prisma.candidate.create({
      data: { name, manifesto, electionId: parseInt(req.params.id) }
    });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/voters", authenticate, requireAdmin, async (req, res) => {
  try {
    const { studentIds } = req.body;
    const electionId = parseInt(req.params.id);

    const inserted = [];
    for (const sid of studentIds) {
      try {
        const normalized = sid.trim().toLowerCase();
        if (!normalized) continue;
        const ev = await prisma.eligibleVoter.upsert({
          where: { studentId_electionId: { studentId: normalized, electionId } },
          update: {},
          create: { studentId: normalized, electionId }
        });
        inserted.push(ev);
      } catch (e) { }
    }
    res.json({ message: `Added ${inserted.length} eligible voters.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/vote", authenticate, async (req, res) => {
  try {
    const electionId = parseInt(req.params.id);
    const { candidateId } = req.body;

    const election = await prisma.election.findUnique({ where: { id: electionId } });
    if (!election) return res.status(404).json({ error: "Election not found" });
    if (election.status !== "ACTIVE") return res.status(403).json({ error: "Voting is not active for this election" });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const usernamePrefix = user.username.split("@")[0].toLowerCase();

    const eligibility = await prisma.eligibleVoter.findFirst({
      where: { electionId: electionId, studentId: usernamePrefix }
    });

    if (!eligibility) return res.status(403).json({ error: "You are not eligible to vote in this election (CPI < 6.5 or not added by admin)." });
    if (eligibility.hasVoted) return res.status(403).json({ error: "You have already cast your vote." });

    await prisma.$transaction([
      prisma.eligibleVoter.update({
        where: { id: eligibility.id },
        data: { hasVoted: true }
      }),
      prisma.candidate.update({
        where: { id: parseInt(candidateId) },
        data: { votesCount: { increment: 1 } }
      })
    ]);

    const secret = process.env.JWT_SECRET || "secret";
    const rawReceipt = `vote-receipt-${user.id}-${electionId}-${Date.now()}-${secret}`;
    const hash = crypto.createHash("sha256").update(rawReceipt).digest("hex").substring(0, 16);

    res.json({ message: "Vote recorded successfully", receipt: `VOTE-${hash.toUpperCase()}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

