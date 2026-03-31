import React from 'react';
import { format } from 'date-fns';

const Ico = ({ d, size = 20, style, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style} className={className}>
        <path d={d} />
    </svg>
);

const ICONS = {
    edit: "M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z",
    email: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z",
    phone: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    date: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z",
    person: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    briefcase: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.9-2-2-2zm-6 0h-4V4h4v2z",
    location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    bank: "M4 10h3v7H4zM10.5 10h3v7h-3zM2 19h20v3H2zM17 10h3v7h-3zM12 1L2 6v2h20V6z",
    heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    lock: "M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z",
};

const Profile = ({ user, onNavigate }) => {
    if (!user) return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading profile...</div>;

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    
    // Mask banking info
    const maskAccount = (acc) => acc ? `••••${acc.slice(-4)}` : 'Not provided';
    const maskRouting = (rt) => rt ? `••••${rt.slice(-4)}` : 'Not provided';

    const InfoRow = ({ icon, label, value, isEditIcon }) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F8FAFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0, marginTop: 2 }}>
                    <Ico d={icon} size={15} />
                </div>
                <div>
                    <p style={{ fontSize: 13, color: '#64748B', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 14.5, color: '#0F172A', fontWeight: 500 }}>{value || 'Not provided'}</p>
                </div>
            </div>
            {isEditIcon && (
                <button 
                    onClick={() => onNavigate('Settings')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
                    title="Edit via Settings"
                >
                    <Ico d={ICONS.edit} size={15} />
                </button>
            )}
        </div>
    );

    const Card = ({ title, children }) => (
        <div style={{ 
            background: '#fff', borderRadius: 16, padding: '24px', 
            border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>{title}</h3>
            <div>{children}</div>
        </div>
    );

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Header / Banner Card */}
            <div style={{ 
                background: '#fff', borderRadius: 20, overflow: 'hidden', 
                border: '1px solid #E2E8F0', position: 'relative',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)'
            }}>
                {/* Banner Background */}
                <div style={{ height: 120, background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }} />
                
                <div style={{ padding: '0 32px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginTop: -40 }}>
                        {/* Avatar */}
                        <div style={{ 
                            width: 100, height: 100, borderRadius: '50%', background: '#fff', 
                            border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: 32, fontWeight: 800, color: '#fff',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 1
                        }}>
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', display: 'flex', alignItems: 'center', justifyItems: 'center', width: '100%', justifyContent: 'center' }}>
                                    {initials}
                                </div>
                            )}
                        </div>
                        
                        <div style={{ paddingBottom: 8 }}>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', m: 0, lineHeight: 1.2 }}>
                                {user.firstName} {user.lastName}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                <span style={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>{user.position || 'Employee'}</span>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1' }} />
                                <span style={{ fontSize: 14, color: '#475569' }}>{user.department || 'General'}</span>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1' }} />
                                <span style={{ fontSize: 13, color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                                    {user.employeeId || 'EMP-WAITING'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 8 }}>
                        <button 
                            onClick={() => onNavigate('Settings')}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: 8, 
                                background: 'transparent', color: '#1E293B', border: 'none', 
                                fontSize: 14, fontWeight: 600, cursor: 'pointer' 
                            }}
                        >
                            <Ico d={ICONS.lock} size={16} /> Change Password
                        </button>
                        <button 
                            onClick={() => onNavigate('Settings')}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: 8, 
                                background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8,
                                padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(37,99,235,0.25)' 
                            }}
                        >
                            <Ico d={ICONS.edit} size={16} /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
                
                {/* Personal Info */}
                <Card title="Personal Information">
                    <InfoRow icon={ICONS.email} label="Email Address" value={user.email} isEditIcon />
                    <InfoRow icon={ICONS.phone} label="Phone Number" value={user.phone} isEditIcon />
                    <InfoRow icon={ICONS.home} label="Home Address" value={user.homeAddress} isEditIcon />
                </Card>

                {/* Employment Details */}
                <Card title="Employment Details">
                    <InfoRow icon={ICONS.date} label="Start Date" value={user.startDate ? format(new Date(user.startDate), 'MMM dd, yyyy') : 'N/A'} />
                    <InfoRow icon={ICONS.person} label="Line Manager" value={user.manager} />
                    <InfoRow icon={ICONS.briefcase} label="Department" value={user.department} />
                    <InfoRow icon={ICONS.location} label="Office Location" value={user.officeLocation} />
                </Card>

                {/* Payment Information */}
                <Card title="Payment Information">
                    <InfoRow icon={ICONS.bank} label="Bank Account" value={maskAccount(user.bankAccount)} isEditIcon />
                    <InfoRow icon={ICONS.lock} label="Routing Number" value={maskRouting(user.routingNumber)} isEditIcon />
                    <InfoRow icon={ICONS.briefcase} label="Bank Name" value={user.bankName} isEditIcon />
                </Card>

                {/* Emergency Contact */}
                <Card title="Emergency Contact">
                    <InfoRow icon={ICONS.heart} label="Contact Name" value={user.emergencyContactName} isEditIcon />
                    <InfoRow icon={ICONS.person} label="Relationship" value={user.emergencyContactRelation} isEditIcon />
                    <InfoRow icon={ICONS.phone} label="Phone Number" value={user.emergencyContactPhone} isEditIcon />
                </Card>
                
            </div>
            
        </div>
    );
};

export default Profile;
