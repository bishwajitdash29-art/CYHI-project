const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const proposalRoutes = require('./routes/proposals');
const electionRoutes = require('./routes/elections');

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/elections', electionRoutes);

app.get('/', (req, res) => {
  res.send('Anonymous Feedback API Running');
});

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
