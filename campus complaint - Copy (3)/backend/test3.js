const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany().then(r => console.log('TOTAL USERS:', r.length, '\\nROLES:', r.reduce((acc, curr) => { acc[curr.role] = (acc[curr.role] || 0) + 1; return acc; }, {}))).finally(() => p.$disconnect());
