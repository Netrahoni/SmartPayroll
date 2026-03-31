import React from 'react';

const NavIcon = ({ d, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d={d} />
    </svg>
);

const ICONS = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    team: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    payroll: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
    reports: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z",
    settings: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.13-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
    marketplace: "M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z",
    onboarding: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    timeoff: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
    expenses: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    logs: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
};

const navGroups = [
    {
        label: null,
        items: [
            { key: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
        ],
    },
    {
        label: 'PEOPLE',
        items: [
            { key: 'Employees',  label: 'Team',        icon: 'team' },
            { key: 'Onboarding', label: 'Onboarding',  icon: 'onboarding' },
            { key: 'TimeOff',    label: 'Time off',    icon: 'timeoff' },
            { key: 'Expenses',   label: 'Expenses',    icon: 'expenses' },
        ],
    },
    {
        label: 'CORE',
        items: [
            { key: 'Payroll',      label: 'Payroll',      icon: 'payroll' },
            { key: 'Reports',      label: 'Reports',       icon: 'reports' },
            { key: 'Marketplace',  label: 'Marketplace',   icon: 'marketplace' },
            { key: 'Logs',         label: 'Logs',          icon: 'logs' },
            { key: 'Settings',     label: 'Settings',      icon: 'settings' },
        ],
    },
];

const Sidebar = ({ activeItem, setActiveItem, onLogout, isSidebarOpen }) => {
    return (
        <aside
            style={{
                width: isSidebarOpen ? '200px' : '0',
                minWidth: isSidebarOpen ? '200px' : '0',
                overflow: 'hidden',
                transition: 'width 0.3s ease, min-width 0.3s ease',
                background: '#fff',
                borderRight: '1px solid #EAECF0',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: 'sticky',
                top: 0,
                flexShrink: 0,
            }}
        >
            {/* Logo */}
            <div style={{ padding: '24px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2563EB,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                </div>
                {isSidebarOpen && (
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                        HamroPayroll
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {navGroups.map((group, gi) => (
                    <div key={gi} style={{ marginBottom: 4 }}>
                        {group.label && (
                            <p style={{
                                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                                color: '#9CA3AF', padding: '10px 20px 4px', whiteSpace: 'nowrap',
                            }}>{group.label}</p>
                        )}
                        {group.items.map((item) => {
                            const isActive = item.key === activeItem;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => setActiveItem(item.key)}
                                    style={{
                                        width: 'calc(100% - 12px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '8px 12px 8px 16px',
                                        margin: '1px 6px',
                                        borderRadius: 8,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: isActive ? '#EEF2FF' : 'transparent',
                                        color: isActive ? '#2563EB' : '#4B5563',
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: 13.5,
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        transition: 'background 0.15s, color 0.15s',
                                    }}
                                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#111827'; } }}
                                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5563'; } }}
                                >
                                    <NavIcon d={ICONS[item.icon]} size={17} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div style={{ padding: '8px 6px 12px', borderTop: '1px solid #F3F4F6', flexShrink: 0 }}>
                <button
                    onClick={onLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                        background: 'transparent',
                        color: '#6B7280',
                        fontSize: 13.5,
                        textAlign: 'left',
                        transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
                >
                    <NavIcon d={ICONS.logout} size={17} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;