import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {connectDB} from './lib/db.js'
import User from './models/user.model.js';

dotenv.config();
const PORT = process.env.port
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


app.listen(PORT, () => {
    console.log('Server is running on port: '+PORT);
    connectDB();
    });