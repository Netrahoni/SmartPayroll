import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST a new employee
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
            payPeriod: req.body.payrollInfo.payPeriod,
            nextPayDate: req.body.payrollInfo.nextPayDate,
        });
        const employee = await newEmployee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET a single employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE an employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        res.json({ msg: 'Employee removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT (update) an employee
router.put('/:id', async (req, res) => {
    const { employeeName, address, sin, department, position, hourlyRate, hoursWorked, payPeriod, nextPayDate } = req.body;
    try {
        let employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        
        employee.employeeName = employeeName;
        employee.address = address;
        employee.sin = sin;
        employee.department = department;
        employee.position = position;
        employee.hourlyRate = hourlyRate;
        employee.hoursWorked = hoursWorked;
        employee.payPeriod = payPeriod;
        employee.nextPayDate = nextPayDate;

        await employee.save();
        res.json(employee);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;
