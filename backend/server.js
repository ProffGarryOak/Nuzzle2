import express from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})