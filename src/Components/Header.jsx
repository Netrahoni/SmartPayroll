import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { ICONS } from '../icons.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { formatDistanceToNow } from 'date-fns';

const Header = ({ user, globalSearchQuery, setGlobalSearchQuery, toggleSidebar, activeItem }) => {
    const { notifications, unreadCount, markAsRead, clearNotifications } = useNotifications();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const getInitials = (firstName, lastName) => {
        if (!firstName || !lastName) return '?';
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const handleBellClick = () => {
        setIsDropdownOpen(prev => !prev);
        if (!isDropdownOpen) markAsRead();
    };

    const pageTitles = {
        Dashboard: 'Dashboard',
        Employees: 'Team',
        Payroll: 'Payroll',
        Reports: 'Reports',
        Settings: 'Settings',
        Marketplace: 'Marketplace',
    };

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

            {/* Right — bell + avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
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

                    {isDropdownOpen && (
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

                {/* User Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#2563EB,#06B6D4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0,
                        overflow: 'hidden',
                        border: user?.avatar ? '2px solid #E0E8F9' : 'none',
                    }}>
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        ) : (
                            user ? getInitials(user.firstName, user.lastName) : '?'
                        )}
                    </div>
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                            {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                        </p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                            {user ? user.position : ''}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;