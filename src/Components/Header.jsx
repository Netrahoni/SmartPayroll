import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon.jsx';
import { ICONS } from '../icons.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { formatDistanceToNow } from 'date-fns';

const NavIcon = ({ d, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d={d} />
    </svg>
);

const HDR_ICONS = {
    profile: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    edit: "M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z",
    lock: "M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z",
    settings: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.13-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    emergency: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    payment: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
};

const Header = ({ user, globalSearchQuery, setGlobalSearchQuery, toggleSidebar, activeItem, onNavigate, onLogout }) => {
    const { notifications, unreadCount, markAsRead, clearNotifications } = useNotifications();
    const [isBellOpen, setIsBellOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const bellRef = useRef(null);
    const profileRef = useRef(null);

    const getInitials = (firstName, lastName) => {
        if (!firstName || !lastName) return '?';
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const handleBellClick = () => {
        setIsBellOpen(prev => !prev);
        setIsProfileOpen(false);
        if (!isBellOpen) markAsRead();
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) setIsBellOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const pageTitles = {
        Dashboard: 'Dashboard',
        Employees: 'Team',
        Payroll: 'Payroll',
        Reports: 'Reports',
        Settings: 'Settings',
        Marketplace: 'Marketplace',
        Profile: 'My Profile',
    };

    const profileMenuItems = [
        {
            label: 'View Profile',
            desc: 'Personal & employment info',
            icon: 'profile',
            action: () => { onNavigate && onNavigate('Profile'); setIsProfileOpen(false); }
        },
        {
            label: 'Edit Personal Info',
            desc: 'Name, phone, address',
            icon: 'edit',
            action: () => { onNavigate && onNavigate('Settings'); setIsProfileOpen(false); }
        },
        {
            label: 'Payment Information',
            desc: 'Bank & direct deposit',
            icon: 'payment',
            action: () => { onNavigate && onNavigate('Settings'); setIsProfileOpen(false); }
        },
        {
            label: 'Emergency Contact',
            desc: 'Update emergency details',
            icon: 'emergency',
            action: () => { onNavigate && onNavigate('Settings'); setIsProfileOpen(false); }
        },
        {
            label: 'Change Password',
            desc: 'Update security credentials',
            icon: 'lock',
            action: () => { onNavigate && onNavigate('Settings'); setIsProfileOpen(false); }
        },
        {
            label: 'Account Settings',
            desc: 'Notifications & preferences',
            icon: 'settings',
            action: () => { onNavigate && onNavigate('Settings'); setIsProfileOpen(false); }
        },
    ];

    return (
        <header style={{
            background: '#fff',
            borderBottom: '1px solid #EAECF0',
            padding: '0 32px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 20,
            flexShrink: 0,
        }}>
            {/* Left — toggle + page title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#6B7280', padding: 4, borderRadius: 6,
                        display: 'flex', alignItems: 'center',
                    }}
                    title="Toggle sidebar"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>
                    {pageTitles[activeItem] || activeItem}
                </h2>
            </div>

            {/* Center — search */}
            <div style={{ position: 'relative', width: 340 }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                    <Icon path={ICONS.search} className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    placeholder="Search employees or payroll..."
                    value={globalSearchQuery}
                    onChange={e => setGlobalSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '7px 12px 7px 36px',
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        fontSize: 13,
                        color: '#374151',
                        outline: 'none',
                        background: '#F9FAFB',
                        boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }}
                />
            </div>

            {/* Right — bell + profile dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* Notification Bell */}
                <div style={{ position: 'relative' }} ref={bellRef}>
                    <button
                        onClick={handleBellClick}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#6B7280', padding: 4, borderRadius: 6,
                            display: 'flex', alignItems: 'center', position: 'relative',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute', top: 0, right: 0,
                                width: 16, height: 16, borderRadius: '50%',
                                background: '#EF4444', color: '#fff',
                                fontSize: 10, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{unreadCount}</span>
                        )}
                    </button>

                    {isBellOpen && (
                        <div style={{
                            position: 'absolute', right: 0, top: 38,
                            width: 300, background: '#fff', borderRadius: 10,
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            border: '1px solid #E5E7EB', zIndex: 50, overflow: 'hidden',
                        }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>Notifications</span>
                                <button onClick={clearNotifications} style={{ background: 'none', border: 'none', fontSize: 12, color: '#2563EB', cursor: 'pointer' }}>Clear All</button>
                            </div>
                            <ul style={{ maxHeight: 280, overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0 }}>
                                {notifications.length > 0 ? notifications.map(n => (
                                    <li key={n.id} style={{ padding: '10px 16px', borderBottom: '1px solid #F9FAFB' }}>
                                        <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{n.message}</p>
                                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>{formatDistanceToNow(n.timestamp, { addSuffix: true })}</p>
                                    </li>
                                )) : (
                                    <li style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#9CA3AF' }}>No new notifications</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }} ref={profileRef}>
                    <button
                        onClick={() => { setIsProfileOpen(v => !v); setIsBellOpen(false); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
                            background: isProfileOpen ? '#EEF2FF' : 'transparent',
                            border: isProfileOpen ? '1px solid #BFDBFE' : '1px solid transparent',
                            borderRadius: 10, padding: '4px 10px 4px 4px',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (!isProfileOpen) { e.currentTarget.style.background = '#F8FAFF'; e.currentTarget.style.borderColor = '#E2E8F0'; } }}
                        onMouseLeave={e => { if (!isProfileOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; } }}
                        aria-haspopup="true"
                        aria-expanded={isProfileOpen}
                        id="header-profile-btn"
                    >
                        {/* Avatar */}
                        <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: 'linear-gradient(135deg,#2563EB,#06B6D4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0,
                            overflow: 'hidden',
                            border: '2px solid #E0E8F9',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.18)',
                        }}>
                            {user?.avatar ? (
                                <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            ) : (
                                user ? getInitials(user.firstName, user.lastName) : '?'
                            )}
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                            </p>
                            <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, whiteSpace: 'nowrap' }}>
                                {user ? user.position : ''}
                            </p>
                        </div>
                        {/* Chevron */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#9CA3AF', transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            <path d="M7 10l5 5 5-5z" />
                        </svg>
                    </button>

                    {/* Dropdown Panel */}
                    {isProfileOpen && (
                        <div
                            style={{
                                position: 'absolute', right: 0, top: 52,
                                width: 280, background: '#fff', borderRadius: 14,
                                boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                                border: '1px solid #E2E8F0', zIndex: 50, overflow: 'hidden',
                                animation: 'fadeDown 0.18s ease',
                            }}
                        >
                            {/* Profile Header Card */}
                            <div style={{
                                padding: '16px',
                                background: 'linear-gradient(135deg,#1E1B4B 0%,#2563EB 100%)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 16, fontWeight: 800, color: '#fff',
                                        overflow: 'hidden', flexShrink: 0,
                                        border: '2px solid rgba(255,255,255,0.30)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
                                    }}>
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : getInitials(user?.firstName, user?.lastName)}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>
                                            {user ? `${user.firstName} ${user.lastName}` : '...'}
                                        </p>
                                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                                            {user?.position || 'Employee'} · {user?.department || ''}
                                        </p>
                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', margin: '2px 0 0' }}>
                                            {user?.email || ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Access Links */}
                            <div style={{ padding: '8px 0' }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', padding: '4px 14px 4px', textTransform: 'uppercase' }}>
                                    My Account
                                </p>
                                {profileMenuItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={item.action}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '8px 14px', border: 'none', background: 'transparent',
                                            cursor: 'pointer', fontSize: 13, color: '#374151', textAlign: 'left',
                                            transition: 'background 0.12s, color 0.12s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#F0F7FF'; e.currentTarget.style.color = '#1D4ED8'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                                    >
                                        <div style={{
                                            width: 30, height: 30, borderRadius: 8,
                                            background: 'linear-gradient(135deg,#EEF2FF,#DBEAFE)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#2563EB', flexShrink: 0,
                                        }}>
                                            <NavIcon d={HDR_ICONS[item.icon]} size={15} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.2 }}>{item.label}</p>
                                            <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', fontWeight: 400 }}>{item.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Logout */}
                            <div style={{ borderTop: '1px solid #F1F5F9', padding: '6px 0 8px' }}>
                                <button
                                    onClick={() => { setIsProfileOpen(false); onLogout && onLogout(); }}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '9px 14px', border: 'none', background: 'transparent',
                                        cursor: 'pointer', fontSize: 13, color: '#EF4444', textAlign: 'left',
                                        transition: 'background 0.12s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <div style={{
                                        width: 30, height: 30, borderRadius: 8, background: '#FEF2F2',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#EF4444', flexShrink: 0,
                                    }}>
                                        <NavIcon d={HDR_ICONS.logout} size={15} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 500 }}>Sign Out</p>
                                        <p style={{ margin: 0, fontSize: 11, color: '#FCA5A5', fontWeight: 400 }}>End your session</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    );
};

export default Header;