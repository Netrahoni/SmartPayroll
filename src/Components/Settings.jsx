import React, { useState, useEffect, useId } from 'react';
import { useNotifications } from '../context/NotificationContext.jsx';

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const Ico = ({ d, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d={d} />
    </svg>
);
const ICONS = {
    user: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z',
    lock: 'M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z',
    office: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
    bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5S10.5 3.2 10.5 4v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z',
    check: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
    eye: 'M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z',
    eyeOff: 'M12 7c2.8 0 5 2.2 5 5 0 .6-.1 1.2-.4 1.8l3 3c1.5-1.3 2.7-2.9 3.4-4.8C21.3 7.6 17 4.5 12 4.5c-1.4 0-2.7.2-3.9.7l2.2 2.2c.5-.3 1.1-.4 1.7-.4zM2 4.3L4.3 6.6C2.6 7.9 1.3 9.6.5 11.5 2.2 15.9 6.5 19 11.5 19c1.7 0 3.3-.4 4.7-1l3.2 3.2 1.3-1.3L3.3 3 2 4.3zm5.5 5.5L9 11.3c0 .2-.1.5-.1.7 0 1.7 1.3 3 3 3 .2 0 .5 0 .7-.1l1.5 1.5c-.7.3-1.4.5-2.2.5-2.8 0-5-2.2-5-5 0-.8.2-1.6.6-2.1z',
    chevronRight: 'M10 6L8.6 7.4 13.2 12l-4.6 4.6L10 18l6-6z',
    photo: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
    save: 'M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm3-10H5V5h10v4z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    info: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
};

// ─── Design Tokens ──────────────────────────────────────────────────────────
const styles = {
    // Containers
    page: {
        display: 'flex',
        gap: 0,
        minHeight: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(37,99,235,0.07)',
        background: '#fff',
        border: '1px solid #E8EDF5',
    },
    // Settings Sidebar
    settingsSidebar: {
        width: 240,
        minWidth: 240,
        background: 'linear-gradient(180deg, #F0F4FF 0%, #F8FAFF 100%)',
        borderRight: '1px solid #E0E8F9',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0 16px',
        flexShrink: 0,
    },
    avatarSection: {
        padding: '28px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid #E0E8F9',
        marginBottom: 8,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: -1,
        marginBottom: 10,
        boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
    },
    avatarName: {
        fontWeight: 700,
        fontSize: 14,
        color: '#1E293B',
        textAlign: 'center',
        lineHeight: 1.3,
    },
    avatarRole: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 2,
    },
    navGroup: {
        padding: '4px 10px',
    },
    navGroupLabel: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.10em',
        color: '#94A3B8',
        padding: '10px 10px 4px',
        textTransform: 'uppercase',
    },
    // Main content
    mainContent: {
        flex: 1,
        padding: '32px 36px',
        overflowY: 'auto',
        background: '#FAFBFF',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: '#0F172A',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 13.5,
        color: '#64748B',
        marginBottom: 28,
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #EBF0FB',
        margin: '24px 0',
    },
    // Card / group
    card: {
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #E8EDF5',
        padding: '24px 24px 20px',
        marginBottom: 20,
        boxShadow: '0 2px 8px rgba(37,99,235,0.04)',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    cardIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        background: 'linear-gradient(135deg,#EEF2FF,#E0F2FE)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 700,
        color: '#1E293B',
    },
    cardDesc: {
        fontSize: 12.5,
        color: '#64748B',
        marginTop: 1,
    },
    // Form elements
    formGrid2: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px 20px',
        marginBottom: 16,
    },
    formGrid3: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px 20px',
        marginBottom: 16,
    },
    formGrid1: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px 20px',
        marginBottom: 16,
    },
    label: {
        display: 'block',
        fontSize: 12.5,
        fontWeight: 600,
        color: '#374151',
        marginBottom: 5,
        letterSpacing: '0.01em',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        background: '#F8FAFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: 9,
        fontSize: 13.5,
        color: '#1E293B',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
        lineHeight: 1.4,
        fontFamily: 'inherit',
    },
    inputDisabled: {
        background: '#F1F5F9',
        color: '#94A3B8',
        cursor: 'not-allowed',
    },
    select: {
        width: '100%',
        padding: '10px 12px',
        background: '#F8FAFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: 9,
        fontSize: 13.5,
        color: '#1E293B',
        outline: 'none',
        appearance: 'none',
        cursor: 'pointer',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    textarea: {
        width: '100%',
        padding: '10px 12px',
        background: '#F8FAFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: 9,
        fontSize: 13.5,
        color: '#1E293B',
        outline: 'none',
        resize: 'vertical',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        lineHeight: 1.5,
    },
    inputFocus: {
        borderColor: '#2563EB',
        boxShadow: '0 0 0 3px rgba(37,99,235,0.12)',
    },
    btnPrimary: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
        color: '#fff',
        border: 'none',
        borderRadius: 9,
        fontSize: 13.5,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxShadow: '0 2px 8px rgba(37,99,235,0.28)',
        fontFamily: 'inherit',
    },
    btnFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 8,
        marginTop: 4,
        borderTop: '1px solid #F1F5F9',
    },
    // Toggle
    toggleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
    },
    toggleLabel: {
        fontSize: 13.5,
        fontWeight: 600,
        color: '#1E293B',
    },
    toggleDesc: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 1,
    },
    // Password strength
    strengthBar: {
        height: 4,
        borderRadius: 4,
        transition: 'width 0.4s, background 0.4s',
        marginTop: 6,
    },
    strengthText: {
        fontSize: 11.5,
        fontWeight: 600,
        marginTop: 4,
    },
    // Alert / Banner
    alertSuccess: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderRadius: 9,
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        color: '#15803D',
        fontSize: 13,
        marginTop: 12,
    },
    alertError: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderRadius: 9,
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        color: '#DC2626',
        fontSize: 13,
        marginTop: 12,
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
    },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const InputField = ({ label, name, type = 'text', value, onChange, disabled, placeholder, required, hint, rightElement }) => {
    const [focused, setFocused] = useState(false);
    const id = `field-${name}`;
    return (
        <div>
            <label htmlFor={id} style={styles.label}>
                {label}
                {required && <span style={{ color: '#EF4444', marginLeft: 2 }} aria-hidden="true">*</span>}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    required={required}
                    aria-describedby={hint ? `${id}-hint` : undefined}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        ...styles.input,
                        ...(disabled ? styles.inputDisabled : {}),
                        ...(focused ? styles.inputFocus : {}),
                        paddingRight: rightElement ? 40 : 12,
                    }}
                />
                {rightElement && (
                    <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
                        {rightElement}
                    </div>
                )}
            </div>
            {hint && <p id={`${id}-hint`} style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 4 }}>{hint}</p>}
        </div>
    );
};

const SelectField = ({ label, name, value, onChange, options, required }) => {
    const [focused, setFocused] = useState(false);
    const id = `field-${name}`;
    return (
        <div>
            <label htmlFor={id} style={styles.label}>
                {label}
                {required && <span style={{ color: '#EF4444', marginLeft: 2 }} aria-hidden="true">*</span>}
            </label>
            <div style={{ position: 'relative' }}>
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{ ...styles.select, ...(focused ? styles.inputFocus : {}) }}
                >
                    {options.map(opt => (
                        <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                    ))}
                </select>
                <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }}>
                    <Ico d={ICONS.chevronRight} size={16} className="" />
                </div>
            </div>
        </div>
    );
};

const ToggleSwitch = ({ label, description, enabled, setEnabled, id }) => (
    <div style={styles.toggleRow} role="group" aria-labelledby={`toggle-label-${id}`}>
        <div>
            <p id={`toggle-label-${id}`} style={styles.toggleLabel}>{label}</p>
            <p style={styles.toggleDesc}>{description}</p>
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-labelledby={`toggle-label-${id}`}
            onClick={() => setEnabled(!enabled)}
            style={{
                position: 'relative',
                width: 44,
                height: 24,
                borderRadius: 12,
                background: enabled ? 'linear-gradient(135deg,#2563EB,#06B6D4)' : '#CBD5E1',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.25s',
                flexShrink: 0,
                boxShadow: enabled ? '0 2px 6px rgba(37,99,235,0.30)' : 'none',
                outline: 'none',
            }}
        >
            <span style={{
                position: 'absolute',
                top: 3,
                left: enabled ? 23 : 3,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                transition: 'left 0.25s',
            }} />
        </button>
    </div>
);

const CardSection = ({ icon, title, desc, children }) => (
    <div style={styles.card}>
        <div style={styles.cardHeader}>
            <div style={styles.cardIconWrap}>
                <Ico d={icon} size={18} className="" style={{ color: '#2563EB' }} />
            </div>
            <div>
                <p style={styles.cardTitle}>{title}</p>
                <p style={styles.cardDesc}>{desc}</p>
            </div>
        </div>
        {children}
    </div>
);

// Password strength evaluator
const getStrength = (pw) => {
    let score = 0;
    if (!pw) return { score: 0, label: '', color: '#E2E8F0' };
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
        { label: 'Too short', color: '#EF4444' },
        { label: 'Weak', color: '#F97316' },
        { label: 'Fair', color: '#EAB308' },
        { label: 'Good', color: '#22C55E' },
        { label: 'Strong', color: '#15803D' },
    ];
    return { score, ...levels[Math.min(score, 4)] };
};

// ─── Settings Sections ───────────────────────────────────────────────────────

const ProfileSettings = ({ user, setUser }) => {
    const { addNotification } = useNotifications();
    const [formData, setFormData] = useState({ firstName: '', middleName: '', lastName: '', email: '', phone: '', department: '', position: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [saving, setSaving] = useState(false);

    // Avatar upload states
    const [avatarPreview, setAvatarPreview] = useState(null); // local preview (base64)
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarMsg, setAvatarMsg] = useState({ text: '', type: '' });
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '', middleName: user.middleName || '',
                lastName: user.lastName || '', email: user.email || '',
                phone: user.phone || '', department: user.department || '', position: user.position || ''
            });
            // Sync avatar preview from saved user
            if (user.avatar) setAvatarPreview(user.avatar);
        }
    }, [user]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // ── Read & validate a file, then upload ──
    const processFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setAvatarMsg({ text: 'Please select an image file (JPEG, PNG, WebP, etc.)', type: 'error' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setAvatarMsg({ text: 'Image must be under 5MB. Please choose a smaller file.', type: 'error' });
            return;
        }

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target.result;
            setAvatarPreview(base64);
            setAvatarMsg({ text: '', type: '' });
            setAvatarUploading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/auth/avatar', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                    body: JSON.stringify({ avatar: base64 }),
                });
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                    setAvatarMsg({ text: 'Profile photo updated!', type: 'success' });
                    addNotification('Profile photo updated successfully.');
                } else {
                    setAvatarMsg({ text: data.msg || 'Upload failed.', type: 'error' });
                }
            } catch {
                setAvatarMsg({ text: 'Server error. Try again.', type: 'error' });
            }
            setAvatarUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e) => processFile(e.target.files[0]);

    const handleRemoveAvatar = async () => {
        setAvatarUploading(true);
        setAvatarMsg({ text: '', type: '' });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/auth/avatar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ avatar: '' }),
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setAvatarPreview(null);
                setAvatarMsg({ text: 'Photo removed.', type: 'success' });
            }
        } catch {
            setAvatarMsg({ text: 'Failed to remove photo.', type: 'error' });
        }
        setAvatarUploading(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/auth/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(formData)
            });
            const updatedUser = await res.json();
            if (res.ok) {
                setUser(updatedUser);
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                addNotification(`Profile for ${updatedUser.fullName} was updated.`);
                // preserve current avatar in preview
                if (updatedUser.avatar) setAvatarPreview(updatedUser.avatar);
            } else {
                setMessage({ text: updatedUser.msg || 'Failed to update profile.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Server error. Please try again.', type: 'error' });
        }
        setSaving(false);
    };

    const initials = `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`.toUpperCase();
    const currentAvatar = avatarPreview || user?.avatar;

    return (
        <form onSubmit={handleSubmit} aria-label="Profile settings form">
            <h2 style={styles.sectionTitle}>Profile Settings</h2>
            <p style={styles.sectionSubtitle}>Update your personal information and how others see you in the system.</p>

            {/* ── Avatar Upload Card ── */}
            <div style={styles.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
                    {/* Left: clickable avatar */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        {/* Drop zone / avatar */}
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Upload profile photo — click or drag image here"
                            onClick={() => !avatarUploading && fileInputRef.current?.click()}
                            onKeyDown={e => e.key === 'Enter' && !avatarUploading && fileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            style={{
                                width: 96,
                                height: 96,
                                borderRadius: '50%',
                                background: currentAvatar ? 'transparent' : 'linear-gradient(135deg,#2563EB,#06B6D4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 30,
                                fontWeight: 800,
                                color: '#fff',
                                cursor: avatarUploading ? 'not-allowed' : 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                border: isDragging ? '3px dashed #2563EB' : '3px solid #E0E8F9',
                                boxShadow: '0 4px 16px rgba(37,99,235,0.20)',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                outline: 'none',
                                flexShrink: 0,
                            }}
                        >
                            {currentAvatar ? (
                                <img src={currentAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                initials || '?'
                            )}
                            {/* Hover overlay */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'rgba(15,23,42,0.45)',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                opacity: 0, transition: 'opacity 0.2s',
                                borderRadius: '50%',
                                color: '#fff', fontSize: 11, fontWeight: 600, gap: 4,
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                            >
                                <Ico d={ICONS.photo} size={18} />
                                <span>{avatarUploading ? 'Uploading…' : 'Change'}</span>
                            </div>
                            {/* Upload spinner */}
                            {avatarUploading && (
                                <div style={{
                                    position: 'absolute', inset: 0, background: 'rgba(37,99,235,0.65)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                                }}>
                                    <div style={{
                                        width: 24, height: 24, border: '3px solid rgba(255,255,255,0.4)',
                                        borderTopColor: '#fff', borderRadius: '50%',
                                        animation: 'spin 0.7s linear infinite',
                                    }} />
                                </div>
                            )}
                        </div>
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            aria-hidden="true"
                        />
                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                type="button"
                                onClick={() => !avatarUploading && fileInputRef.current?.click()}
                                disabled={avatarUploading}
                                style={{
                                    padding: '5px 12px', fontSize: 12, fontWeight: 600,
                                    background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                                    color: '#fff', border: 'none', borderRadius: 7,
                                    cursor: avatarUploading ? 'not-allowed' : 'pointer',
                                    opacity: avatarUploading ? 0.6 : 1,
                                    fontFamily: 'inherit',
                                }}
                            >
                                {avatarUploading ? 'Uploading…' : 'Upload'}
                            </button>
                            {currentAvatar && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    disabled={avatarUploading}
                                    style={{
                                        padding: '5px 12px', fontSize: 12, fontWeight: 600,
                                        background: '#FEF2F2', color: '#DC2626',
                                        border: '1px solid #FECACA', borderRadius: 7,
                                        cursor: avatarUploading ? 'not-allowed' : 'pointer',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: info + preview + instructions */}
                    <div style={{ flex: 1, minWidth: 180 }}>
                        <p style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 2 }}>
                            {formData.firstName} {formData.lastName}
                        </p>
                        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 2 }}>
                            {formData.position}{formData.department ? ` · ${formData.department}` : ''}
                        </p>
                        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>{formData.email}</p>
                        <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
                            Click the avatar or drag & drop an image to upload.<br />
                            Supports JPG, PNG, WebP · Max 2MB
                        </p>
                        {avatarMsg.text && (
                            <div style={{
                                ...(avatarMsg.type === 'success' ? styles.alertSuccess : styles.alertError),
                                marginTop: 10, padding: '7px 12px',
                            }} role="alert">
                                <Ico d={avatarMsg.type === 'success' ? ICONS.check : ICONS.warning} size={14} />
                                {avatarMsg.text}
                            </div>
                        )}
                    </div>
                </div>

                {/* CSS for spinner */}
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>

            <CardSection icon={ICONS.user} title="Personal Information" desc="Your name and contact details">
                <div style={styles.formGrid3}>
                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={onChange} required />
                    <InputField label="Middle Name" name="middleName" value={formData.middleName} onChange={onChange} placeholder="Optional" />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={onChange} required />
                </div>
                <div style={styles.formGrid2}>
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={onChange} disabled hint="Email cannot be changed. Contact admin for assistance." />
                    <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={onChange} placeholder="+1 (555) 000-0000" />
                </div>
            </CardSection>

            <CardSection icon={ICONS.office} title="Work Information" desc="Your role and department within the company">
                <div style={styles.formGrid2}>
                    <InputField label="Department" name="department" value={formData.department} onChange={onChange} placeholder="e.g. Engineering" />
                    <InputField label="Position / Title" name="position" value={formData.position} onChange={onChange} placeholder="e.g. Software Engineer" />
                </div>
            </CardSection>

            {message.text && (
                <div style={message.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
                    <Ico d={message.type === 'success' ? ICONS.check : ICONS.warning} size={16} />
                    {message.text}
                </div>
            )}

            <div style={styles.btnFooter}>
                <button
                    type="submit"
                    disabled={saving}
                    style={{ ...styles.btnPrimary, opacity: saving ? 0.7 : 1 }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.40)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.28)'; }}
                >
                    <Ico d={ICONS.save} size={15} />
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

const SecuritySettings = () => {
    const { addNotification } = useNotifications();
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [saving, setSaving] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const strength = getStrength(formData.newPassword);
    const strengthWidth = formData.newPassword ? `${(strength.score / 5) * 100}%` : '0%';

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ text: 'New passwords do not match.', type: 'error' });
            return;
        }
        if (strength.score < 2) {
            setMessage({ text: 'Password is too weak. Please choose a stronger password.', type: 'error' });
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ currentPassword: formData.currentPassword, newPassword: formData.newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ text: data.msg || 'Password changed successfully!', type: 'success' });
                addNotification('Password updated successfully!');
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ text: data.msg || 'An error occurred.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Server error. Please try again.', type: 'error' });
        }
        setSaving(false);
    };

    const EyeBtn = ({ show, setShow, label }) => (
        <button type="button" onClick={() => setShow(!show)} aria-label={label}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 0, display: 'flex' }}>
            <Ico d={show ? ICONS.eyeOff : ICONS.eye} size={17} />
        </button>
    );

    return (
        <form onSubmit={handleSubmit} aria-label="Security settings form">
            <h2 style={styles.sectionTitle}>Security & Password</h2>
            <p style={styles.sectionSubtitle}>Keep your account secure by using a strong, unique password.</p>

            <CardSection icon={ICONS.lock} title="Change Password" desc="Ensure your account is using a long, random password to stay secure">
                <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <InputField
                        label="Current Password" name="currentPassword" type={showCurrent ? 'text' : 'password'}
                        value={formData.currentPassword} onChange={onChange} required
                        rightElement={<EyeBtn show={showCurrent} setShow={setShowCurrent} label={showCurrent ? 'Hide current password' : 'Show current password'} />}
                    />
                    <InputField
                        label="New Password" name="newPassword" type={showNew ? 'text' : 'password'}
                        value={formData.newPassword} onChange={onChange} required
                        hint="Minimum 8 characters, include uppercase, numbers and symbols for strength."
                        rightElement={<EyeBtn show={showNew} setShow={setShowNew} label={showNew ? 'Hide new password' : 'Show new password'} />}
                    />
                    {formData.newPassword && (
                        <div aria-live="polite" aria-label={`Password strength: ${strength.label}`}>
                            <div style={{ height: 4, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ ...styles.strengthBar, width: strengthWidth, background: strength.color, margin: 0 }} />
                            </div>
                            <p style={{ ...styles.strengthText, color: strength.color }}>
                                {strength.label}
                            </p>
                        </div>
                    )}
                    <InputField
                        label="Confirm New Password" name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                        value={formData.confirmPassword} onChange={onChange} required
                        rightElement={<EyeBtn show={showConfirm} setShow={setShowConfirm} label={showConfirm ? 'Hide confirm password' : 'Show confirm password'} />}
                    />
                </div>
            </CardSection>

            <CardSection icon={ICONS.info} title="Security Tips" desc="">
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                        'Use at least 12 characters for a stronger password',
                        'Mix uppercase, lowercase, numbers and special characters',
                        'Avoid using personal info like birthdays or names',
                        'Don\'t reuse passwords across different services',
                    ].map((tip, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#475569' }}>
                            <Ico d={ICONS.check} size={15} style={{ color: '#22C55E', flexShrink: 0, marginTop: 1 }} />
                            {tip}
                        </li>
                    ))}
                </ul>
            </CardSection>

            {message.text && (
                <div style={message.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
                    <Ico d={message.type === 'success' ? ICONS.check : ICONS.warning} size={16} />
                    {message.text}
                </div>
            )}

            <div style={styles.btnFooter}>
                <button type="submit" disabled={saving}
                    style={{ ...styles.btnPrimary, opacity: saving ? 0.7 : 1 }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.40)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.28)'; }}>
                    <Ico d={ICONS.lock} size={15} />
                    {saving ? 'Updating…' : 'Update Password'}
                </button>
            </div>
        </form>
    );
};

const CompanySettings = () => {
    const [settings, setSettings] = useState({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res = await fetch('/api/settings/company');
                const data = await res.json();
                setSettings(data);
            } catch {}
        };
        fetch_();
    }, []);

    const handleChange = e => setSettings({ ...settings, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await fetch('/api/settings/company', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                setMessage({ text: 'Company settings updated successfully!', type: 'success' });
            } else {
                setMessage({ text: 'Failed to update settings.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Server error. Please try again.', type: 'error' });
        }
        setSaving(false);
    };

    const tzOptions = [
        { value: 'UTC', label: 'UTC — Coordinated Universal Time' },
        { value: 'PST', label: 'PST — Pacific Standard Time' },
        { value: 'EST', label: 'EST — Eastern Standard Time' },
        { value: 'CST', label: 'CST — Central Standard Time' },
        { value: 'MST', label: 'MST — Mountain Standard Time' },
        { value: 'IST', label: 'IST — India Standard Time' },
    ];
    const currencyOptions = [
        { value: 'USD', label: 'USD — US Dollar ($)' },
        { value: 'EUR', label: 'EUR — Euro (€)' },
        { value: 'GBP', label: 'GBP — British Pound (£)' },
        { value: 'CAD', label: 'CAD — Canadian Dollar (CA$)' },
        { value: 'NPR', label: 'NPR — Nepalese Rupee (₨)' },
    ];
    const freqOptions = [
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Bi-Weekly', label: 'Bi-Weekly' },
        { value: 'Monthly', label: 'Monthly' },
    ];

    return (
        <form onSubmit={handleSubmit} aria-label="Company settings form">
            <h2 style={styles.sectionTitle}>Company Settings</h2>
            <p style={styles.sectionSubtitle}>Configure company-wide settings that apply to all employees and payroll operations.</p>

            <CardSection icon={ICONS.office} title="Company Information" desc="Basic company contact and identity details">
                <div style={styles.formGrid2}>
                    <InputField label="Company Name" name="companyName" value={settings.companyName || ''} onChange={handleChange} required />
                    <InputField label="Company Email" name="companyEmail" type="email" value={settings.companyEmail || ''} onChange={handleChange} />
                    <InputField label="Company Phone" name="companyPhone" type="tel" value={settings.companyPhone || ''} onChange={handleChange} />
                    <SelectField label="Timezone" name="timezone" value={settings.timezone || 'UTC'} onChange={handleChange} options={tzOptions} />
                </div>
                <div>
                    <label htmlFor="company-address" style={styles.label}>Company Address</label>
                    <textarea
                        id="company-address"
                        name="companyAddress"
                        value={settings.companyAddress || ''}
                        onChange={handleChange}
                        rows={3}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        style={{ ...styles.textarea, ...(focused ? styles.inputFocus : {}) }}
                        placeholder="123 Main St, City, State, ZIP"
                    />
                </div>
            </CardSection>

            <CardSection icon={ICONS.payroll || ICONS.lock} title="Payroll & Work Settings" desc="Define how work hours and payroll are calculated">
                <div style={styles.formGrid2}>
                    <InputField label="Work Start Time" name="workStartTime" type="time" value={settings.workStartTime || '09:00'} onChange={handleChange} />
                    <InputField label="Work End Time" name="workEndTime" type="time" value={settings.workEndTime || '17:00'} onChange={handleChange} />
                    <SelectField label="Currency" name="currency" value={settings.currency || 'USD'} onChange={handleChange} options={currencyOptions} />
                    <SelectField label="Payroll Frequency" name="payrollFrequency" value={settings.payrollFrequency || 'Monthly'} onChange={handleChange} options={freqOptions} />
                    <InputField label="Overtime Rate Multiplier" name="overtimeRateMultiplier" type="number" value={settings.overtimeRateMultiplier || '1.5'} onChange={handleChange} hint="e.g. 1.5 = time and a half" />
                    <InputField label="Default Break Duration (min)" name="defaultBreakDuration" type="number" value={settings.defaultBreakDuration || '60'} onChange={handleChange} hint="Break duration in minutes" />
                </div>
            </CardSection>

            {message.text && (
                <div style={message.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
                    <Ico d={message.type === 'success' ? ICONS.check : ICONS.warning} size={16} />
                    {message.text}
                </div>
            )}

            <div style={styles.btnFooter}>
                <button type="submit" disabled={saving}
                    style={{ ...styles.btnPrimary, opacity: saving ? 0.7 : 1 }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.40)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.28)'; }}>
                    <Ico d={ICONS.save} size={15} />
                    {saving ? 'Saving…' : 'Save Company Settings'}
                </button>
            </div>
        </form>
    );
};

const NotificationSettings = () => {
    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        clockReminders: true,
        payrollAlerts: false,
        overtimeWarnings: true,
        weeklyDigest: false,
        securityAlerts: true,
    });
    const [saved, setSaved] = useState(false);

    const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const notifGroups = [
        {
            title: 'Account Alerts',
            items: [
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive all app notifications via email' },
                { key: 'securityAlerts', label: 'Security Alerts', description: 'Be notified of suspicious logins or password changes' },
            ]
        },
        {
            title: 'Payroll & Work',
            items: [
                { key: 'clockReminders', label: 'Clock In / Out Reminders', description: 'Get reminded to clock in at start of shift and out when done' },
                { key: 'payrollAlerts', label: 'Payroll Processing Alerts', description: 'Notifications when payroll is processed or needs review' },
                { key: 'overtimeWarnings', label: 'Overtime Warnings', description: 'Alert when an employee is approaching overtime threshold' },
                { key: 'weeklyDigest', label: 'Weekly Summary Digest', description: 'Receive a weekly email summarizing key metrics and events' },
            ]
        }
    ];

    return (
        <div>
            <h2 style={styles.sectionTitle}>Notification Preferences</h2>
            <p style={styles.sectionSubtitle}>Control how and when you receive notifications from SmartPayroll.</p>

            {notifGroups.map((group, gi) => (
                <CardSection key={gi} icon={ICONS.bell} title={group.title} desc="">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {group.items.map((item, i) => (
                            <React.Fragment key={item.key}>
                                {i > 0 && <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: 0 }} />}
                                <ToggleSwitch
                                    id={item.key}
                                    label={item.label}
                                    description={item.description}
                                    enabled={prefs[item.key]}
                                    setEnabled={() => toggle(item.key)}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </CardSection>
            ))}

            {saved && (
                <div style={styles.alertSuccess} role="alert">
                    <Ico d={ICONS.check} size={16} />
                    Notification preferences saved!
                </div>
            )}

            <div style={styles.btnFooter}>
                <button type="button" onClick={handleSave}
                    style={styles.btnPrimary}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.40)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.28)'; }}>
                    <Ico d={ICONS.save} size={15} />
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

// ─── Navigation Items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { key: 'Profile', label: 'Profile', icon: ICONS.user, desc: 'Personal info' },
    { key: 'Security', label: 'Security', icon: ICONS.lock, desc: 'Password & access' },
    { key: 'Company', label: 'Company', icon: ICONS.office, desc: 'Company-wide config' },
    { key: 'Notifications', label: 'Notifications', icon: ICONS.bell, desc: 'Alert preferences' },
];

// ─── Main Settings Component ─────────────────────────────────────────────────
const Settings = ({ user, setUser }) => {
    const [activeTab, setActiveTab] = useState('Profile');
    const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile': return <ProfileSettings user={user} setUser={setUser} />;
            case 'Security': return <SecuritySettings />;
            case 'Company': return <CompanySettings />;
            case 'Notifications': return <NotificationSettings />;
            default: return <ProfileSettings user={user} setUser={setUser} />;
        }
    };

    return (
        <div style={styles.page} role="main">
            {/* Settings Sidebar */}
            <aside style={styles.settingsSidebar} aria-label="Settings navigation">
                {/* Avatar */}
                <div style={styles.avatarSection}>
                    <div
                        style={{
                            ...styles.avatar,
                            overflow: 'hidden',
                            border: '3px solid #E0E8F9',
                        }}
                        title="Your avatar"
                        role="img"
                        aria-label={`Avatar for ${user?.firstName} ${user?.lastName}`}
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={`${user?.firstName} ${user?.lastName}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        ) : (
                            initials || '?'
                        )}
                    </div>
                    <p style={styles.avatarName}>{user?.firstName} {user?.lastName}</p>
                    <p style={styles.avatarRole}>{user?.position || 'User'}</p>
                </div>

                {/* Nav */}
                <nav style={styles.navGroup} aria-label="Settings sections">
                    <p style={styles.navGroupLabel}>Options</p>
                    {NAV_ITEMS.map(item => {
                        const isActive = activeTab === item.key;
                        return (
                            <button
                                key={item.key}
                                id={`settings-nav-${item.key.toLowerCase()}`}
                                onClick={() => setActiveTab(item.key)}
                                aria-current={isActive ? 'page' : undefined}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 11,
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: isActive ? '1.5px solid #BFDBFE' : '1.5px solid transparent',
                                    background: isActive ? 'linear-gradient(135deg, #EEF2FF, #DBEAFE)' : 'transparent',
                                    color: isActive ? '#1D4ED8' : '#475569',
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: 13.5,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    marginBottom: 3,
                                    transition: 'all 0.18s',
                                    outline: 'none',
                                    boxShadow: isActive ? '0 2px 8px rgba(37,99,235,0.10)' : 'none',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#1E293B'; } }}
                                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; } }}
                                onFocus={e => { if (!isActive) e.currentTarget.style.background = '#F1F5F9'; }}
                                onBlur={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; } }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                    background: isActive ? 'linear-gradient(135deg,#2563EB,#1D4ED8)' : '#F1F5F9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: isActive ? '#fff' : '#64748B',
                                    transition: 'all 0.18s',
                                }}>
                                    <Ico d={item.icon} size={16} />
                                </div>
                                <div>
                                    <p style={{ lineHeight: 1.2 }}>{item.label}</p>
                                    <p style={{ fontSize: 11, color: isActive ? '#60A5FA' : '#94A3B8', fontWeight: 400, marginTop: 1 }}>{item.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div style={styles.mainContent} id="settings-content" tabIndex={-1}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Settings;
