import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Header from './Components/Header.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Employees from './Components/Employees.jsx';
import Payroll from './Components/Payroll.jsx';
import Reports from './Components/Reports.jsx';
import Settings from './Components/Settings.jsx';
import AddOrEditEmployee from './Components/AddOrEditEmployee.jsx';
import LoginPage from './Components/LoginPage.jsx';
import Marketplace from './Components/Marketplace.jsx';
import Onboarding from './Components/Onboarding.jsx';
import TimeOff from './Components/TimeOff.jsx';
import Expenses from './Components/Expenses.jsx';
import Logs from './Components/Logs.jsx';
import HomePage from './Components/HomePage.jsx';
import Profile from './Components/Profile.jsx';

const MarketingPage = ({ pageName, onBack, onLoginClick }) => {
    const Component = lazy(() => import(`./Components/${pageName}Page.jsx`));
    return (
        <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>Loading...</div>}>
            <Component onBack={onBack} onLoginClick={onLoginClick} />
        </Suspense>
    );
};

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
            // Use relative path for API call
            const response = await fetch('/api/employees', {
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
            case 'Profile':
                return <Profile user={user} onNavigate={handleNavigation} />;
            case 'Payroll':
                return <Payroll onNavigate={handleNavigation} employees={employees} fetchEmployees={fetchEmployees} globalSearchQuery={globalSearchQuery} />;
            case 'Reports':
                return <Reports onNavigate={handleNavigation} employees={employees} />;
            case 'Onboarding':
                return <Onboarding employees={employees} />;
            case 'TimeOff':
                return <TimeOff employees={employees} />;
            case 'Expenses':
                return <Expenses employees={employees} />;
            case 'Settings':
                return <Settings onNavigate={handleNavigation} user={user} setUser={setUser} />;
            case 'AddOrEditEmployee':
                return <AddOrEditEmployee onNavigate={handleNavigation} employeeId={activeId} />;
            case 'Marketplace':
                return <Marketplace onNavigate={handleNavigation} />;
            case 'Logs':
                return <Logs />;
            default:
                return <Dashboard onNavigate={handleNavigation} employees={employees} user={user} />;
        }
    };

    return (
        <div className="flex font-sans h-screen" style={{ 
            background: 'linear-gradient(145deg, #F8FAFC 0%, #EFF6FF 50%, #E0F2FE 100%)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Background dots */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            <Sidebar 
                activeItem={activeItem} 
                setActiveItem={handleNavigation} 
                onLogout={onLogout}
                isSidebarOpen={isSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-y-auto" style={{ position: 'relative', zIndex: 1 }}>
                <Header 
                    user={user} 
                    globalSearchQuery={globalSearchQuery} 
                    setGlobalSearchQuery={setGlobalSearchQuery}
                    toggleSidebar={toggleSidebar}
                    activeItem={activeItem}
                    onNavigate={handleNavigation}
                    onLogout={onLogout}
                />
                <main className="flex-1" style={{ padding: '32px 40px', overflowY: 'auto' }}>
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
    const [showLogin, setShowLogin] = useState(false);
    const [publicPage, setPublicPage] = useState('Home');

    useEffect(() => {
        const validateToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await fetch('/api/auth/user', {
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
        setShowLogin(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setShowLogin(false);
        setPublicPage('Home');
    };

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#334155' }}>Loading HamroPayroll...</h2>
            </div>
        );
    }

    // Authenticated — show the app
    if (token && user) {
        return <AppContent user={user} setUser={setUser} onLogout={handleLogout} />;
    }

    // Show login page (triggered by CTA)
    if (showLogin) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setShowLogin(false)} />;
    }

    // Show specific public page if not on home
    if (publicPage !== 'Home') {
        const pageName = publicPage.replace(/ /g, '');
        return <MarketingPage pageName={pageName} onBack={() => setPublicPage('Home')} onLoginClick={() => setShowLogin(true)} />;
    }

    // Default: public homepage
    return <HomePage onLoginClick={() => setShowLogin(true)} setPublicPage={setPublicPage} />;
}
