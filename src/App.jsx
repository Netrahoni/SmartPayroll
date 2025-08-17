import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Header from './Components/Header.jsx'; // 1. Import the new Header
import Dashboard from './Components/Dashboard.jsx';
import Employees from './Components/Employees.jsx';
import Payroll from './Components/Payroll.jsx';
import Reports from './Components/Reports.jsx';
import Settings from './Components/Settings.jsx';
import AddOrEditEmployee from './Components/AddOrEditEmployee.jsx';
import LoginPage from './Components/LoginPage.jsx';

// This component renders the main application content when the user is logged in
const AppContent = ({ onLogout }) => {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [activeId, setActiveId] = useState(null);
    const [employees, setEmployees] = useState([]);

    // Centralized function to fetch all employee data
    const fetchEmployees = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                headers: { 'x-auth-token': token }
            });
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    }, []);

    // Fetch data when the component first loads
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // This function handles navigation between pages AND triggers a data refresh
    const handleNavigation = (page, id = null) => {
        if (page === 'Payroll' || page === 'Employees' || page === 'Dashboard') {
            fetchEmployees();
        }
        setActiveId(id);
        setActiveItem(page);
    };

    // This component decides which page to show
    const PageContent = () => {
        switch (activeItem) {
            case 'Dashboard': return <Dashboard onNavigate={handleNavigation} employees={employees} />;
            case 'Employees': return <Employees onNavigate={handleNavigation} employees={employees} fetchEmployees={fetchEmployees} />;
            case 'Payroll': return <Payroll onNavigate={handleNavigation} employees={employees} fetchEmployees={fetchEmployees} />;
            case 'Reports': return <Reports onNavigate={handleNavigation} />;
            case 'Settings': return <Settings onNavigate={handleNavigation} />;
            case 'AddOrEditEmployee': return <AddOrEditEmployee onNavigate={handleNavigation} employeeId={activeId} />;
            default: return <Dashboard onNavigate={handleNavigation} employees={employees} />;
        }
    };

    return (
        <div className="flex bg-slate-100 font-sans h-screen">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} onLogout={onLogout} />
            {/* --- NEW LAYOUT STRUCTURE --- */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header /> {/* 2. The new Header is now part of the main layout */}
                <main className="flex-1 p-8">
                    <PageContent />
                </main>
            </div>
        </div>
    );
};

// This is the main export of the file
export default function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    // The logout function that clears the session
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    // If there is no token, show the login page
    if (!token) {
        return <LoginPage setToken={setToken} />;
    }

    // If a token exists, show the main application content
    return <AppContent onLogout={handleLogout} />;
}
