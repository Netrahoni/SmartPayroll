import React, { useState } from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import { Icon } from './Icon.jsx'; 
import { ICONS } from '../icons';

const mockLogs = [
    { id: 1, time: '2026-03-30 15:42:10', event: 'Payroll run initiated', user: 'Admin User', module: 'Payroll', status: 'success' },
    { id: 2, time: '2026-03-30 14:15:22', event: 'Employee details updated', user: 'Admin User', module: 'Employees', status: 'info' },
    { id: 3, time: '2026-03-30 11:02:05', event: 'New device added to endpoint security via Marketplace integration', user: 'System', module: 'Marketplace', status: 'success' },
    { id: 4, time: '2026-03-29 09:30:00', event: 'Failed login attempt', user: 'Unknown IP', module: 'Security', status: 'warn' },
    { id: 5, time: '2026-03-28 16:20:15', event: 'Jane Doe requested employee access', user: 'System', module: 'Auth', status: 'info' },
    { id: 6, time: '2026-03-28 14:00:00', event: 'Approved leave request for Netra Mani', user: 'Admin User', module: 'Time Off', status: 'success' },
    { id: 7, time: '2026-03-27 10:15:30', event: 'Exported quarterly tax report', user: 'Admin User', module: 'Reports', status: 'info' },
    { id: 8, time: '2026-03-25 08:00:00', event: 'Auto-sync from Quickbooks completed', user: 'System', module: 'Marketplace', status: 'success' },
    { id: 9, time: '2026-03-24 13:45:12', event: 'Error uploading W-2 document', user: 'Admin User', module: 'Documents', status: 'warn' },
    { id: 10, time: '2026-03-22 09:00:00', event: 'System maintenance completed', user: 'System', module: 'System', status: 'info' },
];

const Logs = () => {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const filteredLogs = mockLogs.filter(log => {
        const matchesFilter = filter === 'All' || log.module === filter;
        const matchesSearch = log.event.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'success': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'warn': return 'bg-orange-50 text-orange-700 border border-orange-200';
            case 'info':
            default: return 'bg-blue-50 text-blue-700 border border-blue-200';
        }
    };

    const modules = ['All', ...new Set(mockLogs.map(l => l.module))].sort();

    return (
        <div>
            <PageHeader title="System Logs" />
            <p className="text-gray-500 mb-6 text-sm">Review all activities, events, and security logs across the HamroPayroll platform.</p>
            
            <Card>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-64">
                        <Icon path={ICONS.search} className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)} 
                            className="p-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {modules.map(m => (
                                <option key={m} value={m}>{m === 'All' ? 'All Modules' : m}</option>
                            ))}
                        </select>
                        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 text-sm">
                            <Icon path={ICONS.pdf} className="w-4 h-4 text-gray-500" /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="py-3 px-5">Timestamp</th>
                                <th className="py-3 px-5">User</th>
                                <th className="py-3 px-5">Module</th>
                                <th className="py-3 px-5">Event Description</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500">No logs found matching your criteria.</td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{log.time}</td>
                                        <td className="py-3 px-5 font-medium text-gray-700">{log.user}</td>
                                        <td className="py-3 px-5">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(log.status)}`}>
                                                {log.module}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 text-gray-700">{log.event}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
                    <p>Showing {filteredLogs.length} of {mockLogs.length} events</p>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded bg-blue-50 text-blue-600 font-medium">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600">Next</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Logs;
