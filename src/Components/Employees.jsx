import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import Icon from './Icon';
import { ICONS } from '../icons';

const Employees = ({ onNavigate, employees, fetchEmployees }) => {
    // --- STATE MANAGEMENT ---
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedEmployees, setSelectedEmployees] = useState(new Set());

    // --- FILTERING AND SEARCHING (Now uses the 'employees' prop) ---
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
            const matchesSearch = searchQuery === "" ||
                emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.department.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [employees, searchQuery, statusFilter]);

    // --- CRUD & ACTION FUNCTIONS ---
    const handleDelete = async (employeeId) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await fetch(`http://localhost:5000/api/employees/${employeeId}`, { method: 'DELETE' });
            fetchEmployees(); // Use the passed-in function to refresh the master list in App.jsx
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    const handleEdit = (employeeId) => {
        onNavigate('AddOrEditEmployee', employeeId);
    };

    const handleExportData = () => {
        if (selectedEmployees.size === 0) {
            alert("Please select at least one employee to export.");
            return;
        }
        alert(`Exporting data for ${selectedEmployees.size} employees...`);
        
        const employeesToExport = employees.filter(emp => selectedEmployees.has(emp._id));
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Employee Name,ID,Position,Department,Status\n";
        employeesToExport.forEach(emp => {
            const row = [emp.employeeName, emp._id, emp.position, emp.department, emp.status].join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employee_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // --- CHECKBOX HANDLING ---
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(filteredEmployees.map(emp => emp._id));
            setSelectedEmployees(allIds);
        } else {
            setSelectedEmployees(new Set());
        }
    };

    const handleSelectOne = (e, id) => {
        const newSet = new Set(selectedEmployees);
        if (e.target.checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        setSelectedEmployees(newSet);
    };

    // --- UI COMPONENTS ---
    const StatusBadge = ({ status }) => {
        const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
        const statusClasses = {
            'Active': 'bg-green-100 text-green-800',
            'On Leave': 'bg-yellow-100 text-yellow-800',
        };
        return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <PageHeader title="Employee Management" />
            
            <Card>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon path={ICONS.search} className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter} className="p-2 border border-gray-300 rounded-lg bg-white text-sm">
                            <option value="All">Filter by Status</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                        <button onClick={() => onNavigate('AddOrEditEmployee')} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">
                            <Icon path={ICONS.add} className="w-5 h-5 mr-2" />Add Employee
                        </button>
                        <button onClick={handleExportData} className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-800">
                            Export Data
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase">
                                <th className="p-4 w-4">
                                    <input type="checkbox" onChange={handleSelectAll} checked={selectedEmployees.size > 0 && selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0} />
                                </th>
                                <th className="py-3 px-4 font-semibold">Employee</th>
                                <th className="py-3 px-4 font-semibold">Job Title</th>
                                <th className="py-3 px-4 font-semibold">Department</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {employees.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10">No employees found.</td></tr>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-4">
                                            <input type="checkbox" checked={selectedEmployees.has(emp._id)} onChange={(e) => handleSelectOne(e, emp._id)} />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <div className="font-medium">{emp.employeeName}</div>
                                                <div className="text-sm text-gray-500">{emp._id.slice(-6).toUpperCase()}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">{emp.position}</td>
                                        <td className="py-4 px-4">{emp.department}</td>
                                        <td className="py-4 px-4">
                                            <StatusBadge status={emp.status} />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button onClick={() => handleEdit(emp._id)} className="text-gray-500 hover:text-blue-500" title="Edit Employee"><Icon path={ICONS.edit} className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(emp._id)} className="text-gray-500 hover:text-red-500" title="Delete Employee"><Icon path={ICONS.delete} className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Employees;
