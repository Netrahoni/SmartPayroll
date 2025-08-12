import React, { useState, useEffect } from 'react';

// --- Placeholder Tax & Deduction Rates (adjust as needed) ---
const INCOME_TAX_RATE = 0.15; // 15%
const EI_RATE = 0.0158; // 1.58%
const CPP_RATE = 0.0595; // 5.95%

const AddEmployee = ({ onCancel }) => {
    // --- State for Form Inputs ---
    const [employeeName, setEmployeeName] = useState('');
    const [address, setAddress] = useState('');
    const [sin, setSin] = useState('');
    const [department, setDepartment] = useState('Engineering');
    const [position, setPosition] = useState('Senior Developer');
    const [hourlyRate, setHourlyRate] = useState(0);
    const [hoursWorked, setHoursWorked] = useState(0);
    const [itemizedDeductions, setItemizedDeductions] = useState([]);

    // --- State for Calculated Payroll Summary ---
    const [summary, setSummary] = useState({
        grossPay: 0,
        incomeTax: 0,
        employmentInsurance: 0,
        cpp: 0,
        totalItemizedDeductions: 0,
        totalTaxes: 0,
        netPay: 0,
    });

    // --- Real-time Payroll Calculation ---
    useEffect(() => {
        const rate = parseFloat(hourlyRate) || 0;
        const hours = parseFloat(hoursWorked) || 0;
        const grossPay = rate * hours;

        const incomeTax = grossPay * INCOME_TAX_RATE;
        const employmentInsurance = grossPay * EI_RATE;
        const cpp = grossPay * CPP_RATE;
        const totalTaxes = incomeTax + employmentInsurance + cpp;

        const totalItemized = itemizedDeductions.reduce((total, ded) => total + (parseFloat(ded.amount) || 0), 0);
        
        const netPay = grossPay - totalTaxes - totalItemized;

        setSummary({
            grossPay,
            incomeTax,
            employmentInsurance,
            cpp,
            totalItemizedDeductions: totalItemized,
            totalTaxes,
            netPay,
        });

    }, [hourlyRate, hoursWorked, itemizedDeductions]);


    // --- Functions to handle dynamic deductions ---
    const addDeduction = () => {
        setItemizedDeductions([...itemizedDeductions, { name: '', amount: '' }]);
    };

    const handleDeductionChange = (index, field, value) => {
        const updatedDeductions = [...itemizedDeductions];
        updatedDeductions[index][field] = value;
        setItemizedDeductions(updatedDeductions);
    };
    
    const removeDeduction = (index) => {
        const updatedDeductions = itemizedDeductions.filter((_, i) => i !== index);
        setItemizedDeductions(updatedDeductions);
    };

    // --- Form Submission ---
    const handleSubmit = (e) => {
        e.preventDefault();
        const employeeRecord = {
            employeeInfo: { employeeName, address, sin },
            companyInfo: { department, position },
            payrollInfo: { hourlyRate, hoursWorked, itemizedDeductions },
            summary,
        };
        console.log("Creating Employee Record:", employeeRecord);
        alert(`${employeeName} has been created!`);
        // onCancel(); // Optionally close the form on creation
    };
    
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
             <form onSubmit={handleSubmit}>
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Employee Record</h2>
                    <div className="flex gap-4">
                        <button type="button" onClick={onCancel} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Create Employee</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Side: Input Form --- */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6">
                        {/* Employee Information */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Employee Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                                    <input type="text" value={employeeName} onChange={e => setEmployeeName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" required/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" rows="2"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">NI Number (SIN)</label>
                                    <input type="text" value={sin} onChange={e => setSin(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" required/>
                                </div>
                            </div>
                        </section>

                        {/* Company & Payroll Information */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Company & Payroll</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md bg-white">
                                        <option>Engineering</option>
                                        <option>Sales</option>
                                        <option>HR</option>
                                        <option>Marketing</option>
                                        <option>Unassigned</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <select value={position} onChange={e => setPosition(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md bg-white">
                                        <option>Senior Developer</option>
                                        <option>Project Manager</option>
                                        <option>UI/UX Designer</option>
                                        <option>QA Tester</option>
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
                            </div>
                        </section>

                        {/* Itemized Deductions */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Itemized Deductions</h3>
                            <div className="space-y-3">
                                {itemizedDeductions.map((deduction, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" placeholder="Deduction Name" value={deduction.name} onChange={e => handleDeductionChange(index, 'name', e.target.value)} className="w-2/3 px-3 py-2 border rounded-md" />
                                        <input type="number" placeholder="Amount ($)" value={deduction.amount} onChange={e => handleDeductionChange(index, 'amount', e.target.value)} className="w-1/3 px-3 py-2 border rounded-md" />
                                        <button type="button" onClick={() => removeDeduction(index)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addDeduction} className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold">+ Add Deduction</button>
                        </section>
                    </div>

                    {/* --- Right Side: Summary --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                             <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Current Period Summary</h3>
                             <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-600">Gross Pay:</span> <span>{formatCurrency(summary.grossPay)}</span></div>
                                <hr className="my-2"/>
                                <div className="flex justify-between"><span className="text-gray-600">Income Tax:</span> <span className="text-red-600">{formatCurrency(summary.incomeTax)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Employment Insurance:</span> <span className="text-red-600">{formatCurrency(summary.employmentInsurance)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">CPP:</span> <span className="text-red-600">{formatCurrency(summary.cpp)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Itemized Deductions:</span> <span className="text-red-600">{formatCurrency(summary.totalItemizedDeductions)}</span></div>
                                <hr className="my-2"/>
                                <div className="flex justify-between font-semibold"><span className="text-gray-600">Total Taxes & Deductions:</span> <span className="text-red-600">{formatCurrency(summary.totalTaxes + summary.totalItemizedDeductions)}</span></div>
                                <hr className="my-2 border-t-2 border-gray-300"/>
                                <div className="flex justify-between text-lg font-bold text-gray-800"><span>Net Pay:</span> <span className="text-green-600">{formatCurrency(summary.netPay)}</span></div>
                             </div>
                        </div>
                    </div>
                </div>
             </form>
        </div>
    );
};

export default AddEmployee;