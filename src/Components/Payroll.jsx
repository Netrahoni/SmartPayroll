import React from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import Icon from './Icon';
import { ICONS } from '../icons';

const Payroll = () => {
    const employees = [
        { id: 'EMP-001', name: 'Johnathan Smith', position: 'Senior Developer', gross: 5200.00, taxes: 1100.50 },
        { id: 'EMP-002', name: 'Kate Williams', position: 'Project Manager', gross: 6000.00, taxes: 1450.00 },
        { id: 'EMP-003', name: 'Peter Jones', position: 'UI/UX Designer', gross: 4800.00, taxes: 980.75 },
        { id: 'EMP-004', name: 'Maria Garcia', position: 'QA Tester', gross: 4100.00, taxes: 850.20 },
    ];
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
    const infoCards = [
        { title: 'Pay Period', value: 'Bi-Weekly', icon: ICONS.calendar, color: 'blue' },
        { title: 'Next Pay Date', value: 'June 15, 2023', icon: ICONS.clock, color: 'green' },
        { title: 'Total Employees', value: '24', icon: ICONS.group, color: 'purple' },
    ];

    return (
        <div>
            <PageHeader title="Canadian Payroll System" />
            <Card className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Payroll Processing</h2>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <button className="flex items-center bg-blue-500 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-600"><Icon path={ICONS.play} className="w-5 h-5 mr-2" />Run Payroll</button>
                        <button className="flex items-center bg-red-500 text-white px-5 py-2.5 rounded-lg shadow hover:bg-red-600"><Icon path={ICONS.pdf} className="w-5 h-5 mr-2" />Full Payroll PDF</button>
                        <button className="flex items-center bg-yellow-500 text-white px-5 py-2.5 rounded-lg shadow hover:bg-yellow-600"><Icon path={ICONS.stub} className="w-5 h-5 mr-2" />Employee Pay Stub</button>
                    </div>
                    <div className="flex space-x-4">
                        {infoCards.map(card => (
                            <div key={card.title} className="flex items-center bg-gray-100 p-4 rounded-lg">
                                <div className={`p-3 rounded-full bg-${card.color}-100 text-${card.color}-500 mr-4`}><Icon path={card.icon} className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-sm text-gray-500">{card.title}</p>
                                    <p className="text-lg font-bold text-gray-800">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <Card>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Employee Payroll Records</h2>
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
                            {employees.map((emp) => (
                                <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-4 font-medium">{emp.name}</td>
                                    <td className="py-4 px-4">{emp.id}</td>
                                    <td className="py-4 px-4">{emp.position}</td>
                                    <td className="py-4 px-4">{formatCurrency(emp.gross)}</td>
                                    <td className="py-4 px-4 text-red-600">{formatCurrency(emp.taxes)}</td>
                                    <td className="py-4 px-4 font-bold text-green-600">{formatCurrency(emp.gross - emp.taxes)}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-center space-x-3">
                                            <button className="text-gray-500 hover:text-blue-500"><Icon path={ICONS.edit} className="w-5 h-5" /></button>
                                            <button className="text-gray-500 hover:text-red-500"><Icon path={ICONS.delete} className="w-5 h-5" /></button>
                                            <button className="text-gray-500 hover:text-gray-700"><Icon path={ICONS.dots} className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Payroll;