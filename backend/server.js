import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'; // 1. Imports the new DB connection function
import employeeRoutes from './routes/employees.js';
import payrollRoutes from './routes/payroll.js'; // 2. Imports the payroll routes

const app = express();

// 3. Connects to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes); // 4. Tells the server to use the payroll routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
