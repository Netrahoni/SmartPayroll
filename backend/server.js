import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import employeeRoutes from './routes/employees.js';
import payrollRoutes from './routes/payroll.js';
import taskRoutes from './routes/tasks.js';
import reportRoutes from './routes/reports.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js'; // 1. Import the new route

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes); // 2. Add this line

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));