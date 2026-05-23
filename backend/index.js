import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import transformRoute from './routes/transform.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', transformRoute);

app.get('/', (req, res) => {
  res.json({
    message: 'NeuroLearn backend is running!'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});