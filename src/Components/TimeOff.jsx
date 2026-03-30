import React, { useState, useMemo } from 'react';

const Ic = ({ d, size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true"><path d={d} /></svg>
);
const ICONS = {
    check:  'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    clock:  'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    add:    'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    close:  'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    warn:   'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    info:   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    beach:  'M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21zm4.417-9.015c-1.538 0-2.944.74-3.837 1.976l-3.186-3.207C12.068 2.816 14.666 2 17.544 2c2.895 0 5.49.818 7.059 2.162l-1.42 1.42c-.483.483-1.193.583-1.818.337-.913-.36-1.897-.534-2.84-.534zM7.524 12.47l-3.19-3.19C4.34 9.78 4 10.38 4 11c0 .82.52 1.5 1.265 1.735l.61.197c1.302.421 2.705.484 4.036.166l-2.39-2.628zM8.93 5.27c-1.31 0-2.58.36-3.66 1.04L3.84 4.89C5.27 3.69 7.05 3 8.93 3c2.25 0 4.3.9 5.79 2.36l-1.42 1.42C12.19 5.71 10.61 5.27 8.93 5.27z',
    plane:  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    doc:    'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    chart:  'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
    people: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
};

// ── Types ─────────────────────────────────────────────────────────────────────
const LEAVE_TYPES = [
    { key: 'annual',  label: 'Annual Leave',   color: '#2563EB', bg: '#EEF2FF' },
    { key: 'sick',    label: 'Sick Leave',      color: '#EF4444', bg: '#FEF2F2' },
    { key: 'remote',  label: 'Remote Work',     color: '#8B5CF6', bg: '#F5F3FF' },
    { key: 'parental',label: 'Parental Leave',  color: '#F59E0B', bg: '#FFFBEB' },
    { key: 'unpaid',  label: 'Unpaid Leave',    color: '#6B7280', bg: '#F9FAFB' },
];

const STATUS_META = {
    approved: { label: 'Approved', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
    pending:  { label: 'Pending',  color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
};

// ── Demo data seeded from employees list ────────────────────────────────────
const seedRequests = (employees) => {
    const types = Object.keys(LEAVE_TYPES.reduce((a, t) => { a[t.key] = t; return a; }, {}));
    const statuses = ['approved', 'pending', 'pending', 'approved', 'rejected'];
    const now = new Date();
    return employees.slice(0, 8).map((emp, i) => {
        const start = new Date(now.getTime() + (i - 3) * 4 * 86400000);
        const end   = new Date(start.getTime() + (i % 3 + 1) * 86400000);
        const days  = Math.round((end - start) / 86400000) + 1;
        return {
            id: `req-${i}`,
            employeeId: emp._id,
            name: emp.employeeName,
            position: emp.position || 'Staff',
            department: emp.department || 'General',
            type: LEAVE_TYPES[i % LEAVE_TYPES.length].key,
            status: statuses[i % statuses.length],
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            days,
            reason: ['Family event', 'Medical appointment', 'Personal', 'Vacation', 'Home care'][i % 5],
            submittedOn: new Date(now.getTime() - (i + 1) * 86400000).toISOString().split('T')[0],
        };
    });
};

const DEMO_REQUESTS = [
    { id: 'r1', name: 'Alice Johnson',  position: 'Developer',   department: 'Engineering', type: 'annual',   status: 'approved', startDate: '2026-04-10', endDate: '2026-04-14', days: 5,  reason: 'Family vacation',    submittedOn: '2026-03-25' },
    { id: 'r2', name: 'Bob Martinez',   position: 'Designer',    department: 'Design',      type: 'sick',     status: 'pending',  startDate: '2026-04-03', endDate: '2026-04-04', days: 2,  reason: 'Medical appointment', submittedOn: '2026-04-01' },
    { id: 'r3', name: 'Carol Singh',    position: 'HR Manager',  department: 'HR',          type: 'remote',   status: 'approved', startDate: '2026-04-07', endDate: '2026-04-11', days: 5,  reason: 'Remote work week',    submittedOn: '2026-03-28' },
    { id: 'r4', name: 'David Wu',       position: 'Analyst',     department: 'Analytics',   type: 'parental', status: 'approved', startDate: '2026-05-01', endDate: '2026-07-31', days: 92, reason: 'Paternity leave',     submittedOn: '2026-03-20' },
    { id: 'r5', name: 'Emma Patel',     position: 'Sales Exec',  department: 'Sales',       type: 'annual',   status: 'rejected', startDate: '2026-04-05', endDate: '2026-04-06', days: 2,  reason: 'Personal errands',    submittedOn: '2026-03-30' },
    { id: 'r6', name: 'James Lee',      position: 'Engineer',    department: 'Engineering', type: 'sick',     status: 'pending',  startDate: '2026-04-02', endDate: '2026-04-02', days: 1,  reason: 'Flu',                 submittedOn: '2026-04-02' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 36 }) => {
    const parts = (name || '?').split(' ');
    const initials = (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
    const hue = name.charCodeAt(0) * 11 % 360;
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, color: '#fff', background: `hsl(${hue},60%,48%)` }}>
            {initials}
        </div>
    );
};

const Badge = ({ status }) => {
    const m = STATUS_META[status] || STATUS_META.pending;
    return (
        <span style={{ fontSize: 11, fontWeight: 700, color: m.color, background: m.bg, border: `1px solid ${m.border}`, padding: '2px 9px', borderRadius: 20 }}>{m.label}</span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
const TimeOff = ({ employees = [] }) => {
    const [requests, setRequests] = useState(() =>
        employees.length > 0 ? seedRequests(employees) : DEMO_REQUESTS
    );
    const [filter, setFilter] = useState('all');      // all | pending | approved | rejected
    const [typeFilter, setTypeFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);

    const [formData, setFormData] = useState({ name: '', type: 'annual', startDate: '', endDate: '', reason: '' });

    const filtered = useMemo(() => requests.filter(r =>
        (filter === 'all' || r.status === filter) &&
        (typeFilter === 'all' || r.type === typeFilter) &&
        (!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.department?.toLowerCase().includes(search.toLowerCase()))
    ), [requests, filter, typeFilter, search]);

    const updateStatus = (id, newStatus) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        setSelectedReq(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
    };

    const submitRequest = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.startDate || !formData.endDate) return;
        const start = new Date(formData.startDate), end = new Date(formData.endDate);
        const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
        const newReq = { id: `req-${Date.now()}`, name: formData.name, type: formData.type, status: 'pending', startDate: formData.startDate, endDate: formData.endDate, days, reason: formData.reason, submittedOn: new Date().toISOString().split('T')[0], position: 'Staff', department: '' };
        setRequests(prev => [newReq, ...prev]);
        setFormData({ name: '', type: 'annual', startDate: '', endDate: '', reason: '' });
        setShowForm(false);
    };

    // Summary stats
    const pending  = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const totalDays = requests.filter(r => r.status === 'approved').reduce((s, r) => s + r.days, 0);

    // Leave type balances (mock)
    const balances = [
        { ...LEAVE_TYPES[0], used: 8,  total: 25 },
        { ...LEAVE_TYPES[1], used: 3,  total: 10 },
        { ...LEAVE_TYPES[2], used: 12, total: 52 },
    ];

    return (
        <div style={{ fontFamily: 'inherit' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0 }}>Time Off</h1>
                    <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>{pending} request{pending !== 1 ? 's' : ''} pending approval</p>
                </div>
                <button onClick={() => setShowForm(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.30)', fontFamily: 'inherit' }}>
                    <Ic d={ICONS.add} size={17} color="#fff" /> New Request
                </button>
            </div>

            {/* New Request Form */}
            {showForm && (
                <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: '24px', marginBottom: 20, boxShadow: '0 4px 16px rgba(37,99,235,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: 0 }}>Submit Leave Request</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><Ic d={ICONS.close} size={18} /></button>
                    </div>
                    <form onSubmit={submitRequest}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>
                            {[
                                { label: 'Employee Name', field: 'name', type: 'text', placeholder: 'Full name' },
                                { label: 'Leave Type', field: 'type', type: 'select' },
                                { label: 'Start Date', field: 'startDate', type: 'date' },
                                { label: 'End Date',   field: 'endDate',   type: 'date' },
                            ].map(f => (
                                <div key={f.field}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>{f.label}</label>
                                    {f.type === 'select' ? (
                                        <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                                            style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 13.5, background: '#F8FAFF', outline: 'none', fontFamily: 'inherit', color: '#1E293B' }}>
                                            {LEAVE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                                        </select>
                                    ) : (
                                        <input type={f.type} value={formData[f.field]} onChange={e => setFormData(p => ({ ...p, [f.field]: e.target.value }))} placeholder={f.placeholder}
                                            style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 13.5, background: '#F8FAFF', outline: 'none', fontFamily: 'inherit', color: '#1E293B', boxSizing: 'border-box' }}
                                            onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Reason</label>
                            <textarea value={formData.reason} onChange={e => setFormData(p => ({ ...p, reason: e.target.value }))} placeholder="Brief reason for leave…" rows={2}
                                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 13.5, background: '#F8FAFF', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', color: '#1E293B' }}
                                onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 18px', background: '#F1F5F9', color: '#374151', border: 'none', borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                            <button type="submit" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Submit Request</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14, marginBottom: 24 }}>
                {[
                    { label: 'Pending',       value: pending,   color: '#D97706', bg: '#FFFBEB', icon: ICONS.clock },
                    { label: 'Approved',      value: approved,  color: '#16A34A', bg: '#F0FDF4', icon: ICONS.check },
                    { label: 'Days Approved', value: totalDays, color: '#2563EB', bg: '#EEF2FF', icon: ICONS.chart },
                ].map(s => (
                    <div key={s.label} style={{ background: '#fff', border: `1.5px solid ${s.bg === '#fff' ? '#E8EDF5' : s.color}22`, borderRadius: 14, padding: '16px 18px', boxShadow: '0 2px 6px rgba(37,99,235,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Ic d={s.icon} size={18} color={s.color} />
                            </div>
                            <span style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</span>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginTop: 8 }}>{s.label}</p>
                    </div>
                ))}
                {/* Leave balances */}
                {balances.map(b => {
                    const pct = Math.round((b.used / b.total) * 100);
                    return (
                        <div key={b.key} style={{ background: '#fff', border: '1.5px solid #E8EDF5', borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 6px rgba(37,99,235,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{b.label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.total - b.used} left</span>
                            </div>
                            <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: b.color, borderRadius: 4 }} />
                            </div>
                            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{b.used}/{b.total} days used</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee…"
                    style={{ flex: 1, minWidth: 160, padding: '8px 12px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 13, background: '#F8FAFF', outline: 'none', fontFamily: 'inherit', color: '#1E293B' }} />
                {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${filter === s ? '#2563EB' : '#E2E8F0'}`, background: filter === s ? '#EEF2FF' : '#fff', color: filter === s ? '#2563EB' : '#64748B', fontWeight: filter === s ? 700 : 500, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textTransform: 'capitalize' }}>{s}</button>
                ))}
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    style={{ padding: '7px 12px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 12.5, background: '#fff', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                    <option value="all">All Types</option>
                    {LEAVE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
            </div>

            {/* ── Main: table + detail ── */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0, background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', overflow: 'hidden', boxShadow: '0 2px 6px rgba(37,99,235,0.04)' }}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>No requests match your filter.</div>
                    ) : filtered.map((req, i) => {
                        const leaveType = LEAVE_TYPES.find(t => t.key === req.type) || LEAVE_TYPES[0];
                        const isSelected = selectedReq?.id === req.id;
                        return (
                            <div key={req.id} onClick={() => setSelectedReq(isSelected ? null : req)}
                                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer', background: isSelected ? '#F8FAFF' : 'transparent', transition: 'background 0.15s' }}>
                                <Avatar name={req.name} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 700, fontSize: 13.5, color: '#0F172A' }}>{req.name}</span>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: leaveType.color, background: leaveType.bg, padding: '2px 9px', borderRadius: 20 }}>{leaveType.label}</span>
                                        <Badge status={req.status} />
                                    </div>
                                    <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>{req.startDate} → {req.endDate} · {req.days} day{req.days !== 1 ? 's' : ''}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Submitted</p>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: 0 }}>{req.submittedOn}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Detail panel */}
                {selectedReq && (() => {
                    const leaveType = LEAVE_TYPES.find(t => t.key === selectedReq.type) || LEAVE_TYPES[0];
                    return (
                        <div style={{ width: 300, flexShrink: 0, background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', overflow: 'hidden', boxShadow: '0 4px 20px rgba(37,99,235,0.08)' }}>
                            <div style={{ background: leaveType.color, padding: '18px 18px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: 15, color: '#fff', margin: '0 0 2px' }}>{selectedReq.name}</p>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{selectedReq.position} · {selectedReq.department}</p>
                                </div>
                                <button onClick={() => setSelectedReq(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#fff', padding: 4 }}>
                                    <Ic d={ICONS.close} size={16} color="#fff" />
                                </button>
                            </div>
                            <div style={{ padding: '16px 18px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                                    {[
                                        { label: 'Type',       value: leaveType.label },
                                        { label: 'Status',     value: <Badge status={selectedReq.status} /> },
                                        { label: 'Start',      value: selectedReq.startDate },
                                        { label: 'End',        value: selectedReq.endDate },
                                        { label: 'Duration',   value: `${selectedReq.days} day${selectedReq.days !== 1 ? 's' : ''}` },
                                        { label: 'Submitted',  value: selectedReq.submittedOn },
                                    ].map(r => (
                                        <div key={r.label}>
                                            <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', margin: '0 0 3px' }}>{r.label.toUpperCase()}</p>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{r.value}</div>
                                        </div>
                                    ))}
                                </div>
                                {selectedReq.reason && (
                                    <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 9, padding: '10px 12px', marginBottom: 14 }}>
                                        <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', margin: '0 0 4px' }}>REASON</p>
                                        <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{selectedReq.reason}</p>
                                    </div>
                                )}
                                {selectedReq.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => updateStatus(selectedReq.id, 'approved')} style={{ flex: 1, padding: '8px 0', background: 'linear-gradient(135deg,#16A34A,#15803D)', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                                            Approve
                                        </button>
                                        <button onClick={() => updateStatus(selectedReq.id, 'rejected')} style={{ flex: 1, padding: '8px 0', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                                            Reject
                                        </button>
                                    </div>
                                )}
                                {selectedReq.status !== 'pending' && (
                                    <button onClick={() => updateStatus(selectedReq.id, 'pending')} style={{ width: '100%', padding: '8px 0', background: '#F1F5F9', color: '#374151', border: '1px solid #E2E8F0', borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Revert to Pending
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default TimeOff;
