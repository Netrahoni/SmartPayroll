import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import Icon from './Icon';
import { ICONS } from '../icons';

// PDF and Date Picker Libraries
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

// A custom component to make the DatePicker look like the info card
const CustomDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="text-lg font-bold text-gray-800 bg-transparent text-left w-full" onClick={onClick} ref={ref}>
        {value}
    </button>
));

const Payroll = ({ onNavigate }) => {
    // --- STATE MANAGEMENT ---
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [payPeriodFilter, setPayPeriodFilter] = useState('All Periods');
    const [nextPayDate, setNextPayDate] = useState(new Date());
    const INCOME_TAX_RATE = 0.15;
    const CPP_RATE = 0.0595;
    const EI_RATE = 0.0158;

    // --- DATA FETCHING ---
    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/employees');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // --- DYNAMIC FILTERING LOGIC ---
    const filteredEmployees = useMemo(() => {
        if (!searchQuery && payPeriodFilter === 'All Periods') return employees;
        return employees.filter(emp => {
            const matchesPayPeriod = payPeriodFilter === 'All Periods' || emp.payPeriod === payPeriodFilter;
            const matchesSearch = searchQuery === "" ||
                emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.position.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesPayPeriod && matchesSearch;
        });
    }, [employees, payPeriodFilter, searchQuery]);


    // --- PAYROLL & PDF FUNCTIONS ---
    const handleRunPayroll = () => alert("This would start the payroll calculation process.");

    const handleDownloadFullReport = () => {
        if (filteredEmployees.length === 0) return alert("No employees to generate a report.");
        alert("Generating full payroll PDF report...");
        
        const doc = new jsPDF();
        const tableColumn = ["ID", "Employee", "Position", "Gross Pay", "Taxes", "Net Pay"];
        const tableRows = [];
        let totalGross = 0, totalTaxes = 0, totalNet = 0;

        filteredEmployees.forEach(emp => {
            const grossPay = (emp.hourlyRate || 0) * (emp.hoursWorked || 0);
            const taxes = grossPay * (INCOME_TAX_RATE + CPP_RATE + EI_RATE);
            const netPay = grossPay - taxes;
            totalGross += grossPay;
            totalTaxes += taxes;
            totalNet += netPay;
            tableRows.push([ emp._id.slice(-6).toUpperCase(), emp.employeeName, emp.position, formatCurrency(grossPay), formatCurrency(taxes), formatCurrency(netPay) ]);
        });

        doc.setFontSize(18);
        doc.text("SmartPayroll - Full Payroll Report", 14, 22);
        
        autoTable(doc, { startY: 50, head: [tableColumn], body: tableRows });

        const finalY = (doc).lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.text("Payroll Summary", 14, finalY + 15);
        doc.text(`Total Gross Pay: ${formatCurrency(totalGross)}`, 14, finalY + 22);
        
        doc.save(`Payroll-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };

    const handleGeneratePayStub = (employee) => {
        if (!employee) return alert("Cannot generate stub for an invalid employee.");
        alert(`Generating pay stub for ${employee.employeeName}...`);
        
        const doc = new jsPDF();
        const grossPay = (employee.hourlyRate || 0) * (employee.hoursWorked || 0);
        const incomeTax = grossPay * INCOME_TAX_RATE;
        const cpp = grossPay * CPP_RATE;
        const ei = grossPay * EI_RATE;
        const totalTaxes = incomeTax + cpp + ei;
        const netPay = grossPay - totalTaxes;

        // Header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("SmartPayroll Inc.", 14, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("123 Payroll Lane, Toronto, ON, M5V 2T6", 14, 26);

        // Pay Stub Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Pay Stub Detail", 150, 40);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`PAY DATE: ${format(nextPayDate, 'MM/dd/yyyy')}`, 150, 46);
        doc.text(`NET PAY: ${formatCurrency(netPay)}`, 150, 52);

        // Employee & Pay Period Info
        doc.line(14, 60, 200, 60); // horizontal line
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("EMPLOYEE", 14, 68);
        doc.setFont('helvetica', 'normal');
        doc.text(employee.employeeName, 14, 74);
        doc.text(employee.address || 'No address on file', 14, 80);
        
        doc.setFont('helvetica', 'bold');
        doc.text("PAY PERIOD", 120, 68);
        doc.setFont('helvetica', 'normal');
        doc.text(`Period: ${employee.payPeriod}`, 120, 74);
        doc.text(`Total Hours: ${(employee.hoursWorked || 0).toFixed(2)}`, 120, 80);
        doc.line(14, 90, 200, 90);

        // Earnings & Taxes Tables
        autoTable(doc, {
            startY: 95,
            head: [['Earnings', 'Rate', 'Hours', 'Current']],
            body: [['Regular Pay', formatCurrency(employee.hourlyRate), (employee.hoursWorked || 0).toFixed(2), formatCurrency(grossPay)]],
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });

        autoTable(doc, {
            startY: (doc).lastAutoTable.finalY + 5,
            head: [['Taxes', 'Current']],
            body: [['Income Tax', formatCurrency(incomeTax)], ['Canada Pension Plan (CPP)', formatCurrency(cpp)], ['Employment Insurance (EI)', formatCurrency(ei)]],
            theme: 'striped',
            headStyles: { fillColor: [231, 76, 60] }
        });

        autoTable(doc, {
            startY: (doc).lastAutoTable.finalY + 10,
            body: [['Gross Pay', formatCurrency(grossPay)], ['Total Taxes', `-${formatCurrency(totalTaxes)}`], ['Net Pay', formatCurrency(netPay)]],
            theme: 'plain',
            styles: { cellPadding: 2, fontSize: 10 },
            columnStyles: { 0: { fontStyle: 'bold' } },
            margin: { left: 130 }
        });

        doc.save(`Pay-Stub-${employee.employeeName.replace(' ', '-')}.pdf`);
    };

    // --- (The rest of the component remains the same) ---
    const handleDelete = async (employeeId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`http://localhost:5000/api/employees/${employeeId}`, { method: 'DELETE' });
            fetchEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };
    const handleEdit = (employeeId) => onNavigate('EditEmployee', employeeId);
    const formatCurrency = (amount) => `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="p-8">
            <PageHeader
                title="Canadian Payroll System"
                action={
                    <div className="flex items-center space-x-4">
                        <button onClick={() => onNavigate('AddEmployee')} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
                            <Icon path={ICONS.add} className="w-5 h-5 mr-2" />Add Employee
                        </button>
                        <button onClick={fetchEmployees} className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600">
                            <Icon path={ICONS.refresh} className="w-5 h-5" />Refresh
                        </button>
                    </div>
                }
            />
            
            <Card className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Payroll Processing</h2>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <button onClick={handleRunPayroll} className="flex items-center bg-blue-500 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-600"><Icon path={ICONS.play} className="w-5 h-5 mr-2" />Run Payroll</button>
                        <button onClick={handleDownloadFullReport} className="flex items-center bg-red-500 text-white px-5 py-2.5 rounded-lg shadow hover:bg-red-600"><Icon path={ICONS.pdf} className="w-5 h-5 mr-2" />Full Payroll PDF</button>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4"><Icon path={ICONS.calendar} className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm text-gray-500">Filter by Pay Period</p>
                                <select value={payPeriodFilter} onChange={e => setPayPeriodFilter(e.target.value)} className="text-lg font-bold text-gray-800 bg-transparent -ml-1 border-none focus:ring-0">
                                    <option>All Periods</option>
                                    <option>Weekly</option>
                                    <option>Bi-Weekly</option>
                                    <option>Monthly</option>
                                    <option>Annually</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4"><Icon path={ICONS.clock} className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm text-gray-500">Next Pay Date</p>
                                <DatePicker
                                    selected={nextPayDate}
                                    onChange={(date) => setNextPayDate(date)}
                                    dateFormat="MMM dd, yyyy"
                                    customInput={<CustomDatePickerInput />}
                                />
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4"><Icon path={ICONS.group} className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm text-gray-500">Total Employees</p>
                                <p className="text-lg font-bold text-gray-800">{employees.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Employee Payroll Records</h2>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon path={ICONS.search} className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase">
                                <th className="py-3 px-4 font-semibold">Employee</th>
                                <th className="py-3 px-4 font-semibold">ID</th>
                                <th className="py-3 px-4 font-semibold">Position</th>
                                <th className="py-3 px-4 font-semibold">Gross Pay</th>
                                <th className="py-3 px-4 font-semibold">Taxes</th>
                                <th className="py-3 px-4 font-semibold">Net Pay</th>
                                <th className="py-3 px-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-10">Loading...</td></tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-10">No employees match the current filters.</td></tr>
                            ) : (
                                filteredEmployees.map((emp) => {
                                    const grossPay = (emp.hourlyRate || 0) * (emp.hoursWorked || 0);
                                    const taxes = grossPay * (INCOME_TAX_RATE + CPP_RATE + EI_RATE);
                                    const netPay = grossPay - taxes;
                                    return (
                                        <tr key={emp._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-4 px-4 font-medium">{emp.employeeName}</td>
                                            <td className="py-4 px-4">{emp._id.slice(-6).toUpperCase()}</td>
                                            <td className="py-4 px-4">{emp.position}</td>
                                            <td className="py-4 px-4">{formatCurrency(grossPay)}</td>
                                            <td className="py-4 px-4 text-red-600">{formatCurrency(taxes)}</td>
                                            <td className="py-4 px-4 font-bold text-green-600">{formatCurrency(netPay)}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button onClick={() => handleGeneratePayStub(emp)} className="text-gray-500 hover:text-yellow-600" title="Download Pay Stub"><Icon path={ICONS.pdf} className="w-5 h-5" /></button>
                                                    <button onClick={() => handleEdit(emp._id)} className="text-gray-500 hover:text-blue-500" title="Edit"><Icon path={ICONS.edit} className="w-5 h-5" /></button>
                                                    <button onClick={() => handleDelete(emp._id)} className="text-gray-500 hover:text-red-500" title="Delete"><Icon path={ICONS.delete} className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Payroll;
