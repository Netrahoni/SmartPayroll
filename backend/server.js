import express from 'express';         // Changed this line
import mongoose from 'mongoose';       // Changed this line
import cors from 'cors';               // Changed this line
import employeeRoutes from './routes/employees.js'; // Changed this line

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Config
const MONGO_URI = 'mongodb://localhost:27017/smartpayroll';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use Routes
app.use('/api/employees', employeeRoutes); // Changed this line

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));