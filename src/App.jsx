import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import Employees from './Components/Employees';
import Payroll from './Components/Payroll';
import Reports from './Components/Reports';
import Settings from './Components/Settings';
import AddEmployee from './Components/AddEmployee'; // 1. Import AddEmployee

// This component will decide which page to show
// 3. Accept setActiveItem as a prop
const PageContent = ({ activePage, setActiveItem }) => {
    switch (activePage) {
        case 'Dashboard':
            return <Dashboard />;
        case 'Employees':
            // Pass the navigation function to the Employees component
            return <Employees onNavigate={setActiveItem} />;
        case 'Reports':
            return <Reports />;
        case 'Settings':
            return <Settings />;
        // 2. Add the new case for AddEmployee
        case 'AddEmployee':
            // Pass the navigation function so the form can "go back"
            return <AddEmployee onNavigate={setActiveItem} />;
        case 'Payroll':
        default:
            // Pass the navigation function to the Payroll component
            return <Payroll onNavigate={setActiveItem} />;
    }
};

// Main App Component
export default function App() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <div className="flex bg-gray-100 font-sans">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="flex-1 p-0 overflow-y-auto h-screen"> {/* Adjusted padding to p-0 */}
        {/* 3. Pass setActiveItem down to PageContent */}
        <PageContent activePage={activeItem} setActiveItem={setActiveItem} />
      </main>
    </div>
  );
}