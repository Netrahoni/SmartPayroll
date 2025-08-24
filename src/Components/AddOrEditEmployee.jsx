import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Icon } from './Icon.jsx';
import { ICONS } from '../icons.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

const AddOrEditEmployee = ({ onNavigate, employeeId }) => {
    const { addNotification } = useNotifications();
    const initialEmployeeState = {
        employeeName: '', address: '', postalCode: '', gender: 'Male',
        department: 'Engineering', position: 'Senior Developer', payPeriod: 'Monthly', nextPayDate: new Date(),
        basicSalary: 0, otherPayment: 0, overtimeHours: 0, hourlyRate: 0, studentLoan: 0,
        taxCode: '1257L', sin: '', niCode: 'A',
        taxablePay: 0, pensionPay: 0, niPayment: 0, taxPayment: 0, netPay: 0,
        status: 'Active',
    };

    const [employeeData, setEmployeeData] = useState(initialEmployeeState);
    const [isEditMode, setIsEditMode] = useState(false);
    const [allEmployees, setAllEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(employeeId || '');

    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                const response = await fetch('/api/employees');
                const data = await response.json();
                setAllEmployees(data);
            } catch (error) {
                console.error("Failed to fetch employees for dropdown:", error);
            }
        };
        fetchAllEmployees();

        if (employeeId) {
            setIsEditMode(true);
            const fetchEmployee = async () => {
                try {
                    const response = await fetch(`/api/employees/${employeeId}`);
                    const data = await response.json();
                    setEmployeeData({ ...initialEmployeeState, ...data, nextPayDate: new Date(data.nextPayDate) });
                } catch (error) {
                    console.error("Failed to fetch employee:", error);
                }
            };
            fetchEmployee();
        } else {
            setIsEditMode(false);
            setEmployeeData(initialEmployeeState);
        }
    }, [employeeId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setEmployeeData(prev => ({ ...prev, nextPayDate: date }));
    };
    
    const handleDisplayData = (e) => {
        const selectedId = e.target.value;
        onNavigate('AddOrEditEmployee', selectedId);
    };

    const handleCalculatePay = () => {
        const grossPay = parseFloat(employeeData.basicSalary) + parseFloat(employeeData.otherPayment) + (parseFloat(employeeData.overtimeHours) * parseFloat(employeeData.hourlyRate));
        const taxable = grossPay > 12570 / 12 ? grossPay - (12570 / 12) : 0;
        const tax = taxable * 0.20;
        const ni = grossPay > 1048 ? (grossPay - 1048) * 0.12 : 0;
        const pension = grossPay * 0.05;
        const net = grossPay - tax - ni - pension - parseFloat(employeeData.studentLoan);

        setEmployeeData(prev => ({
            ...prev,
            taxablePay: grossPay.toFixed(2),
            pensionPay: pension.toFixed(2),
            niPayment: ni.toFixed(2),
            taxPayment: tax.toFixed(2),
            netPay: net.toFixed(2),
        }));
        addNotification("Payroll calculated successfully for the current view.");
    };

    const handleSaveRecord = async () => {
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode
            ? `/api/employees/${employeeId}`
            : '/api/employees';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to save record');
            }
            const successMessage = `Employee record for ${employeeData.employeeName} ${isEditMode ? 'updated' : 'saved'}.`;
            addNotification(successMessage);
            onNavigate('Payroll');
        } catch (error) {
            addNotification(`Error: ${error.message}`);
        }
    };

    const handleReset = () => {
        if (isEditMode) {
            const fetchEmployee = async () => {
                const response = await fetch(`/api/employees/${employeeId}`);
                const data = await response.json();
                setEmployeeData({ ...initialEmployeeState, ...data, nextPayDate: new Date(data.nextPayDate) });
            };
            fetchEmployee();
        } else {
            setEmployeeData(initialEmployeeState);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    {isEditMode ? 'Automatic Payroll System' : 'Add New Employee Record'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isEditMode ? `Editing details for ${employeeData.employeeName}` : 'Fill in the details to create a new employee.'}
                </p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md space-y-8">
                    {/* Employee Information */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Employee Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select onChange={handleDisplayData} value={selectedEmployeeId} className="md:col-span-3 p-2 border rounded-md bg-gray-50">
                                <option value="">-- Select an Employee to Display/Edit --</option>
                                {allEmployees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.employeeName}</option>
                                ))}
                            </select>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Employee Name</label>
                                <input type="text" name="employeeName" value={employeeData.employeeName} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Address</label>
                                <input type="text" name="address" value={employeeData.address} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Postal Code</label>
                                <input type="text" name="postalCode" value={employeeData.postalCode} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Gender</label>
                                <select name="gender" value={employeeData.gender} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600">Status</label>
                                <select name="status" value={employeeData.status} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                    <option>Active</option><option>On Leave</option>
                                </select>
                            </div>
                        </div>
                    </section>
                    
                    {/* Company & Payroll Details */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Company & Payroll Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Department</label>
                                <select name="department" value={employeeData.department} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                    <option>Engineering</option><option>Sales</option><option>HR</option><option>Marketing</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Position</label>
                                <select name="position" value={employeeData.position} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                    <option>Senior Developer</option><option>Project Manager</option><option>UI/UX Designer</option><option>QA Tester</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Hourly Rate ($)</label>
                                <input type="number" name="hourlyRate" value={employeeData.hourlyRate} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Hours Worked</label>
                                <input type="number" name="hoursWorked" value={employeeData.hoursWorked} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Pay Period</label>
                                <select name="payPeriod" value={employeeData.payPeriod} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                                    <option>Per Day</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                    <option>Annually</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Next Pay Date</label>
                                <DatePicker selected={employeeData.nextPayDate} onChange={handleDateChange} className="w-full mt-1 p-2 border rounded-md" dateFormat="MM/dd/yyyy" />
                            </div>
                        </div>
                    </section>

                    {/* Wages & Deductions */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Wages & Deductions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Basic Salary ($)</label>
                                <input type="number" name="basicSalary" value={employeeData.basicSalary} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Other Payment ($)</label>
                                <input type="number" name="otherPayment" value={employeeData.otherPayment} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Overtime (Hrs)</label>
                                <input type="number" name="overtimeHours" value={employeeData.overtimeHours} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Student Loan ($)</label>
                                <input type="number" name="studentLoan" value={employeeData.studentLoan} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                        </div>
                    </section>

                    {/* Payroll Calculation */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Payroll Calculation</h3>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Tax Period</label>
                                <DatePicker
                                    selected={employeeData.nextPayDate}
                                    onChange={handleDateChange}
                                    className="w-full mt-1 p-2 border rounded-md"
                                    dateFormat="MMMM yyyy"
                                    showMonthYearPicker
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Tax Code</label>
                                <input type="text" name="taxCode" value={employeeData.taxCode} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">SIN</label>
                                <input type="text" name="sin" value={employeeData.sin} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">NI Code</label>
                                <input type="text" name="niCode" value={employeeData.niCode} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <label className="block text-sm font-medium text-gray-600">Taxable Pay</label>
                                <p className="text-lg font-semibold">${employeeData.taxablePay}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <label className="block text-sm font-medium text-gray-600">Pension Pay</label>
                                <p className="text-lg font-semibold">${employeeData.pensionPay}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <label className="block text-sm font-medium text-gray-600">NI Payment</label>
                                <p className="text-lg font-semibold">${employeeData.niPayment}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-md">
                                <label className="block text-sm font-medium text-green-800">Net Pay</label>
                                <p className="text-xl font-bold text-green-600">${employeeData.netPay}</p>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-8 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Actions</h3>
                        <button onClick={handleCalculatePay} className="w-full flex items-center justify-center p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Calculate Pay</button>
                        <button onClick={handleSaveRecord} className="w-full flex items-center justify-center p-3 bg-green-500 text-white rounded-md hover:bg-green-600">{isEditMode ? 'Update Record' : 'Save Record'}</button>
                        <button onClick={handleReset} className="w-full flex items-center justify-center p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600">Reset Form</button>
                        <button onClick={() => onNavigate('Payroll')} className="w-full flex items-center justify-center p-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mt-4">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOrEditEmployee;