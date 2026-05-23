import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import transformRoutes from './routes/transform.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', transformRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});