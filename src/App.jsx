import React, { useState } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Payroll from './Components/Payroll.jsx';
import AddEmployee from './Components/AddEmployee.jsx';
import EditEmployee from './Components/EditEmployee.jsx'; // You'll need to create this for the edit button to work
import Dashboard from './Components/Dashboard.jsx';
import Reports from './Components/Reports.jsx';
import Settings from './Components/Settings.jsx';
import Employees from './Components/Employees.jsx';

const PageContent = ({ activePage, setActivePage, activeId, setActiveId }) => {
    const handleNavigation = (page, id = null) => {
        setActiveId(id);
        setActivePage(page);
    };

    switch (activePage) {
        case 'Dashboard':
            return <Dashboard onNavigate={handleNavigation} />;
        case 'Employees':
            return <Employees onNavigate={handleNavigation} />;
        case 'Reports':
            return <Reports onNavigate={handleNavigation} />;
        case 'Settings':
            return <Settings onNavigate={handleNavigation} />;
        case 'AddEmployee':
            return <AddEmployee onNavigate={handleNavigation} />;
        case 'EditEmployee':
            return <EditEmployee onNavigate={handleNavigation} employeeId={activeId} />;
        case 'Payroll':
        default:
            return <Payroll onNavigate={handleNavigation} />;
    }
};

export default function App() {
    const [activeItem, setActiveItem] = useState('Payroll');
    const [activeId, setActiveId] = useState(null);

    return (
        <div className="flex bg-gray-100 font-sans">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
            <main className="flex-1 p-0 overflow-y-auto h-screen">
                <PageContent
                    activePage={activeItem}
                    setActivePage={setActiveItem}
                    activeId={activeId}
                    setActiveId={setActiveId}
                />
            </main>
        </div>
    );
}
