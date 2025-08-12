import express from 'express'; // Changed this line
import Employee from '../models/Employee.js'; // Changed this line

const router = express.Router();

// POST route (no changes needed inside)
router.post('/', async (req, res) => {
    try {
        const newEmployee = new Employee({
            employeeName: req.body.employeeInfo.employeeName,
            address: req.body.employeeInfo.address,
            sin: req.body.employeeInfo.sin,
            department: req.body.companyInfo.department,
            position: req.body.companyInfo.position,
            hourlyRate: req.body.payrollInfo.hourlyRate,
            hoursWorked: req.body.payrollInfo.hoursWorked,
        });
        const employee = await newEmployee.save();
        res.status(201).json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET route (no changes needed inside)
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router; // Changed this line