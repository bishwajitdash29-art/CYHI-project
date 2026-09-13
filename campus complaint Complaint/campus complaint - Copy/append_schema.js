const fs = require('fs');
const filepath = 'backend/prisma/schema.prisma';
let content = fs.readFileSync(filepath, 'utf-8');

const newModels = 
model Election {
  id          Int      @id @default(autoincrement())
  title       String
  status      String   @default("UPCOMING") // UPCOMING, ACTIVE, CLOSED
  startTime   DateTime?
  endTime     DateTime?
  candidates  Candidate[]
  voters      EligibleVoter[]
  createdAt   DateTime @default(now())
}

model Candidate {
  id          Int      @id @default(autoincrement())
  name        String
  manifesto   String
  electionId  Int
  election    Election @relation(fields: [electionId], references: [id], onDelete: Cascade)
  votesCount  Int      @default(0)
}

model EligibleVoter {
  id          Int      @id @default(autoincrement())
  studentId   String   // The student's username/rollno
  electionId  Int
  election    Election @relation(fields: [electionId], references: [id], onDelete: Cascade)
  hasVoted    Boolean  @default(false)
  
  @@unique([studentId, electionId])
}
;

if (!content.includes('model Election')) {
    fs.appendFileSync(filepath, newModels);
    console.log("Successfully appended Election models to schema.prisma");
} else {
    console.log("Models already exist in schema.prisma");
}
