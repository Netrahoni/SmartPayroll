import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import Employees from './Components/Employees';
import Payroll from './Components/Payroll';
import Reports from './Components/Reports';
import Settings from './Components/Settings';

// This component will decide which page to show
const PageContent = ({ activePage }) => {
    switch (activePage) {
        case 'Dashboard':
            return <Dashboard />;
        case 'Employees':
            return <Employees />;
        case 'Reports':
            return <Reports />;
        case 'Settings':
            return <Settings />;
        case 'Payroll':
        default:
            return <Payroll />;
    }
};

// Main App Component
export default function App() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <div className="flex bg-gray-100 font-sans">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <PageContent activePage={activeItem} />
      </main>
    </div>
  );
}