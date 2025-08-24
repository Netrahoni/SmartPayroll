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

const AppContent = ({ user, setUser, onLogout }) => {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [activeId, setActiveId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const fetchEmployees = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(url, {
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
        fetchEmployees();
    }, [fetchEmployees]);

    const handleNavigation = (page, id = null) => {
        if (page === 'Payroll' || page === 'Employees' || page === 'Dashboard') {
            fetchEmployees();
        }
        setActiveId(id);
        setActiveItem(page);
        setGlobalSearchQuery('');
    };

    const PageContent = () => {
        switch (activeItem) {
            case 'Dashboard':
                return <Dashboard onNavigate={handleNavigation} employees={employees} user={user} />;
            case 'Employees':
                return <Employees onNavigate={handleNavigation} employees={employees} fetchEmployees={fetchEmployees} globalSearchQuery={globalSearchQuery} />;
            case 'Payroll':
                return <Payroll onNavigate={handleNavigation} employees={employees} fetchEmployees={fetchEmployees} globalSearchQuery={globalSearchQuery} />;
            case 'Reports':
                return <Reports onNavigate={handleNavigation} />;
            case 'Settings':
                return <Settings onNavigate={handleNavigation} user={user} setUser={setUser} />;
            case 'AddOrEditEmployee':
                return <AddOrEditEmployee onNavigate={handleNavigation} employeeId={activeId} />;
            default:
                return <Dashboard onNavigate={handleNavigation} employees={employees} user={user} />;
        }
    };

    return (
        <div className="flex bg-slate-100 font-sans h-screen">
            <Sidebar 
                activeItem={activeItem} 
                setActiveItem={handleNavigation} 
                onLogout={onLogout}
                isSidebarOpen={isSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header 
                    user={user} 
                    globalSearchQuery={globalSearchQuery} 
                    setGlobalSearchQuery={setGlobalSearchQuery}
                    toggleSidebar={toggleSidebar}
                />
                <main className="flex-1 p-8">
                    <PageContent />
                </main>
            </div>
        </div>
    );
};

export default function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/user', {
                        headers: { 'x-auth-token': storedToken }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setToken(storedToken);
                        setUser(userData);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('token');
                }
            }
            setAuthLoading(false);
        };
        validateToken();
    }, []);

    const handleLoginSuccess = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#334155' }}>Loading Smart Payroll...</h2>
            </div>
        );
    }

    if (!token || !user) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return <AppContent user={user} setUser={setUser} onLogout={handleLogout} />;
}