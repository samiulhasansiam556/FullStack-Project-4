import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'
import adminRoutes from "./routes/adminRoutes";
import testRoutes from "./routes/testRoutes";


import cors from 'cors';
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes)


export default app;

