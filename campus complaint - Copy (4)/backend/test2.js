const staffText = `
Prof. Bhartendu K. Singh Natural Sciences Professor & Director Physics of Particles and Nuclei director@iiitdmj.ac.in
Prof. Vijay Kumar Gupta Mechanical Engineering Professor (Dean Academic) Energy Harvesting, Smart Structures, MEMS vkgupta@iiitdmj.ac.in
Mr. Santosh Mahobia Administration Deputy Registrar Academic Office Administration santosh@iiitdmj.ac.in
Dr. Pushpa Raikwal Electronics & Comm. Engineering Assistant Professor Memory Design, VLSI System Design pushpa@iiitdmj.ac.in
`;

const staffLines = staffText.split('\n').filter(l => l.trim().length > 0);
for (const line of staffLines) {
    const parts = line.split(' ');
    let email = parts[parts.length - 1];
    
    const stopWords = ['Natural', 'Mechanical', 'Administration', 'Computer', 'Electronics', 'Design'];
    let nameParts = [];
    for (let part of parts) {
        if (stopWords.includes(part)) break;
        nameParts.push(part);
    }
    let name = nameParts.join(' ').trim();

    if (!email.includes('@')) {
       email = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@iiitdmj.ac.in';
    }

    let role = 'PROFESSOR';
    if (name.includes('Santosh Mahobia')) role = 'FIC';
    if (name.includes('Amrita')) role = 'SAC';
    if (name.includes('Yashpal')) role = 'MESS';

    console.log(`Inserting: ${name} with email ${email} and role ${role}`);
}
