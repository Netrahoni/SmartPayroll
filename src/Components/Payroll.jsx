import React, { useState, useCallback, useMemo } from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import { Icon } from './Icon.jsx';
import { ICONS } from '../icons.jsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { useNotifications } from '../context/NotificationContext.jsx';

const CustomDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="text-lg font-bold text-gray-800 bg-transparent text-left w-full" onClick={onClick} ref={ref}>
        {value}
    </button>
));

const Payroll = ({ onNavigate, employees, fetchEmployees, globalSearchQuery }) => {
    const { addNotification } = useNotifications();
    const [loading, setLoading] = useState(false);
    const [payPeriodFilter, setPayPeriodFilter] = useState('All Periods');
    const [nextPayDate, setNextPayDate] = useState(new Date());

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesPayPeriod = payPeriodFilter === 'All Periods' || emp.payPeriod === payPeriodFilter;
            const matchesSearch = globalSearchQuery === "" ||
                emp.employeeName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                emp.position.toLowerCase().includes(globalSearchQuery.toLowerCase());
            return matchesPayPeriod && matchesSearch;
        });
    }, [employees, payPeriodFilter, globalSearchQuery]);

    const handleRunPayroll = () => addNotification("Payroll run process initiated for the selected period.");

    const handleDownloadFullReport = () => {
        if (filteredEmployees.length === 0) {
            addNotification("No employees match filters to generate a report.", "warning");
            return;
        }
        addNotification("Generating full payroll PDF report...");
        
        const doc = new jsPDF();
        const tableColumn = ["ID", "Employee", "Position", "Gross Pay", "Taxes", "Net Pay"];
        const tableRows = [];
        let totalGross = 0, totalTaxes = 0, totalNet = 0;

        filteredEmployees.forEach(emp => {
            const grossPay = (emp.basicSalary || 0);
            const taxes = (emp.taxPayment || 0);
            const netPay = (emp.netPay || 0);
            totalGross += grossPay;
            totalTaxes += taxes;
            totalNet += netPay;
            tableRows.push([
                emp._id.slice(-6).toUpperCase(),
                emp.employeeName,
                emp.position,
                formatCurrency(grossPay),
                formatCurrency(taxes),
                formatCurrency(netPay),
            ]);
        });

        doc.setFontSize(18);
        doc.text("SmartPayroll - Full Payroll Report", 14, 22);
        doc.setFontSize(11);
        doc.text(`Period Filter: ${payPeriodFilter}`, 14, 30);
        doc.text(`Date Generated: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 36);
        autoTable(doc, { startY: 50, head: [tableColumn], body: tableRows });
        const finalY = (doc).lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Payroll Summary", 14, finalY + 15);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Gross Pay: ${formatCurrency(totalGross)}`, 14, finalY + 22);
        doc.text(`Total Taxes: ${formatCurrency(totalTaxes)}`, 14, finalY + 28);
        doc.text(`Total Net Pay: ${formatCurrency(totalNet)}`, 14, finalY + 34);
        doc.save(`Payroll-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };

    const handleGeneratePayStub = (employee) => {
        if (!employee) return addNotification("Cannot generate stub for invalid employee.", "error");
        addNotification(`Generating pay stub for ${employee.employeeName}...`);
        
        try {
            const doc = new jsPDF();
            const grossPay = (employee.basicSalary || 0);
            const incomeTax = (employee.taxPayment || 0);
            const cpp = (employee.pensionPay || 0);
            const ei = (employee.niPayment || 0);
            const totalTaxes = incomeTax + cpp + ei;
            const netPay = (employee.netPay || 0);

            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text("SmartPayroll Inc.", 14, 20);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text("12 Km Stone, NH-3, Grand Trunk Road, Meharbanpur, Punjab 143109", 14, 26);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text("Pay Stub Detail", 150, 40);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`PAY DATE: ${format(new Date(employee.nextPayDate), 'MM/dd/yyyy')}`, 150, 46);
            doc.text(`NET PAY: ${formatCurrency(netPay)}`, 150, 52);
            doc.line(14, 60, 200, 60);
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
            doc.text(`Total Hours: ${(employee.overtimeHours || 0).toFixed(2)}`, 120, 80);
            doc.line(14, 90, 200, 90);

            autoTable(doc, { startY: 95, head: [['Earnings', 'Current']], body: [['Basic Salary', formatCurrency(employee.basicSalary)], ['Other Payments', formatCurrency(employee.otherPayment)], ['Overtime', formatCurrency((employee.overtimeHours || 0) * (employee.hourlyRate || 0))]], theme: 'striped', headStyles: { fillColor: [41, 128, 185] } });
            autoTable(doc, { startY: (doc).lastAutoTable.finalY + 5, head: [['Deductions & Taxes', 'Current']], body: [['Income Tax', formatCurrency(incomeTax)], ['Pension (CPP)', formatCurrency(cpp)], ['NI Payment (EI)', formatCurrency(ei)], ['Student Loan', formatCurrency(employee.studentLoan)]], theme: 'striped', headStyles: { fillColor: [231, 76, 60] } });
            const finalY = (doc).lastAutoTable.finalY + 10;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text("SUMMARY", 150, finalY);
            autoTable(doc, { startY: finalY + 5, body: [['Gross Pay', formatCurrency(grossPay)], ['Total Taxes & Deductions', `-${formatCurrency(totalTaxes + (employee.studentLoan || 0))}`], ['Net Pay', formatCurrency(netPay)]], theme: 'plain', styles: { cellPadding: 2, fontSize: 10 }, columnStyles: { 0: { fontStyle: 'bold' } }, margin: { left: 130 } });
            doc.save(`Pay-Stub-${employee.employeeName.replace(' ', '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        } catch(error) {
            addNotification("Error generating pay stub.", "error");
        }
    };

    const handleDelete = async (employeeId) => {
        if (!window.confirm("Are you sure you want to permanently delete this employee?")) return;
        try {
            const employeeToDelete = employees.find(emp => emp._id === employeeId);
            const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete request failed');
            addNotification(`Employee "${employeeToDelete?.employeeName}" was deleted.`);
            fetchEmployees();
        } catch (error) {
            addNotification("Failed to delete employee.", "error");
            fetchEmployees();
        }
    };
    
    const handleEdit = (employeeId) => onNavigate('AddOrEditEmployee', employeeId);
    const formatCurrency = (amount) => `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div>
            <PageHeader
                title="Hamro Payroll System"
                action={
                    <div className="flex items-center space-x-4">
                        <button onClick={() => onNavigate('AddOrEditEmployee')} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
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
                                    <option>Per Day</option>
                                    <option>Weekly</option>
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
                                    const grossPay = (emp.basicSalary || 0);
                                    const taxes = (emp.taxPayment || 0);
                                    const netPay = (emp.netPay || 0);
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