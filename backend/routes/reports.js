import express from 'express';
import Employee from '../models/Employee.js';
import { startOfYear, endOfYear, subQuarters, startOfQuarter, endOfQuarter } from 'date-fns';

const router = express.Router();

// @route   POST api/reports/payroll-summary
// @desc    Generate an aggregated payroll summary for a date range
router.post('/payroll-summary', async (req, res) => {
    const { period } = req.body;
    let startDate, endDate;
    const now = new Date();

    // Determine the date range based on the selected period
    switch (period) {
        case 'last-quarter':
            const lastQuarter = subQuarters(now, 1);
            startDate = startOfQuarter(lastQuarter);
            endDate = endOfQuarter(lastQuarter);
            break;
        case 'this-year':
        default:
            startDate = startOfYear(now);
            endDate = endOfYear(now);
            break;
    }

    try {
        // In a real application, you would query historical payroll records.
        // For this example, we'll use the current employee data as a stand-in.
        const employees = await Employee.find({
            // This filter assumes you want to report on employees created in the period.
            // You can adjust this logic as needed.
            createdAt: { $gte: startDate, $lte: endDate }
        });

        let totalGrossPay = 0;
        let totalTaxes = 0;
        let totalNetPay = 0;
        const departmentCosts = {};

        employees.forEach(emp => {
            const gross = (emp.basicSalary || 0);
            const taxes = (emp.taxPayment || 0);
            const net = (emp.netPay || 0);

            totalGrossPay += gross;
            totalTaxes += taxes;
            totalNetPay += net;

            departmentCosts[emp.department] = (departmentCosts[emp.department] || 0) + gross;
        });

        res.json({
            totalGrossPay,
            totalTaxes,
            totalNetPay,
            employeeCount: employees.length,
            departmentCosts,
            period: {
                start: startDate,
                end: endDate,
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
