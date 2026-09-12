const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPass = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { username: 'dr_smith' },
    update: {},
    create: {
      username: 'dr_smith',
      password: hashedPass,
      name: 'Dr. John Smith',
      role: 'PROFESSOR'
    }
  });

  await prisma.user.upsert({
    where: { username: 'dr_jones' },
    update: {},
    create: {
      username: 'dr_jones',
      password: hashedPass,
      name: 'Dr. Alice Jones',
      role: 'PROFESSOR'
    }
  });

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPass,
      name: 'Committee Admin',
      role: 'COMMITTEE'
    }
  });

  console.log('Database seeded with professors (dr_smith, dr_jones) and committee (admin) - password: password123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
