import React from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import Icon from './Icon';
import { ICONS } from '../icons';

const Employees = () => {
    const employees = [
        { id: 'EMP-001', name: 'Johnathan Smith', position: 'Senior Developer', department: 'Technology', email: 'j.smith@company.ca', phone: '555-1234', status: 'Active' },
        { id: 'EMP-002', name: 'Kate Williams', position: 'Project Manager', department: 'Management', email: 'k.williams@company.ca', phone: '555-5678', status: 'Active' },
        { id: 'EMP-003', name: 'Peter Jones', position: 'UI/UX Designer', department: 'Design', email: 'p.jones@company.ca', phone: '555-9012', status: 'Active' },
        { id: 'EMP-004', name: 'Maria Garcia', position: 'QA Tester', department: 'Technology', email: 'm.garcia@company.ca', phone: '555-3456', status: 'On Leave' },
        { id: 'EMP-005', name: 'David Lee', position: 'Marketing Head', department: 'Marketing', email: 'd.lee@company.ca', phone: '555-7890', status: 'Active' },
    ];
    return (
        <div>
            <PageHeader title="Employee Management" />
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">All Employees</h2>
                    <div className="relative">
                        <Icon path={ICONS.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Search employees..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase">
                                <th className="py-3 px-4 font-semibold">Employee</th>
                                <th className="py-3 px-4 font-semibold">Position</th>
                                <th className="py-3 px-4 font-semibold">Department</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div className="font-medium">{emp.name}</div>
                                        <div className="text-sm text-gray-500">{emp.id}</div>
                                    </td>
                                    <td className="py-4 px-4">{emp.position}</td>
                                    <td className="py-4 px-4">{emp.department}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-center space-x-3">
                                            <button className="text-gray-500 hover:text-blue-500 transition-colors"><Icon path={ICONS.edit} className="w-5 h-5" /></button>
                                            <button className="text-gray-500 hover:text-red-500 transition-colors"><Icon path={ICONS.delete} className="w-5 h-5" /></button>
                                            <button className="text-gray-500 hover:text-gray-700 transition-colors"><Icon path={ICONS.dots} className="w-5 h-5" /></button>
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

export default Employees;