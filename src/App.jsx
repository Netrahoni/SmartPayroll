import React, { useState } from 'react';

// Component Imports
import Sidebar from './Components/Sidebar.jsx';
import Payroll from './Components/Payroll.jsx';
import AddOrEditEmployee from './Components/AddOrEditEmployee.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Reports from './Components/Reports.jsx';
import Settings from './Components/Settings.jsx';
import Employees from './Components/Employees.jsx';

// PageContent now also receives the refreshKey to pass to Payroll
const PageContent = ({ activePage, onNavigate, activeId, refreshKey }) => {
    switch (activePage) {
        case 'Dashboard':
            return <Dashboard onNavigate={onNavigate} />;
        case 'Employees':
            return <Employees onNavigate={onNavigate} />;
        case 'Reports':
            return <Reports onNavigate={onNavigate} />;
        case 'Settings':
            return <Settings onNavigate={onNavigate} />;
        case 'AddOrEditEmployee':
            return <AddOrEditEmployee onNavigate={onNavigate} employeeId={activeId} />;
        case 'Payroll':
        default:
            // 1. The 'key' prop is added here. When it changes, the component will remount.
            return <Payroll onNavigate={onNavigate} key={refreshKey} />;
    }
};

// Main App Component
export default function App() {
    const [activeItem, setActiveItem] = useState('Payroll');
    const [activeId, setActiveId] = useState(null);
    // 2. We add a new piece of state to act as our refresh trigger.
    const [refreshKey, setRefreshKey] = useState(0);

    // 3. This function now handles both navigation AND triggers the refresh.
    const handleNavigation = (page, id = null) => {
        // If we are navigating back to the Payroll page...
        if (page === 'Payroll') {
            // ...we increment the key. This is the crucial step that forces the refresh.
            setRefreshKey(prevKey => prevKey + 1);
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
                    onNavigate={handleNavigation} // Pass the new combined function
                    activeId={activeId}
                    refreshKey={refreshKey} // Pass the key itself down to PageContent
                />
            </main>
        </div>
    );
}
