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

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

app.get('/', (req, res) => {
  res.send('Anonymous Feedback API Running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
