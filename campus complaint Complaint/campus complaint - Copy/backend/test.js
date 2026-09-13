const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany({ where: { role: 'PROFESSOR' } }).then(res => console.log('PROFESSORS:', res.length)).finally(() => p.$disconnect());
