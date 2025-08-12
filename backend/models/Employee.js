import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    employeeName: { type: String, required: true },
    address: { type: String },
    sin: { type: String, required: true },
    department: { type: String },
    position: { type: String },
    hourlyRate: { type: Number, default: 0 },
    hoursWorked: { type: Number, default: 0 },
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee; // Changed this line