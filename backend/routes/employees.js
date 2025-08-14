import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST a new employee (UPDATED with validation)
router.post('/', async (req, res) => {
    // Basic validation to ensure required fields are present
    if (!req.body.employeeName || !req.body.sin) {
        return res.status(400).json({ msg: 'Employee Name and SIN are required.' });
    }
    try {
        const newEmployee = new Employee(req.body);
        const employee = await newEmployee.save();
        res.status(201).json(employee);
    } catch (err) {
        console.error(`Error creating employee: ${err.message}`);
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

// PUT (update) an employee
router.put('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

export default router;
