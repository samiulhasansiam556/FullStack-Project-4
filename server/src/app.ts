import express from 'express'
import userRoute from './routes/userRoute';
import cors from 'cors';


const app = express();


app.use(express.json());
app.use(cors())

app.use('/api/user', userRoute);




export default app;

