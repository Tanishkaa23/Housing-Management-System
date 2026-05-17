import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import flatRoutes from './routes/flatRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sosRoutes from './routes/sosRoutes.js';
import lostFoundRoutes from './routes/lostFoundRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'SocietySync API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/flats', flatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
