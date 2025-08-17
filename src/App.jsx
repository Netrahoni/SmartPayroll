import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Header from './Components/Header.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Employees from './Components/Employees.jsx';
import Payroll from './Components/Payroll.jsx';
import Reports from './Components/Reports.jsx';
import Settings from './Components/Settings.jsx';
import AddOrEditEmployee from './Components/AddOrEditEmployee.jsx';
import LoginPage from './Components/LoginPage.jsx';

const AppContent = ({ onLogout }) => {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [activeId, setActiveId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [user, setUser] = useState(null); // State for logged-in user data

    // Fetch logged-in user data
    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/user', {
                    headers: { 'x-auth-token': token }
                });
                if (!response.ok) throw new Error('Failed to fetch user');
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
                onLogout(); // Log out if token is invalid or fetching fails
            }
        }
    }, [onLogout]);

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

    useEffect(() => {
        fetchUser();
        fetchEmployees();
    }, [fetchUser, fetchEmployees]);

    const handleNavigation = (page, id = null) => {
        if (page === 'Payroll' || page === 'Employees' || page === 'Dashboard') {
            fetchEmployees();
        }
        setActiveId(id);
        setActiveItem(page);
    };

    const PageContent = () => {
        switch (activeItem) {
            case 'Dashboard': return <Dashboard onNavigate={handleNavigation} employees={employees} />;
            case 'Employees': return <Employees onNavigate={handleNavigation} employees={employees} fetchEmployees={fetchEmployees} />;
            case 'Payroll': return <Payroll onNavigate={handleNavigation} employees={employees} fetchEmployees={fetchEmployees} />;
            case 'Reports': return <Reports onNavigate={handleNavigation} />;
            case 'Settings': return <Settings onNavigate={handleNavigation} user={user} setUser={setUser} />; // Pass user and setUser
            case 'AddOrEditEmployee': return <AddOrEditEmployee onNavigate={handleNavigation} employeeId={activeId} />;
            default: return <Dashboard onNavigate={handleNavigation} employees={employees} />;
        }
    };

    return (
        <div className="flex bg-slate-100 font-sans h-screen">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} onLogout={onLogout} />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header user={user} /> {/* Pass user to Header */}
                <main className="flex-1 p-8">
                    {user ? <PageContent /> : <p>Loading...</p>} {/* Show loading until user is fetched */}
                </main>
            </div>
        </div>
    );
};

export default function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    if (!token) {
        return <LoginPage setToken={setToken} />;
    }

    return <AppContent onLogout={handleLogout} />;
}