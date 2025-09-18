import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'
import cors from 'cors';
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

export default app;

