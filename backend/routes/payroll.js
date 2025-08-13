import express from 'express';
import Employee from '../models/Employee.js';
import PayrollRun from '../models/PayrollRun.js';

const router = express.Router();
const INCOME_TAX_RATE = 0.15; // Keep this consistent

// @route   POST api/payroll/run
// @desc    Run payroll for a given period and save the record
router.post('/run', async (req, res) => {
    const { payPeriod, periodStart, periodEnd } = req.body;

    if (!payPeriod || !periodStart || !periodEnd) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        const employees = await Employee.find();
        if (employees.length === 0) {
            return res.status(400).json({ msg: 'No employees to run payroll for.' });
        }

        let totalGrossPay = 0;
        let totalTaxes = 0;
        let totalNetPay = 0;
        const employeeDetails = [];

        employees.forEach(emp => {
            const grossPay = (emp.hourlyRate || 0) * (emp.hoursWorked || 0);
            const taxes = grossPay * INCOME_TAX_RATE;
            const netPay = grossPay - taxes;

            totalGrossPay += grossPay;
            totalTaxes += taxes;
            totalNetPay += netPay;

            employeeDetails.push({
                employeeId: emp._id,
                employeeName: emp.employeeName,
                grossPay,
                taxes,
                netPay,
            });
        });

        const newPayrollRun = new PayrollRun({
            payPeriod,
            periodStart,
            periodEnd,
            totalGrossPay,
            totalTaxes,
            totalNetPay,
            employeeCount: employees.length,
            employeeDetails,
        });

        await newPayrollRun.save();
        res.status(201).json({ msg: 'Payroll run completed and saved successfully.', data: newPayrollRun });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;