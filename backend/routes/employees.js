import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// @route   GET api/employees
// @desc    Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/employees
// @desc    Create a new employee
router.post('/', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const employee = await newEmployee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/employees/:id
// @desc    Get a single employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/employees/:id
// @desc    Update an employee
router.put('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/employees/:id
// @desc    Delete an employee
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