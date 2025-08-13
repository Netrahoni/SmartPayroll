import mongoose from 'mongoose';

const payrollRunSchema = new mongoose.Schema({
    payPeriod: { type: String, required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    totalGrossPay: { type: Number, required: true },
    totalTaxes: { type: Number, required: true },
    totalNetPay: { type: Number, required: true },
    employeeCount: { type: Number, required: true },
    employeeDetails: [
        {
            employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
            employeeName: String,
            grossPay: Number,
            taxes: Number,
            netPay: Number,
        }
    ]
}, { timestamps: true });

const PayrollRun = mongoose.model('PayrollRun', payrollRunSchema);

export default PayrollRun;