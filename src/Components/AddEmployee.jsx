import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

const AddEmployee = ({ onNavigate }) => {
    const [employeeName, setEmployeeName] = useState('');
    const [address, setAddress] = useState('');
    const [sin, setSin] = useState('');
    const [department, setDepartment] = useState('Engineering');
    const [position, setPosition] = useState('Senior Developer');
    const [hourlyRate, setHourlyRate] = useState(0);
    const [hoursWorked, setHoursWorked] = useState(0);
    const [payPeriod, setPayPeriod] = useState('Bi-Weekly');
    const [nextPayDate, setNextPayDate] = useState(new Date());

    const handleSubmit = async (e) => {
        e.preventDefault();
        const employeeRecord = {
            employeeInfo: { employeeName, address, sin },
            companyInfo: { department, position },
            payrollInfo: { hourlyRate, hoursWorked, payPeriod, nextPayDate },
        };

        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeRecord),
            });
            if (!response.ok) throw new Error('Failed to create employee');
            alert('Employee created successfully!');
            onNavigate('Payroll');
        } catch (error) {
            console.error('Error creating employee:', error);
            alert('Failed to create employee.');
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <form onSubmit={handleSubmit}>
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Employee Record</h2>
                </header>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Employee Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                                    <input type="text" value={employeeName} onChange={e => setEmployeeName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">NI Number (SIN)</label>
                                    <input type="text" value={sin} onChange={e => setSin(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" rows="2"></textarea>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Company & Payroll Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md bg-white">
                                        <option>Engineering</option><option>Sales</option><option>HR</option><option>Marketing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <select value={position} onChange={e => setPosition(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md bg-white">
                                        <option>Senior Developer</option><option>Project Manager</option><option>UI/UX Designer</option><option>QA Tester</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                                    <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} step="0.01" className="w-full mt-1 px-3 py-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hours Worked</label>
                                    <input type="number" value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} step="0.1" className="w-full mt-1 px-3 py-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pay Period</label>
                                    <select value={payPeriod} onChange={e => setPayPeriod(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md bg-white">
                                        <option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option><option>Annually</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Next Pay Date</label>
                                    <DatePicker selected={nextPayDate} onChange={(date) => setNextPayDate(date)} className="w-full mt-1 px-3 py-2 border rounded-md" dateFormat="MM/dd/yyyy" />
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                        <button type="button" onClick={() => onNavigate('Payroll')} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
                        <button type="submit" className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700">Create Employee</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEmployee;
