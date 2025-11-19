import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/mongodb';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in the environment');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment');
}

void connectDB(mongoUri);

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, World! Your server is running.');
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
