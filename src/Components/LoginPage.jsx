import React, { useState, useMemo } from 'react';
import logo from '../assets/smartpayroll-logo.png';

/* ─── SVG Icon helper ─── */
const Ic = ({ d, size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
        <path d={d} />
    </svg>
);

/* ─── Icon paths ─── */
const ICON = {
    user:     'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    users:    'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    shield:   'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
    email:    'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    lock:     'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
    eye:      'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    eyeOff:   'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
    building: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
    key:      'M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
    check:    'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    warn:     'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    refresh:  'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
    back:     'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    payroll:  'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
    rocket:   'M12 2.5s4.5 2.04 4.5 10.5c0 2.49-1.04 5.57-1.6 7H9.1C8.54 18.57 7.5 15.49 7.5 13 7.5 4.54 12 2.5 12 2.5zm0 8.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-4.75 9l1.5-2h6.5l1.5 2H7.25z',
    clock:    'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    star:     'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    chart:    'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
};

/* ─── Password strength ─── */
const analysePassword = (pwd) => {
    const checks = {
        length:  pwd.length >= 8,
        upper:   /[A-Z]/.test(pwd),
        lower:   /[a-z]/.test(pwd),
        number:  /[0-9]/.test(pwd),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
};
const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const strengthColor = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#16A34A'];

/* ─── Reusable Field ─── */
const Field = ({ label, icon, error, hint, children, required }) => (
    <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5, letterSpacing: '0.02em' }}>
            {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
        </label>
        <div style={{ position: 'relative' }}>
            {icon && (
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}>
                    <Ic d={icon} size={16} />
                </span>
            )}
            {children}
        </div>
        {hint  && !error && <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{hint}</p>}
        {error && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Ic d={ICON.warn} size={12} color="#EF4444" /> {error}</p>}
    </div>
);

const inputStyle = (hasIcon, hasError, accentColor = '#2563EB') => ({
    width: '100%', padding: hasIcon ? '10px 12px 10px 34px' : '10px 12px',
    border: `1.5px solid ${hasError ? '#FCA5A5' : '#E5E7EB'}`,
    borderRadius: 9, fontSize: 13.5, color: '#111827', outline: 'none',
    background: hasError ? '#FFF5F5' : '#FAFAFA',
    boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s',
    fontFamily: 'inherit',
});

/* ═══════════════════════════════════════════════════════════════
   SCREEN 1 — Role Selector (Premium 3D Look)
═══════════════════════════════════════════════════════════════ */
const RoleSelector = ({ onSelect }) => {
    const [hoveredRole, setHoveredRole] = useState(null);

    const roles = [
        {
            key: 'admin',
            label: 'Administrator',
            tagline: 'Access the payroll dashboard',
            description: 'Manage employees, run payroll, generate reports, and configure company settings.',
            icon: ICON.shield,
            badge: 'Full Access',
            badgeColor: 'linear-gradient(135deg, #2563EB, #0284C7)',
            badgeText: '#fff',
            gradient: '#fff',
            glowColor: 'rgba(37,99,235,0.4)',
            features: ['Employee Management', 'Payroll Processing', 'Reports & Analytics', 'Company Settings'],
            available: true,
            themeColor: '#2563EB'
        },
        {
            key: 'client',
            label: 'Employee / Client',
            tagline: 'View your payslips & info',
            description: 'Access your personal payslips, time records, leave balance, and HR documents.',
            icon: ICON.users,
            badge: 'Self-Service',
            badgeColor: 'linear-gradient(135deg, #475569, #1E293B)',
            badgeText: '#fff',
            gradient: '#fff',
            glowColor: 'rgba(100,116,139,0.4)',
            features: ['View Payslips', 'Time Records', 'Leave Balance', 'HR Documents'],
            available: true,
            themeColor: '#475569'
        },
    ];

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#E2E8F0', // solid cool gray base
            padding: '24px 16px', position: 'relative', overflow: 'hidden',
            perspective: '1200px' // for 3d effect
        }}>
            {/* Ultra Premium 3D Background */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                {/* 3D Grid floor */}
                <div style={{
                    position: 'absolute', bottom: '-40%', left: '-50%', right: '-50%', height: '100%',
                    background: 'linear-gradient(to top, #CBD5E1 0%, transparent 100%)',
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    transform: 'rotateX(75deg) translateY(100px) translateZ(-200px)',
                    transformOrigin: 'bottom center',
                    opacity: 0.8
                }} />
                
                {/* Ambient glowing orbs */}
                <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 60%)', filter: 'blur(40px)' }} />
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
                * { font-family: 'Outfit', sans-serif; }
                
                .role-card { 
                    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); 
                    transform-style: preserve-3d;
                }
                .role-card:hover { 
                    transform: translateY(-15px) rotateX(4deg) rotateY(-2deg) scale(1.03); 
                    z-index: 10;
                }
                .role-card:active {
                    transform: translateY(-5px) scale(0.98);
                }
                
                .feature-pill { animation: fadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:none; } }
                @keyframes float-icon { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
                
                .premium-text-clip {
                    background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            {/* Logo + Header */}
            <div style={{ textAlign: 'center', marginBottom: 50, zIndex: 1, transform: 'translateZ(50px)' }}>
                <div style={{ 
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                    padding: '12px 24px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)'
                }}>
                    <img src={logo} alt="Smart Payroll" style={{ height: 46, width: 'auto', objectFit: 'contain' }} />
                </div>
                
                <h1 className="premium-text-clip" style={{ fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1, dropShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    Choose Your Portal
                </h1>
                <p style={{ fontSize: 18, color: '#475569', marginTop: 12, fontWeight: 500 }}>
                    Select your access level to enter the ecosystem.
                </p>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', zIndex: 1, width: '100%', maxWidth: 960, transformStyle: 'preserve-3d' }}>
                {roles.map((role, ri) => {
                    const isHovered = hoveredRole === role.key;
                    return (
                        <button
                            key={role.key}
                            className="role-card"
                            onClick={() => role.available && onSelect(role.key)}
                            onMouseEnter={() => setHoveredRole(role.key)}
                            onMouseLeave={() => setHoveredRole(null)}
                            disabled={!role.available}
                            aria-label={`Sign in as ${role.label}`}
                            style={{
                                flex: '1 1 380px', maxWidth: 440, minHeight: 460,
                                background: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.9)',
                                borderRadius: 32,
                                padding: '40px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                position: 'relative',
                                // Ultra premium 3D layered shadow
                                boxShadow: isHovered 
                                    ? `0 30px 60px -10px ${role.glowColor}, 0 20px 40px -10px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,1), inset 0 -4px 10px rgba(0,0,0,0.02)` 
                                    : '0 20px 40px -10px rgba(15,23,42,0.08), 0 10px 20px -5px rgba(15,23,42,0.04), inset 0 2px 4px rgba(255,255,255,1), inset 0 -4px 10px rgba(0,0,0,0.02)',
                            }}
                        >
                            {/* Inner Top highlight */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)', borderRadius: '32px 32px 0 0', pointerEvents: 'none' }} />

                            {/* Badge */}
                            <div style={{
                                position: 'absolute', top: 24, right: 24,
                                background: role.badgeColor,
                                borderRadius: 100, padding: '6px 16px',
                                fontSize: 12, fontWeight: 800, color: role.badgeText, letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.3)',
                                transform: 'translateZ(30px)'
                            }}>
                                {role.badge}
                            </div>

                            {/* Floating 3D Icon */}
                            <div style={{
                                width: 80, height: 80, borderRadius: 24,
                                background: isHovered ? `linear-gradient(135deg, ${role.themeColor}, #0F172A)` : '#F1F5F9',
                                border: `2px solid ${isHovered ? 'rgba(255,255,255,0.2)' : '#E2E8F0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 32, transition: 'all 0.4s ease',
                                animation: isHovered ? 'float-icon 3s ease-in-out infinite' : 'none',
                                boxShadow: isHovered ? `0 14px 28px ${role.glowColor}, inset 0 2px 2px rgba(255,255,255,0.4)` : 'inset 0 2px 2px rgba(255,255,255,1), 0 4px 6px rgba(0,0,0,0.05)',
                                transform: 'translateZ(40px)'
                            }}>
                                <Ic d={role.icon} size={36} color={isHovered ? '#fff' : role.themeColor} />
                            </div>

                            <div style={{ transform: 'translateZ(20px)' }}>
                                {/* Text */}
                                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                                    {role.label}
                                </h2>
                                <p style={{ fontSize: 15, color: '#64748B', marginBottom: 24, lineHeight: 1.6, fontWeight: 500 }}>
                                    {role.description}
                                </p>

                                {/* Feature list */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {role.features.map((f, i) => (
                                        <div key={f} className="feature-pill" style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            animationDelay: `${i * 80}ms`,
                                        }}>
                                            <div style={{
                                                width: 22, height: 22, borderRadius: '50%',
                                                background: isHovered ? `${role.themeColor}15` : '#F1F5F9',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                transition: 'background 0.3s'
                                            }}>
                                                <Ic d={ICON.check} size={12} color={isHovered ? role.themeColor : '#64748B'} />
                                            </div>
                                            <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>
                                                {f}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {/* Footer note */}
            <p style={{ marginTop: 36, fontSize: 13, color: '#64748B', zIndex: 1, textAlign: 'center', transform: 'translateZ(10px)', fontWeight: 500 }}>
                <Ic d={ICON.lock} size={12} color="#94A3B8" /> &nbsp;
                256-bit encrypted · Enterprise-grade security
            </p>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   SCREEN 2a — Admin Login / Sign-Up  
═══════════════════════════════════════════════════════════════ */
const AdminPortal = ({ onLoginSuccess, onBack }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');

    const [form, setForm] = useState({ firstName: '', lastName: '', company: '', email: '', password: '', inviteCode: '' });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setFieldErrors(fe => ({ ...fe, [name]: '' }));
        setServerError('');
    };

    const pwdAnalysis = useMemo(() => analysePassword(form.password), [form.password]);

    const handleTabChange = (toSignUp) => {
        setIsSignUp(toSignUp);
        setIsOtpStep(false);
        setOtpCode(''); setGeneratedOtp(''); setOtpError('');
        setServerError(''); setSuccessMsg(''); setFieldErrors({});
        setForm({ firstName: '', lastName: '', company: '', email: '', password: '', inviteCode: '' });
    };

    const validate = () => {
        const errs = {};
        if (isSignUp) {
            if (!form.firstName.trim() || form.firstName.trim().length < 2) errs.firstName = 'At least 2 characters required.';
            if (!form.lastName.trim()  || form.lastName.trim().length  < 2) errs.lastName  = 'At least 2 characters required.';
            if (!form.company.trim()) errs.company = 'Company name is required.';
            if (!form.inviteCode.trim()) errs.inviteCode = 'Invite code is required.';
            if (pwdAnalysis.score < 5) errs.password = 'Password does not meet all requirements.';
        }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email || !emailRe.test(form.email)) errs.email = 'Enter a valid email address.';
        if (!form.password) errs.password = errs.password || 'Password is required.';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (isOtpStep) {
            if (otpCode !== generatedOtp) {
                setOtpError('Invalid verification code.');
                return;
            }
            setLoading(true); setOtpError(''); setSuccessMsg('');
            // OTP matched, perform actual registration
            const url  = '/api/auth/register';
            const body = { firstName: form.firstName, lastName: form.lastName, company: form.company, email: form.email, password: form.password, inviteCode: form.inviteCode };
            try {
                const res  = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                const data = await res.json();
                if (res.ok) {
                    setSuccessMsg('Account verified & created! You can now sign in.'); handleTabChange(false);
                } else {
                    setServerError(data.msg || 'An error occurred.');
                    setIsOtpStep(false);
                }
            } catch { setServerError('Server error.'); setIsOtpStep(false); }
            finally { setLoading(false); }
            return;
        }

        if (!validate()) return;
        setLoading(true); setServerError(''); setSuccessMsg('');

        if (isSignUp) {
            try {
                const res = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email })
                });
                const data = await res.json();
                if (res.ok) {
                    setGeneratedOtp(data.otp);
                    setIsOtpStep(true);
                    setSuccessMsg(`Verification code sent to ${form.email}`);
                } else {
                    setServerError(data.msg || 'Could not send verification email.');
                }
            } catch (err) {
                setServerError('Failed to connect to email server.');
            } finally {
                setLoading(false);
            }
            return;
        }

        // Login Path
        const url = '/api/auth/login';
        const body = { email: form.email, password: form.password };
        try {
            const res  = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if (res.ok) { onLoginSuccess(data.token, data.user); }
            else        { setServerError(data.msg || 'An error occurred.'); }
        } catch { setServerError('Server error. Please try again later.'); }
        finally { setLoading(false); }
    };

    const pwdChecks = [
        { key: 'length',  label: '8+ characters' },
        { key: 'upper',   label: 'Uppercase letter' },
        { key: 'lower',   label: 'Lowercase letter' },
        { key: 'number',  label: 'Number' },
        { key: 'special', label: 'Special character' },
    ];

    const accent = '#2563EB';

    const focusStyle  = (err) => ({ borderColor: err ? '#FCA5A5' : accent, background: '#fff', boxShadow: `0 0 0 3px ${err ? 'rgba(239,68,68,0.12)' : 'rgba(37,99,235,0.14)'}` });
    const blurStyle   = (err) => ({ borderColor: err ? '#FCA5A5' : '#E5E7EB', background: err ? '#FFF5F5' : '#FAFAFA', boxShadow: 'none' });

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(145deg, #F8FAFC 0%, #EFF6FF 50%, #E0F2FE 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes slideIn { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:none; } }
                @keyframes fadeIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
                .admin-card { animation: fadeIn 0.4s ease both; }
                .admin-panel { animation: slideIn 0.5s ease both; }
            `}</style>

            {/* Background dots */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* ── Left Panel (branding) ── */}
            <div className="admin-panel" style={{
                width: '42%', minHeight: '100vh', padding: '48px 48px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', zIndex: 1,
                borderRight: '1px solid rgba(255,255,255,0.07)',
            }}>
                {/* Back button */}
                <div>
                    <button onClick={onBack} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        background: '#fff', border: '1px solid #E2E8F0',
                        borderRadius: 10, padding: '7px 14px', color: '#475569',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0F172A'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#475569'; }}
                    >
                        <Ic d={ICON.back} size={15} /> Change portal
                    </button>
                </div>

                {/* Center branding */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#2563EB,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}>
                            <Ic d={ICON.shield} size={26} color="#fff" />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SmartPayroll</p>
                            <p style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Admin Portal</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0F172A', lineHeight: 1.15, marginBottom: 16, letterSpacing: -0.5 }}>
                        Manage payroll<br />
                        <span style={{ background: 'linear-gradient(90deg,#0EA5E9,#2563EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            effortlessly.
                        </span>
                    </h2>
                    <p style={{ fontSize: 14.5, color: '#64748B', lineHeight: 1.7, maxWidth: 320 }}>
                        Full access to payroll runs, employee management, analytics, and company configuration.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
                        {[
                            { icon: ICON.users,  val: 'Employees',    sub: 'Team Management' },
                            { icon: ICON.payroll, val: 'Payroll',     sub: 'Run & Schedule' },
                            { icon: ICON.chart,   val: 'Analytics',   sub: 'Reports & Insights' },
                        ].map(s => (
                            <div key={s.val} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: '#fff', border: '1px solid #E2E8F0',
                                borderRadius: 12, padding: '10px 16px', flex: '1 1 120px',
                                boxShadow: '0 4px 12px rgba(15,23,42,0.03)'
                            }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Ic d={s.icon} size={16} color="#3B82F6" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{s.val}</p>
                                    <p style={{ fontSize: 10.5, color: '#64748B' }}>{s.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom security badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Ic d={ICON.lock} size={13} color="#94A3B8" />
                    <span style={{ fontSize: 11.5, color: '#64748B' }}>
                        256-bit encrypted · Invite-only access · Passwords hashed
                    </span>
                </div>
            </div>

            {/* ── Right Panel (form) ── */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px 24px', position: 'relative', zIndex: 1,
                overflowY: 'auto',
            }}>
                <div className="admin-card" style={{ width: '100%', maxWidth: 440 }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 14, padding: 5, marginBottom: 28, gap: 5 }}>
                        {['Sign In', 'Sign Up'].map((t, i) => {
                            const active = (i === 1) === isSignUp;
                            return (
                                <button key={t} onClick={() => handleTabChange(i === 1)} style={{
                                    flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                                    fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                                    background: active ? '#fff' : 'transparent',
                                    color: active ? '#0F172A' : '#64748B',
                                    boxShadow: active ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
                                    fontFamily: 'inherit',
                                }}>{t}</button>
                            );
                        })}
                    </div>

                    {/* Card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
                        borderRadius: 20, padding: '32px 36px',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15)',
                    }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                            {isSignUp ? 'Create Admin Account' : 'Admin Sign In'}
                        </h2>
                        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>
                            {isSignUp ? 'Authorized users only — invite code required' : 'Welcome back! Sign in to your dashboard.'}
                        </p>

                        {/* Success msg */}
                        {successMsg && (
                            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Ic d={ICON.check} size={16} color="#16A34A" />
                                <p style={{ fontSize: 13, color: '#15803D', margin: 0 }}>{successMsg}</p>
                            </div>
                        )}

                        <form onSubmit={onSubmit} noValidate>
                            {!isOtpStep ? (
                                <>
                                    {isSignUp && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                <Field label="First Name" icon={ICON.user} error={fieldErrors.firstName} required>
                                                    <input name="firstName" value={form.firstName} onChange={onChange} placeholder="John"
                                                        style={inputStyle(true, !!fieldErrors.firstName, accent)}
                                                        onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                                        onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.firstName))} />
                                                </Field>
                                                <Field label="Last Name" icon={ICON.user} error={fieldErrors.lastName} required>
                                                    <input name="lastName" value={form.lastName} onChange={onChange} placeholder="Doe"
                                                        style={inputStyle(true, !!fieldErrors.lastName, accent)}
                                                        onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                                        onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.lastName))} />
                                                </Field>
                                            </div>
                                            <Field label="Company Name" icon={ICON.building} error={fieldErrors.company} required>
                                                <input name="company" value={form.company} onChange={onChange} placeholder="Acme Corp"
                                                    style={inputStyle(true, !!fieldErrors.company, accent)}
                                                    onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                                    onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.company))} />
                                            </Field>
                                            <Field label="Invite Code" icon={ICON.key} error={fieldErrors.inviteCode} hint="Ask your system administrator for the invite code" required>
                                                <input name="inviteCode" value={form.inviteCode} onChange={onChange} placeholder="SP-XXXX-XXXX"
                                                    style={inputStyle(true, !!fieldErrors.inviteCode, accent)}
                                                    onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                                    onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.inviteCode))} />
                                            </Field>
                                        </>
                                    )}

                                    <Field label="Email Address" icon={ICON.email} error={fieldErrors.email} required>
                                        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="admin@company.com"
                                            style={inputStyle(true, !!fieldErrors.email, accent)}
                                            onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                            onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.email))} />
                                    </Field>

                                    <Field label="Password" icon={ICON.lock} error={fieldErrors.password} required>
                                        <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={onChange}
                                            placeholder={isSignUp ? 'Min 8 chars, uppercase, number, symbol' : 'Enter your password'}
                                            style={{ ...inputStyle(true, !!fieldErrors.password, accent), paddingRight: 40 }}
                                            onFocus={e => Object.assign(e.target.style, focusStyle(!!fieldErrors.password))}
                                            onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.password))} />
                                        <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} style={{
                                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0,
                                        }}>
                                            <Ic d={showPassword ? ICON.eyeOff : ICON.eye} size={17} />
                                        </button>
                                    </Field>

                                    {/* Strength meter */}
                                    {isSignUp && form.password && (
                                        <div style={{ marginBottom: 16, marginTop: -6 }}>
                                            <div style={{ display: 'flex', gap: 4, marginBottom: 7 }}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= pwdAnalysis.score ? strengthColor[pwdAnalysis.score] : '#E5E7EB', transition: 'background 0.3s' }} />
                                                ))}
                                            </div>
                                            <p style={{ fontSize: 11, fontWeight: 600, color: strengthColor[pwdAnalysis.score] || '#9CA3AF', marginBottom: 7 }}>
                                                {strengthLabel[pwdAnalysis.score] || 'Enter a password'}
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px' }}>
                                                {pwdChecks.map(c => (
                                                    <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <Ic d={ICON.check} size={13} color={pwdAnalysis.checks[c.key] ? '#22C55E' : '#D1D5DB'} />
                                                        <span style={{ fontSize: 11, color: pwdAnalysis.checks[c.key] ? '#374151' : '#9CA3AF' }}>{c.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ marginBottom: 20, animation: 'fadeIn 0.4s ease both' }}>
                                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid #BFDBFE' }}>
                                            <Ic d={ICON.email} size={26} color="#2563EB" />
                                        </div>
                                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>Verify your email</h3>
                                        <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>We've sent a 6-digit verification code to<br/><strong style={{color: '#334155'}}>{form.email}</strong></p>
                                    </div>
                                    <Field label="Verification Code" icon={ICON.key} error={otpError} required>
                                        <input type="text" maxLength={6} value={otpCode} onChange={e => {setOtpCode(e.target.value.replace(/\D/g, '')); setOtpError('');}}
                                            placeholder="123456"
                                            style={{ ...inputStyle(true, !!otpError, accent), letterSpacing: 8, fontSize: 18, fontWeight: 700, textAlign: 'center', paddingLeft: 12, paddingRight: 12 }}
                                            onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                            onBlur={e => Object.assign(e.target.style, blurStyle(!!otpError))} />
                                    </Field>
                                    <button type="button" onClick={async () => {
                                        try {
                                            const res = await fetch('/api/auth/send-otp', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ email: form.email })
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                setGeneratedOtp(data.otp);
                                                setSuccessMsg(`New code sent to ${form.email}`);
                                            } else {
                                                setOtpError(data.msg || 'Failed to resend code');
                                            }
                                        } catch (err) {
                                            setOtpError('Network error while resending code');
                                        }
                                    }} style={{ background: 'none', border: 'none', color: accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', margin: '0 auto', display: 'block', padding: '6px 12px' }}>
                                        Resend Code
                                    </button>
                                </div>
                            )}

                            {/* Server error */}
                            {serverError && (
                                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 8 }}>
                                    <Ic d={ICON.warn} size={16} color="#EF4444" />
                                    <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{serverError}</p>
                                </div>
                            )}

                            {/* Submit */}
                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '11px 0', borderRadius: 11, border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #2563EB, #06B6D4)',
                                color: '#fff', fontWeight: 700, fontSize: 14,
                                boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.38)',
                                transition: 'all 0.2s', fontFamily: 'inherit',
                            }}
                                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.5)'; }}}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 16px rgba(37,99,235,0.38)'; }}
                            >
                                {loading ? 'Processing…' : isOtpStep ? 'Verify & Complete Signup' : isSignUp ? 'Continue to Verification →' : 'Sign In to Dashboard'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   SCREEN 2b — Client Self-Service Portal
═══════════════════════════════════════════════════════════════ */
const C = {
    bg:'#F8FAFC',surface:'#ffffff',border:'#E2E8F0',
    accent:'#2563EB',accentDim:'#EFF6FF',text:'#0F172A',muted:'#64748B',warn:'#F59E0B',
};
const PAYSLIPS = [
    {month:'March 2026',gross:7500,tax:1350,pension:450,net:5700,status:'Paid',date:'2026-03-28'},
    {month:'February 2026',gross:7500,tax:1350,pension:450,net:5700,status:'Paid',date:'2026-02-26'},
    {month:'January 2026',gross:7500,tax:1350,pension:450,net:5700,status:'Paid',date:'2026-01-28'},
    {month:'December 2025',gross:8200,tax:1476,pension:492,net:6232,status:'Paid',date:'2025-12-27'},
    {month:'November 2025',gross:7500,tax:1350,pension:450,net:5700,status:'Paid',date:'2025-11-28'},
];
const LEAVE0 = [
    {id:1,type:'Annual Leave',from:'2026-03-18',to:'2026-03-19',days:2,status:'Approved',note:''},
    {id:2,type:'Remote Work', from:'2026-02-10',to:'2026-02-14',days:5,status:'Approved',note:''},
    {id:3,type:'Sick Leave',  from:'2026-01-22',to:'2026-01-22',days:1,status:'Rejected',note:'No medical cert'},
];
const EXP0 = [
    {id:1,desc:'Team lunch',       category:'Meals',    amount:85, date:'2026-03-20',status:'Approved'},
    {id:2,desc:'Cab to office',    category:'Transport',amount:22, date:'2026-03-18',status:'Pending'},
    {id:3,desc:'Office headset',   category:'Equipment',amount:149,date:'2026-02-28',status:'Approved'},
];
const fmtC = n=>`$${(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const SBadge = ({s})=>{
    const m={Approved:['#BBF7D0','#15803D'],Pending:['#FEF9C3','#92400E'],Rejected:['#FEE2E2','#B91C1C'],Paid:['#BBF7D0','#15803D']};
    const [bg,col]=m[s]||['#E5E7EB','#374151'];
    return <span style={{fontSize:11,fontWeight:700,background:bg,color:col,padding:'2px 10px',borderRadius:20}}>{s}</span>;
};
const GCard=({children,style={}})=>(<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:'20px 22px',backdropFilter:'blur(10px)',...style}}>{children}</div>);
const CNavBtn=({label,icon,active,onClick})=>(<button onClick={onClick} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:11,border:'none',cursor:'pointer',background:active?C.accentDim:'transparent',color:active?C.accent:C.muted,fontWeight:active?700:500,fontSize:13.5,fontFamily:'inherit',borderLeft:`3px solid ${active?C.accent:'transparent'}`,transition:'all 0.15s',textAlign:'left'}} onMouseEnter={e=>{if(!active)e.currentTarget.style.background='#F1F5F9';}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent';}}><Ic d={icon} size={17} color={active?C.accent:'#94A3B8'}/>{label}</button>);
const CKpi=({label,value,sub,accent=C.accent})=>(<GCard style={{flex:1,minWidth:130,boxShadow:'0 4px 12px rgba(15,23,42,0.03)'}}><p style={{fontSize:22,fontWeight:800,color:accent,margin:0}}>{value}</p><p style={{fontSize:12,color:C.muted,margin:'3px 0 0',fontWeight:600}}>{label}</p>{sub&&<p style={{fontSize:11,color:'#94A3B8',margin:'2px 0 0'}}>{sub}</p>}</GCard>);
const LBar=({label,left,total,color})=>(<div style={{marginBottom:14}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:13,color:C.text,fontWeight:600}}>{label}</span><span style={{fontSize:13,fontWeight:700,color}}>{left} left <span style={{color:C.muted,fontWeight:400}}>/ {total}</span></span></div><div style={{height:6,background:'#E2E8F0',borderRadius:4,overflow:'hidden'}}><div style={{height:'100%',width:`${(left/total)*100}%`,background:color,borderRadius:4}}/></div></div>);
const CI={home:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',slip:'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',time:'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',exp:'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',prof:'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',dl:'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',plus:'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',send:'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z',out:'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z'};
const CTABS=[{k:'home',l:'Dashboard',i:CI.home},{k:'payslips',l:'Payslips',i:CI.slip},{k:'timeoff',l:'Time Off',i:CI.time},{k:'expenses',l:'Expenses',i:CI.exp},{k:'profile',l:'Profile',i:CI.prof}];
const cinp={width:'100%',padding:'9px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:9,fontSize:13,color:'#0F172A',outline:'none',fontFamily:'inherit',boxSizing:'border-box'};
const clbl={fontSize:11,fontWeight:700,color:'#64748B',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8,display:'block'};

const ClientDashboard = ({ onBack }) => {
    const [tab,setTab]=useState('home');
    const [leaves,setLeaves]=useState(LEAVE0);
    const [exps,setExps]=useState(EXP0);
    const [toast,setToast]=useState(null);
    const [avatarPreview, setAvatarPreview] = useState(localStorage.getItem('client_avatar') || null);
    const fileInputRef = React.useRef(null);
    const [lF,setLF]=useState({type:'Annual Leave',from:'',to:'',note:''});
    const [eF,setEF]=useState({desc:'',category:'Meals',amount:'',date:'',receipt:false});
    const showToast=(m,ok=true)=>{setToast({m,ok});setTimeout(()=>setToast(null),2600);};
    const submitLeave=ev=>{ev.preventDefault();if(!lF.from||!lF.to)return showToast('Fill all fields.',false);const d=Math.max(1,Math.round((new Date(lF.to)-new Date(lF.from))/86400000)+1);setLeaves(p=>[{id:Date.now(),...lF,days:d,status:'Pending'},...p]);setLF({type:'Annual Leave',from:'',to:'',note:''});showToast('Request submitted!');};
    const submitExp=ev=>{ev.preventDefault();if(!eF.desc||!eF.amount||!eF.date)return showToast('Fill all fields.',false);setExps(p=>[{id:Date.now(),...eF,amount:parseFloat(eF.amount),status:'Pending'},...p]);setEF({desc:'',category:'Meals',amount:'',date:'',receipt:false});showToast('Claim submitted!');};
    const bdr=`1px solid ${C.border}`;
    return (
        <div style={{minHeight:'100vh',background:C.bg,display:'flex',fontFamily:'system-ui,sans-serif'}}>
            <style>{`@keyframes sIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}@keyframes tIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1}}*{box-sizing:border-box}select option{background:#fff;color:#0F172A}`}</style>
            {toast&&<div style={{position:'fixed',top:20,right:20,zIndex:9999,background:toast.ok?'#FAFAFA':'#FEF2F2',border:`1px solid ${toast.ok?'#E2E8F0':'#FECACA'}`,color:toast.ok?'#0F172A':'#DC2626',padding:'12px 20px',borderRadius:12,fontSize:13.5,fontWeight:600,boxShadow:'0 8px 28px rgba(0,0,0,0.1)',animation:'tIn 0.25s ease',display:'flex',alignItems:'center',gap:8}}><Ic d={toast.ok?ICON.check:ICON.warn} size={16} color={toast.ok?'#10B981':'#EF4444'}/>{toast.m}</div>}
            <div style={{width:210,background:'#fff',borderRight:bdr,display:'flex',flexDirection:'column',padding:'22px 12px',flexShrink:0}}>
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'0 4px',marginBottom:24}}>
                    <div style={{width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#2563EB,#06B6D4)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,color:'#fff',boxShadow:'0 4px 12px rgba(37,99,235,0.3)'}}>S</div>
                    <div><p style={{fontWeight:800,fontSize:14,color:C.text,margin:0}}>SmartPayroll</p><p style={{fontSize:10.5,color:C.muted,margin:0}}>Employee Portal</p></div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:3,flex:1}}>{CTABS.map(t=><CNavBtn key={t.k} label={t.l} icon={t.i} active={tab===t.k} onClick={()=>setTab(t.k)}/>)}</div>
                <div style={{borderTop:bdr,paddingTop:14}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,padding:'0 4px',marginBottom:10}}>
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Profile" style={{width:32,height:32,borderRadius:'50%',objectFit:'cover'}} />
                        ) : (
                            <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,color:'#fff'}}>NP</div>
                        )}
                        <div><p style={{fontWeight:700,fontSize:12,color:C.text,margin:0}}>Netra Mani</p><p style={{fontSize:11,color:C.muted,margin:0}}>Employee</p></div>
                    </div>
                    <button onClick={onBack} style={{width:'100%',display:'flex',alignItems:'center',gap:7,padding:'8px 12px',borderRadius:9,border:'none',background:'rgba(248,113,113,0.12)',color:'#F87171',fontSize:12.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                        <Ic d={CI.out} size={14} color="#F87171"/> Sign Out
                    </button>
                </div>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:'30px 34px',animation:'sIn 0.22s ease'}}>

                {tab==='home'&&<div>
                    <h1 style={{fontSize:23,fontWeight:800,color:C.text,margin:'0 0 4px'}}>Good {new Date().getHours()<12?'morning':'afternoon'}, Netra Mani 👋</h1>
                    <p style={{fontSize:13,color:C.muted,marginBottom:22}}>Your payroll overview for March 2026.</p>
                    <div style={{display:'flex',gap:13,marginBottom:20,flexWrap:'wrap'}}>
                        <CKpi label="Monthly Net Pay" value={fmtC(5700)}  sub="After all deductions"  accent="#2563EB"/>
                        <CKpi label="Annual Gross"    value="$90,000"     sub="Total earnings 2026"  accent="#0EA5E9"/>
                        <CKpi label="Tax (YTD)"       value={fmtC(16200)} sub="PAYE year-to-date"    accent="#F43F5E"/>
                        <CKpi label="Leave Days Left" value={17}           sub="Annual leave balance"  accent="#F59E0B"/>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:16,marginBottom:16}}>
                        <GCard>
                            <p style={{...clbl}}>Latest Payslip — March 2026</p>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:16}}>
                                <div><p style={{fontSize:28,fontWeight:900,color:C.accent,margin:0}}>{fmtC(5700)}</p><p style={{fontSize:12,color:C.muted,margin:'3px 0 0'}}>Net Pay · Paid 2026-03-28</p></div>
                                <SBadge s="Paid"/>
                            </div>
                            {[['Gross Pay',fmtC(7500),C.text],['Income Tax',`-${fmtC(1350)}`,'#F87171'],['Pension',`-${fmtC(450)}`,'#FBBF24']].map(([l,v,col])=>(
                                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:bdr}}>
                                    <span style={{fontSize:13,color:C.muted}}>{l}</span><span style={{fontSize:13,fontWeight:700,color:col}}>{v}</span>
                                </div>
                            ))}
                            <button onClick={()=>showToast('Downloading March 2026 payslip…')} style={{marginTop:14,width:'100%',padding:'8px 0',borderRadius:9,border:`1px solid ${C.accent}`,background:C.accentDim,color:C.accent,fontWeight:700,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontFamily:'inherit'}}>
                                <Ic d={CI.dl} size={14} color={C.accent}/> Download Payslip
                            </button>
                        </GCard>
                        <GCard>
                            <p style={{...clbl}}>Leave Balances</p>
                            <LBar label="Annual Leave" left={17} total={25} color="#2563EB"/>
                            <LBar label="Sick Leave"   left={7}  total={10} color="#F43F5E"/>
                            <LBar label="Remote Work"  left={40} total={52} color="#0EA5E9"/>
                            <button onClick={()=>setTab('timeoff')} style={{marginTop:8,width:'100%',padding:'8px 0',borderRadius:9,border:bdr,background:'transparent',color:C.muted,fontWeight:600,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>+ Request Time Off</button>
                        </GCard>
                    </div>
                    <GCard><p style={{...clbl}}>Recent Activity</p>
                        {[['March 2026 payslip paid','2 days ago','#2563EB'],['Annual leave approved (2 days)','12 days ago','#0EA5E9'],['Expense claim $85 approved','18 days ago','#F59E0B'],['February 2026 payslip paid','1 month ago','#2563EB']].map(([t,d,col],i,a)=>(
                            <div key={t} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderBottom:i<a.length-1?bdr:'none'}}>
                                <div style={{width:8,height:8,borderRadius:'50%',background:col,flexShrink:0}}/>
                                <p style={{flex:1,fontSize:13,color:C.text,margin:0}}>{t}</p>
                                <span style={{fontSize:11,color:C.muted,flexShrink:0}}>{d}</span>
                            </div>
                        ))}
                    </GCard>
                </div>}

                {tab==='payslips'&&<div>
                    <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>Payslips</h2>
                    <p style={{fontSize:13,color:C.muted,marginBottom:22}}>Download your monthly pay statements.</p>
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                        {PAYSLIPS.map((p,i)=>(
                            <GCard key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'15px 20px'}}>
                                <div style={{width:42,height:42,borderRadius:11,background:C.accentDim,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ic d={CI.slip} size={22} color={C.accent}/></div>
                                <div style={{flex:1}}>
                                    <p style={{fontWeight:700,fontSize:14,color:C.text,margin:0}}>{p.month}</p>
                                    <p style={{fontSize:12,color:C.muted,margin:'2px 0 0'}}>Gross {fmtC(p.gross)} · Tax {fmtC(p.tax)} · Pension {fmtC(p.pension)}</p>
                                </div>
                                <div style={{textAlign:'right'}}><p style={{fontWeight:800,fontSize:17,color:C.accent,margin:0}}>{fmtC(p.net)}</p><p style={{fontSize:11,color:C.muted,margin:'2px 0 0'}}>Net Pay</p></div>
                                <SBadge s={p.status}/>
                                <button onClick={()=>showToast(`Downloading ${p.month}…`)} style={{padding:'7px 13px',borderRadius:9,border:`1px solid ${C.accent}`,background:C.accentDim,color:C.accent,fontWeight:700,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontFamily:'inherit'}}>
                                    <Ic d={CI.dl} size={13} color={C.accent}/> PDF
                                </button>
                            </GCard>
                        ))}
                    </div>
                </div>}

                {tab==='timeoff'&&<div>
                    <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>Time Off</h2>
                    <p style={{fontSize:13,color:C.muted,marginBottom:22}}>Request leave and view status.</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:18,marginBottom:18}}>
                        <GCard><p style={{...clbl}}>Balances</p><LBar label="Annual Leave" left={17} total={25} color="#2563EB"/><LBar label="Sick Leave" left={7} total={10} color="#F43F5E"/><LBar label="Remote Work" left={40} total={52} color="#0EA5E9"/></GCard>
                        <GCard><p style={{...clbl}}>New Request</p>
                            <form onSubmit={submitLeave}>
                                <span style={clbl}>Type</span>
                                <select value={lF.type} onChange={e=>setLF(f=>({...f,type:e.target.value}))} style={{...cinp,marginBottom:10}}>
                                    {['Annual Leave','Sick Leave','Remote Work','Parental Leave'].map(t=><option key={t}>{t}</option>)}
                                </select>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                                    <div><span style={clbl}>From</span><input type="date" value={lF.from} onChange={e=>setLF(f=>({...f,from:e.target.value}))} style={cinp}/></div>
                                    <div><span style={clbl}>To</span><input type="date" value={lF.to} onChange={e=>setLF(f=>({...f,to:e.target.value}))} style={cinp}/></div>
                                </div>
                                <span style={clbl}>Note</span>
                                <textarea value={lF.note} onChange={e=>setLF(f=>({...f,note:e.target.value}))} rows={2} placeholder="Optional…" style={{...cinp,resize:'vertical',marginBottom:12}}/>
                                <button type="submit" style={{width:'100%',padding:'9px 0',borderRadius:10,border:'none',background:'linear-gradient(135deg,#2563EB,#0EA5E9)',color:'#fff',fontWeight:700,fontSize:13.5,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:7,boxShadow:'0 4px 12px rgba(37,99,235,0.2)'}}>
                                    <Ic d={CI.send} size={14} color="#fff"/> Submit Request
                                </button>
                            </form>
                        </GCard>
                    </div>
                    <GCard><p style={{...clbl}}>History</p>
                        {leaves.map((l,i)=>(
                            <div key={l.id} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderBottom:i<leaves.length-1?bdr:'none'}}>
                                <div style={{flex:1}}>
                                    <p style={{fontSize:13,fontWeight:700,color:C.text,margin:0}}>{l.type}</p>
                                    <p style={{fontSize:12,color:C.muted,margin:'2px 0 0'}}>{l.from} → {l.to} · {l.days} day{l.days!==1?'s':''}</p>
                                    {l.note&&<p style={{fontSize:11,color:C.warn,margin:'2px 0 0'}}>{l.note}</p>}
                                </div>
                                <SBadge s={l.status}/>
                            </div>
                        ))}
                    </GCard>
                </div>}

                {tab==='expenses'&&<div>
                    <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>Expenses</h2>
                    <p style={{fontSize:13,color:C.muted,marginBottom:22}}>Submit reimbursement claims.</p>
                    <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18}}>
                        <GCard><p style={{...clbl}}>My Claims</p>
                            {exps.map((e,i)=>(
                                <div key={e.id} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderBottom:i<exps.length-1?bdr:'none'}}>
                                    <div style={{flex:1}}><p style={{fontSize:13,fontWeight:700,color:C.text,margin:0}}>{e.desc}</p><p style={{fontSize:11,color:C.muted,margin:'2px 0 0'}}>{e.category} · {e.date}</p></div>
                                    <span style={{fontSize:14,fontWeight:800,color:C.accent}}>{fmtC(e.amount)}</span>
                                    <SBadge s={e.status}/>
                                </div>
                            ))}
                        </GCard>
                        <GCard><p style={{...clbl}}>New Claim</p>
                            <form onSubmit={submitExp}>
                                <span style={clbl}>Description</span>
                                <input value={eF.desc} onChange={e=>setEF(f=>({...f,desc:e.target.value}))} placeholder="e.g. Team lunch" style={{...cinp,marginBottom:10}}/>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                                    <div><span style={clbl}>Category</span>
                                        <select value={eF.category} onChange={e=>setEF(f=>({...f,category:e.target.value}))} style={cinp}>
                                            {['Meals','Transport','Equipment','Travel','Other'].map(c=><option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div><span style={clbl}>Amount ($)</span><input type="number" value={eF.amount} onChange={e=>setEF(f=>({...f,amount:e.target.value}))} placeholder="0.00" style={cinp}/></div>
                                </div>
                                <span style={clbl}>Date</span>
                                <input type="date" value={eF.date} onChange={e=>setEF(f=>({...f,date:e.target.value}))} style={{...cinp,marginBottom:12}}/>
                                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginBottom:14}}>
                                    <input type="checkbox" checked={eF.receipt} onChange={e=>setEF(f=>({...f,receipt:e.target.checked}))}/>
                                    <span style={{fontSize:13,color:C.muted}}>Receipt attached</span>
                                </label>
                                <button type="submit" style={{width:'100%',padding:'9px 0',borderRadius:10,border:'none',background:'linear-gradient(135deg,#2563EB,#0EA5E9)',color:'#fff',fontWeight:700,fontSize:13.5,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:7,boxShadow:'0 4px 12px rgba(37,99,235,0.2)'}}>
                                    <Ic d={CI.plus} size={14} color="#fff"/> Submit Claim
                                </button>
                            </form>
                        </GCard>
                    </div>
                </div>}

                {tab==='profile'&&<div>
                    <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>My Profile</h2>
                    <p style={{fontSize:13,color:C.muted,marginBottom:22}}>Employment and compensation details.</p>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:18}}>
                        <GCard>
                            <div style={{textAlign:'center',marginBottom:18}}>
                                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }}
                                       onChange={(e) => {
                                           const file = e.target.files[0];
                                           if (file) {
                                               if (file.size > 5 * 1024 * 1024) return showToast('Image must be under 5MB.', false);
                                               const reader = new FileReader();
                                               reader.onload = (ev) => {
                                                   const base64 = ev.target.result;
                                                   setAvatarPreview(base64);
                                                   localStorage.setItem('client_avatar', base64);
                                                   showToast('Profile photo updated!');
                                               };
                                               reader.readAsDataURL(file);
                                           }
                                       }} />
                                <div onClick={() => fileInputRef.current?.click()} style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#3B82F6,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:'#fff',margin:'0 auto 10px',boxShadow:'0 4px 12px rgba(37,99,235,0.2)', cursor: 'pointer', overflow: 'hidden', position: 'relative'}}
                                     title="Click to upload picture">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : 'NP'}
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                        <Ic d={ICON.upload || "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"} size={20} color="#fff" />
                                    </div>
                                </div>
                                <p style={{fontWeight:800,fontSize:15,color:C.text,margin:0}}>Netra Mani Pokhrel</p>
                                <p style={{fontSize:12,color:C.accent,margin:'2px 0 0'}}>Senior Developer</p>
                                <p style={{fontSize:12,color:C.muted,margin:'1px 0 0'}}>Engineering</p>
                            </div>
                            {[['Employee ID','EMP-2024-001'],['Join Date','Mar 12, 2024'],['Email','netramanipkr@gmail.com'],['Phone','+977-9800000000']].map(([l,v])=>(
                                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:bdr}}>
                                    <span style={{fontSize:12.5,color:C.muted}}>{l}</span><span style={{fontSize:12.5,fontWeight:600,color:C.text}}>{v}</span>
                                </div>
                            ))}
                        </GCard>
                        <div style={{display:'flex',flexDirection:'column',gap:16}}>
                            <GCard><p style={{...clbl}}>Compensation</p>
                                {[['Annual Gross','$90,000.00',C.text],['Monthly Net',fmtC(5700),'#2563EB'],['Tax Withheld (YTD)',fmtC(16200),'#F43F5E'],['Pension (YTD)',fmtC(5400),'#F59E0B'],['NI Contribution',fmtC(900),'#0EA5E9']].map(([l,v,col])=>(
                                    <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:bdr}}>
                                        <span style={{fontSize:13,color:C.muted}}>{l}</span><span style={{fontSize:13,fontWeight:700,color:col}}>{v}</span>
                                    </div>
                                ))}
                            </GCard>
                            <GCard><p style={{...clbl}}>Benefits</p>
                                {['Health Insurance (Family Cover)','Pension Plan (6% employer match)','Flexible Working Hours','25 Days Annual Leave','Remote Work Allowance'].map(b=>(
                                    <div key={b} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0'}}>
                                        <Ic d={ICON.check} size={14} color={C.accent}/><span style={{fontSize:13,color:C.text}}>{b}</span>
                                    </div>
                                ))}
                            </GCard>
                        </div>
                    </div>
                </div>}

            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   Client Auth (Employee Login & Signup)
═══════════════════════════════════════════════════════════════ */
const ClientAuth = ({ onLogin, onBack }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');

    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setFieldErrors(fe => ({ ...fe, [name]: '' }));
        setServerError('');
    };

    const pwdAnalysis = useMemo(() => analysePassword(form.password), [form.password]);

    const handleTabChange = (toSignUp) => {
        setIsSignUp(toSignUp);
        setIsOtpStep(false);
        setOtpCode(''); setGeneratedOtp(''); setOtpError('');
        setServerError(''); setSuccessMsg(''); setFieldErrors({});
        setForm({ firstName: '', lastName: '', email: '', password: '' });
    };

    const validate = () => {
        const errs = {};
        if (isSignUp) {
            if (!form.firstName.trim() || form.firstName.trim().length < 2) errs.firstName = 'At least 2 characters required.';
            if (!form.lastName.trim()  || form.lastName.trim().length  < 2) errs.lastName  = 'At least 2 characters required.';
            if (pwdAnalysis.score < 5) errs.password = 'Password does not meet all requirements.';
        }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email || !emailRe.test(form.email)) errs.email = 'Enter a valid email address.';
        if (!form.password) errs.password = errs.password || 'Password is required.';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (isOtpStep) {
            if (otpCode !== generatedOtp) {
                setOtpError('Invalid verification code.');
                return;
            }
            setLoading(true); setOtpError(''); setSuccessMsg('');
            // Usually we'd register here, but for client auth we requested admin approval. 
            // Mock the final registration step since the backend doesn't have an endpoint for client signup yet.
            setTimeout(() => {
                setLoading(false);
                setSuccessMsg('Account verified & requested! Please wait for Admin approval.');
                setTimeout(() => handleTabChange(false), 2000);
            }, 400);
            return;
        }

        if (!validate()) return;
        setLoading(true); setServerError(''); setSuccessMsg('');
        
        if (isSignUp) {
            try {
                const res = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email })
                });
                const data = await res.json();
                if (res.ok) {
                    setGeneratedOtp(data.otp);
                    setIsOtpStep(true);
                    setSuccessMsg(`Verification code sent to ${form.email}`);
                } else {
                    setServerError(data.msg || 'Could not send verification email.');
                }
            } catch (err) {
                setServerError('Failed to connect to email server.');
            } finally {
                setLoading(false);
            }
        } else {
            setTimeout(() => {
                setLoading(false);
                onLogin();
            }, 400);
        }
    };

    const pwdChecks = [
        { key: 'length',  label: '8+ characters' },
        { key: 'upper',   label: 'Uppercase letter' },
        { key: 'lower',   label: 'Lowercase letter' },
        { key: 'number',  label: 'Number' },
        { key: 'special', label: 'Special character' },
    ];

    const accent = '#06b6d4'; // Cyan for client (to distinguish from Admin Blue)

    const focusStyle  = (err) => ({ borderColor: err ? '#FCA5A5' : accent, background: '#fff', boxShadow: `0 0 0 3px ${err ? 'rgba(239,68,68,0.12)' : 'rgba(6,182,212,0.14)'}` });
    const blurStyle   = (err) => ({ borderColor: err ? '#FCA5A5' : '#E5E7EB', background: err ? '#FFF5F5' : '#FAFAFA', boxShadow: 'none' });

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(145deg, #F0FDFA 0%, #ECFEFF 50%, #E0F2FE 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes slideInRight { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:none; } }
                @keyframes fadeInData  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
                .client-card { animation: fadeInData 0.4s ease both; }
                .client-panel { animation: slideInRight 0.5s ease both; }
            `}</style>
            
            {/* Background dots & Orbs */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.02) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* ── Left Panel (branding) ── */}
            <div className="client-panel" style={{
                width: '42%', minHeight: '100vh', padding: '48px 48px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', zIndex: 1,
                borderRight: '1px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
            }}>
                <div>
                    <button onClick={onBack} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        background: '#fff', border: '1px solid #E2E8F0',
                        borderRadius: 10, padding: '7px 14px', color: '#475569',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0F172A'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#475569'; }}
                    >
                        <Ic d={ICON.back} size={15} /> Change portal
                    </button>
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(6,182,212,0.25)' }}>
                            <Ic d={ICON.users} size={26} color="#fff" />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SmartPayroll</p>
                            <p style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Client / Employee</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0F172A', lineHeight: 1.15, marginBottom: 16, letterSpacing: -0.5 }}>
                        Access your work<br />
                        <span style={{ background: 'linear-gradient(90deg,#0ea5e9,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            seamlessly.
                        </span>
                    </h2>
                    <p style={{ fontSize: 14.5, color: '#64748B', lineHeight: 1.7, maxWidth: 320 }}>
                        View monthly payslips, manage time off requests, submit expense claims, and update your personal profile.
                    </p>

                    <div style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
                        {[
                            { icon: ICON.clock,    val: 'Time Off',     sub: 'Vacation & Sick days' },
                            { icon: ICON.building, val: 'Expenses',     sub: 'Claims & Receipts' },
                            { icon: ICON.user,     val: 'Payslips',     sub: 'Monthly PDF Statements' },
                        ].map(s => (
                            <div key={s.val} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: '#fff', border: '1px solid #E2E8F0',
                                borderRadius: 12, padding: '10px 16px', flex: '1 1 120px',
                                boxShadow: '0 4px 12px rgba(15,23,42,0.03)'
                            }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Ic d={s.icon} size={16} color="#06b6d4" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{s.val}</p>
                                    <p style={{ fontSize: 10.5, color: '#64748B' }}>{s.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Ic d={ICON.lock} size={13} color="#94A3B8" />
                    <span style={{ fontSize: 11.5, color: '#64748B' }}>
                        Secure end-to-end encryption · Employer approved access
                    </span>
                </div>
            </div>

            {/* ── Right Panel (form) ── */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px 24px', position: 'relative', zIndex: 1,
                overflowY: 'auto',
            }}>
                <div className="client-card" style={{ width: '100%', maxWidth: 440 }}>
                    <div style={{ display: 'flex', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: 5, marginBottom: 28, gap: 5 }}>
                        {['Sign In', 'Sign Up'].map((t, i) => {
                            const active = (i === 1) === isSignUp;
                            return (
                                <button key={t} onClick={() => handleTabChange(i === 1)} style={{
                                    flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                                    fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                                    background: active ? '#fff' : 'transparent',
                                    color: active ? '#0F172A' : '#64748B',
                                    boxShadow: active ? '0 2px 8px rgba(15,23,42,0.05)' : 'none',
                                    fontFamily: 'inherit',
                                }}>{t}</button>
                            );
                        })}
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
                        borderRadius: 20, padding: '32px 36px',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.4)',
                    }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                            {isSignUp ? 'Request Access' : 'Client Sign In'}
                        </h2>
                        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>
                            {isSignUp ? 'Register for self-service portal access.' : 'Welcome back! Sign in to your portal.'}
                        </p>

                        {successMsg && (
                            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Ic d={ICON.check} size={16} color="#16A34A" />
                                <p style={{ fontSize: 13, color: '#15803D', margin: 0 }}>{successMsg}</p>
                            </div>
                        )}

                        <form onSubmit={onSubmit} noValidate>
                            {!isOtpStep ? (
                                <>
                                    {isSignUp && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            <Field label="First Name" icon={ICON.user} error={fieldErrors.firstName} required>
                                                <input name="firstName" value={form.firstName} onChange={onChange} placeholder="Jane"
                                                    style={inputStyle(true, !!fieldErrors.firstName, accent)}
                                                    onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                                    onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.firstName))} />
                                            </Field>
                                            <Field label="Last Name" icon={ICON.user} error={fieldErrors.lastName} required>
                                                <input name="lastName" value={form.lastName} onChange={onChange} placeholder="Smith"
                                                    style={inputStyle(true, !!fieldErrors.lastName, accent)}
                                                    onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                                    onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.lastName))} />
                                            </Field>
                                        </div>
                                    )}

                                    <Field label="Email Address" icon={ICON.email} error={fieldErrors.email} required>
                                        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="jane@company.com"
                                            style={inputStyle(true, !!fieldErrors.email, accent)}
                                            onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                            onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.email))} />
                                    </Field>

                                    <Field label="Password" icon={ICON.lock} error={fieldErrors.password} required>
                                        <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={onChange}
                                            placeholder={isSignUp ? 'Min 8 chars, uppercase, number, symbol' : 'Enter your password'}
                                            style={{ ...inputStyle(true, !!fieldErrors.password, accent), paddingRight: 40 }}
                                            onFocus={e => Object.assign(e.target.style, focusStyle(!!fieldErrors.password))}
                                            onBlur={e => Object.assign(e.target.style, blurStyle(!!fieldErrors.password))} />
                                        <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} style={{
                                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0,
                                        }}>
                                            <Ic d={showPassword ? ICON.eyeOff : ICON.eye} size={17} />
                                        </button>
                                    </Field>

                                    {isSignUp && form.password && (
                                        <div style={{ marginBottom: 16, marginTop: -6 }}>
                                            <div style={{ display: 'flex', gap: 4, marginBottom: 7 }}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= pwdAnalysis.score ? strengthColor[pwdAnalysis.score] : '#E5E7EB', transition: 'background 0.3s' }} />
                                                ))}
                                            </div>
                                            <p style={{ fontSize: 11, fontWeight: 600, color: strengthColor[pwdAnalysis.score] || '#9CA3AF', marginBottom: 7 }}>
                                                {strengthLabel[pwdAnalysis.score] || 'Enter a password'}
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px' }}>
                                                {pwdChecks.map(c => (
                                                    <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <Ic d={ICON.check} size={13} color={pwdAnalysis.checks[c.key] ? '#22C55E' : '#D1D5DB'} />
                                                        <span style={{ fontSize: 11, color: pwdAnalysis.checks[c.key] ? '#374151' : '#9CA3AF' }}>{c.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ marginBottom: 20, animation: 'fadeInData 0.4s ease both' }}>
                                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid #A5F3FC' }}>
                                            <Ic d={ICON.email} size={26} color="#0891B2" />
                                        </div>
                                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>Verify your email</h3>
                                        <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>We've sent a 6-digit verification code to<br/><strong style={{color: '#334155'}}>{form.email}</strong></p>
                                    </div>
                                    <Field label="Verification Code" icon={ICON.key} error={otpError} required>
                                        <input type="text" maxLength={6} value={otpCode} onChange={e => {setOtpCode(e.target.value.replace(/\D/g, '')); setOtpError('');}}
                                            placeholder="123456"
                                            style={{ ...inputStyle(true, !!otpError, accent), letterSpacing: 8, fontSize: 18, fontWeight: 700, textAlign: 'center', paddingLeft: 12, paddingRight: 12 }}
                                            onFocus={e => Object.assign(e.target.style, focusStyle(false))}
                                            onBlur={e => Object.assign(e.target.style, blurStyle(!!otpError))} />
                                    </Field>
                                    <button type="button" onClick={async () => {
                                        try {
                                            const res = await fetch('/api/auth/send-otp', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ email: form.email })
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                setGeneratedOtp(data.otp);
                                                setSuccessMsg(`New code sent to ${form.email}`);
                                            } else {
                                                setOtpError(data.msg || 'Failed to resend code');
                                            }
                                        } catch (err) {
                                            setOtpError('Network error while resending code');
                                        }
                                    }} style={{ background: 'none', border: 'none', color: accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', margin: '0 auto', display: 'block', padding: '6px 12px' }}>
                                        Resend Code
                                    </button>
                                </div>
                            )}

                            {serverError && (
                                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 8 }}>
                                    <Ic d={ICON.warn} size={16} color="#EF4444" />
                                    <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{serverError}</p>
                                </div>
                            )}

                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '11px 0', borderRadius: 11, border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                                color: '#fff', fontWeight: 700, fontSize: 14,
                                boxShadow: loading ? 'none' : '0 4px 16px rgba(6,182,212,0.38)',
                                transition: 'all 0.2s', fontFamily: 'inherit',
                            }}
                                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(6,182,212,0.5)'; }}}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 16px rgba(6,182,212,0.38)'; }}
                            >
                                {loading ? 'Processing…' : isOtpStep ? 'Verify & Complete Signup' : isSignUp ? 'Continue to Verification →' : 'Sign In to Portal'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientPortal = ({ onBack }) => {
    const [auth, setAuth] = useState(false);
    if (!auth) return <ClientAuth onLogin={() => setAuth(true)} onBack={onBack} />;
    return <ClientDashboard onBack={() => setAuth(false)} />;
};

/* ═══════════════════════════════════════════════════════════════
   Root: orchestrates all 3 screens
═══════════════════════════════════════════════════════════════ */
const LoginPage = ({ onLoginSuccess }) => {
    // 'select' | 'admin' | 'client'
    const [screen, setScreen] = useState('select');

    if (screen === 'admin')  return <AdminPortal  onLoginSuccess={onLoginSuccess} onBack={() => setScreen('select')} />;
    if (screen === 'client') return <ClientPortal onBack={() => setScreen('admin')} />;
    return <RoleSelector onSelect={setScreen} />;
};

export default LoginPage;
