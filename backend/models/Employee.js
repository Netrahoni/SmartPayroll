import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    // Employee Information
    employeeName: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    
    // Employee Status
    status: { type: String, enum: ['Active', 'On Leave'], default: 'Active' },

    // Company & Position
    department: { type: String, trim: true },
    position: { type: String, trim: true },
    payPeriod: { type: String, default: 'Monthly' },
    nextPayDate: { type: Date, default: () => new Date() },

    // Wages & Deductions (Inputs)
    basicSalary: { type: Number, default: 0, min: 0 },
    otherPayment: { type: Number, default: 0, min: 0 },
    overtimeHours: { type: Number, default: 0, min: 0 },
    hourlyRate: { type: Number, default: 0, min: 0 },
    studentLoan: { type: Number, default: 0, min: 0 },

    // Payroll Calculation (Inputs/Codes)
    taxCode: { type: String, default: '1257L', trim: true },
    sin: { type: String, required: true, trim: true }, // Using 'sin' for NI Number
    niCode: { type: String, default: 'A', trim: true },

    // Payroll Calculation (Calculated Outputs)
    taxablePay: { type: Number, default: 0 },
    pensionPay: { type: Number, default: 0 },
    niPayment: { type: Number, default: 0 },
    taxPayment: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 },

}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
