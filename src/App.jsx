import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Payroll from './Components/Payroll.jsx';
import AddOrEditEmployee from './Components/AddOrEditEmployee.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Reports from './Components/Reports.jsx';
import Settings from './Components/Settings.jsx';
import Employees from './Components/Employees.jsx';

const PageContent = ({ activePage, onNavigate, activeId, employees, fetchEmployees }) => {
    switch (activePage) {
        case 'Dashboard':
            return <Dashboard onNavigate={onNavigate} />;
        case 'Employees':
            // Pass the master list and fetch function down
            return <Employees onNavigate={onNavigate} employees={employees} fetchEmployees={fetchEmployees} />;
        case 'Reports':
            return <Reports onNavigate={onNavigate} />;
        case 'Settings':
            return <Settings onNavigate={onNavigate} />;
        case 'AddOrEditEmployee':
            // The form still needs onNavigate to come back
            return <AddOrEditEmployee onNavigate={onNavigate} employeeId={activeId} />;
        case 'Payroll':
        default:
            // Pass the master list and fetch function down
            return <Payroll onNavigate={onNavigate} employees={employees} fetchEmployees={fetchEmployees} />;
    }
};

export default function App() {
    const [activeItem, setActiveItem] = useState('Payroll');
    const [activeId, setActiveId] = useState(null);
    
    // --- STATE IS NOW LIFTED TO THE APP COMPONENT ---
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

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
    
    // This function now handles navigation AND triggers a data refresh
    const handleNavigation = (page, id = null) => {
        // If we are coming back from the form, refresh the data
        if (page === 'Payroll' || page === 'Employees') {
            fetchEmployees();
        }
        setActiveId(id);
        setActiveItem(page);
    };

    return (
        <div className="flex bg-gray-100 font-sans">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
            <main className="flex-1 p-0 overflow-y-auto h-screen">
                <PageContent
                    activePage={activeItem}
                    onNavigate={handleNavigation}
                    activeId={activeId}
                    employees={employees} // Pass the data down
                    fetchEmployees={fetchEmployees} // Pass the refresh function down
                />
            </main>
        </div>
    );
}
