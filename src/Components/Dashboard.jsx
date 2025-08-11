import React from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import Icon from './Icon';
import { ICONS } from '../icons';

const Dashboard = () => {
    const stats = [
        { title: 'Total Employees', value: '24', icon: ICONS.group, color: 'blue' },
        { title: 'Total Payroll (Month)', value: '$124,560', icon: ICONS.payroll, color: 'green' },
        { title: 'Pending Reports', value: '3', icon: ICONS.reports, color: 'yellow' },
        { title: 'Next Pay Date', value: 'June 15, 2023', icon: ICONS.calendar, color: 'red' },
    ];
    return (
        <div>
            <PageHeader title="Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-500 mr-4`}>
                                <Icon path={stat.icon} className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="mt-8">
                <Card>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
                    <ul className="divide-y divide-gray-200">
                        <li className="py-3">Payroll for May 2023 was successfully processed.</li>
                        <li className="py-3">New employee 'Jane Doe' was added.</li>
                        <li className="py-3">Tax report for Q1 2023 was generated.</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;