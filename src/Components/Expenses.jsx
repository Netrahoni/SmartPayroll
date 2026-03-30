import React, { useState, useMemo } from 'react';

const Ic = ({ d, size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true"><path d={d} /></svg>
);
const ICONS = {
    check:    'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    add:      'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    close:    'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    warn:     'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    doc:      'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    receipt:  'M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z',
    money:    'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
    chart:    'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
    travel:   'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    food:     'M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z',
    car:      'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
    filter:   'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
    download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
};

// ── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
    { key: 'travel',        label: 'Travel',         icon: ICONS.travel,  color: '#2563EB', bg: '#EEF2FF' },
    { key: 'meals',         label: 'Meals & Dining',  icon: ICONS.food,    color: '#F59E0B', bg: '#FFFBEB' },
    { key: 'transport',     label: 'Transport',       icon: ICONS.car,     color: '#8B5CF6', bg: '#F5F3FF' },
    { key: 'office',        label: 'Office Supplies', icon: ICONS.doc,     color: '#10B981', bg: '#ECFDF5' },
    { key: 'other',         label: 'Other',           icon: ICONS.receipt, color: '#6B7280', bg: '#F9FAFB' },
];

const STATUS_META = {
    approved: { label: 'Approved', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
    pending:  { label: 'Pending',  color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
};

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_EXPENSES = [
    { id: 'e1', name: 'Alice Johnson',  department: 'Engineering', category: 'travel',    amount: 420.00, date: '2026-03-28', description: 'Flight to London for client meeting',   receipt: true,  status: 'approved' },
    { id: 'e2', name: 'Bob Martinez',   department: 'Design',      category: 'meals',     amount: 68.50,  date: '2026-03-29', description: 'Team lunch — design review sprint',     receipt: true,  status: 'pending'  },
    { id: 'e3', name: 'Carol Singh',    department: 'HR',          category: 'transport', amount: 34.20,  date: '2026-03-27', description: 'Uber to training centre',              receipt: false, status: 'approved' },
    { id: 'e4', name: 'David Wu',       department: 'Analytics',   category: 'office',    amount: 189.99, date: '2026-03-25', description: 'External keyboard & mouse',            receipt: true,  status: 'pending'  },
    { id: 'e5', name: 'Emma Patel',     department: 'Sales',       category: 'travel',    amount: 1240.00,date: '2026-03-22', description: 'Hotel — 3-night client stay',          receipt: true,  status: 'approved' },
    { id: 'e6', name: 'James Lee',      department: 'Engineering', category: 'meals',     amount: 24.00,  date: '2026-04-01', description: 'Working lunch — deadline day',         receipt: false, status: 'rejected' },
    { id: 'e7', name: 'Sara Kim',       department: 'Marketing',   category: 'other',     amount: 55.00,  date: '2026-03-30', description: 'Conference registration fee',          receipt: true,  status: 'pending'  },
    { id: 'e8', name: 'Tom Nguyen',     department: 'Engineering', category: 'transport', amount: 12.40,  date: '2026-03-31', description: 'Bus pass — office visit',              receipt: false, status: 'approved' },
];

const seedExpenses = (employees) =>
    employees.slice(0, 5).map((emp, i) => ({
        id: `exp-${i}`,
        name: emp.employeeName,
        department: emp.department || 'General',
        category: CATEGORIES[i % CATEGORIES.length].key,
        amount: [120.5, 450.0, 86.2, 220.0, 32.0][i],
        date: new Date(Date.now() - i * 5 * 86400000).toISOString().split('T')[0],
        description: `Expense claim #${i + 1} - ${CATEGORIES[i % CATEGORIES.length].label}`,
        receipt: i % 2 === 0,
        status: ['approved', 'pending', 'pending', 'approved', 'rejected'][i],
    }));

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
    return <span style={{ fontSize: 11, fontWeight: 700, color: m.color, background: m.bg, border: `1px solid ${m.border}`, padding: '2px 9px', borderRadius: 20 }}>{m.label}</span>;
};

const fmt = (n) => `$${n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─────────────────────────────────────────────────────────────────────────────
const Expenses = ({ employees = [] }) => {
    const [expenses, setExpenses] = useState(() =>
        employees.length > 0 ? seedExpenses(employees) : DEMO_EXPENSES
    );
    const [filter, setFilter]     = useState('all');
    const [catFilter, setCatFilter] = useState('all');
    const [search, setSearch]     = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState(null);

    const [form, setForm] = useState({ name: '', department: '', category: 'travel', amount: '', date: '', description: '', receipt: false });

    const filtered = useMemo(() => expenses.filter(e =>
        (filter === 'all'    || e.status   === filter)   &&
        (catFilter === 'all' || e.category === catFilter) &&
        (!search || e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()))
    ), [expenses, filter, catFilter, search]);

    const updateStatus = (id, newStatus) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
        setSelected(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
    };

    const submitExpense = (ev) => {
        ev.preventDefault();
        if (!form.name || !form.amount || !form.date) return;
        const newExp = { id: `exp-${Date.now()}`, ...form, amount: parseFloat(form.amount) || 0, status: 'pending' };
        setExpenses(prev => [newExp, ...prev]);
        setForm({ name: '', department: '', category: 'travel', amount: '', date: '', description: '', receipt: false });
        setShowForm(false);
    };

    // Summary stats
    const totalPending  = expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
    const totalApproved = expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0);
    const pendingCount  = expenses.filter(e => e.status === 'pending').length;

    // Category breakdown
    const catBreakdown = CATEGORIES.map(c => ({
        ...c,
        total: expenses.filter(e => e.category === c.key && e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    })).filter(c => c.total > 0);
    const maxCat = Math.max(...catBreakdown.map(c => c.total), 1);

    // Export CSV
    const exportCSV = () => {
        const rows = [['Name', 'Department', 'Category', 'Amount', 'Date', 'Status', 'Description']];
        filtered.forEach(e => rows.push([e.name, e.department, e.category, e.amount, e.date, e.status, e.description]));
        const csv = rows.map(r => r.join(',')).join('\n');
        const link = document.createElement('a');
        link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
        link.download = 'expenses.csv';
        link.click();
    };

    const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 13.5, background: '#F8FAFF', outline: 'none', fontFamily: 'inherit', color: '#1E293B', boxSizing: 'border-box' };

    return (
        <div style={{ fontFamily: 'inherit' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0 }}>Expenses</h1>
                    <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>{pendingCount} expense{pendingCount !== 1 ? 's' : ''} awaiting approval · Track and reimburse employee spending</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#fff', color: '#374151', border: '1.5px solid #E2E8F0', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <Ic d={ICONS.download} size={16} color="#374151" /> Export
                    </button>
                    <button onClick={() => setShowForm(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.30)', fontFamily: 'inherit' }}>
                        <Ic d={ICONS.add} size={17} color="#fff" /> Add Expense
                    </button>
                </div>
            </div>

            {/* New Expense Form */}
            {showForm && (
                <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: '24px', marginBottom: 20, boxShadow: '0 4px 16px rgba(37,99,235,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: 0 }}>Submit Expense Claim</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><Ic d={ICONS.close} size={18} /></button>
                    </div>
                    <form onSubmit={submitExpense}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 18px' }}>
                            {[{ label: 'Employee Name', field: 'name', type: 'text', placeholder: 'Full name' }, { label: 'Department', field: 'department', type: 'text', placeholder: 'e.g. Engineering' }, { label: 'Amount ($)', field: 'amount', type: 'number', placeholder: '0.00' }, { label: 'Date', field: 'date', type: 'date' }].map(f => (
                                <div key={f.field}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>{f.label}</label>
                                    <input type={f.type} value={form[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))} placeholder={f.placeholder} style={inp} onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                </div>
                            ))}
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Category</label>
                                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Description</label>
                            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What was the expense for?" style={inp} onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                            <input type="checkbox" id="receipt-check" checked={form.receipt} onChange={e => setForm(p => ({ ...p, receipt: e.target.checked }))} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                            <label htmlFor="receipt-check" style={{ fontSize: 13, color: '#374151', cursor: 'pointer' }}>Receipt attached</label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 18px', background: '#F1F5F9', color: '#374151', border: 'none', borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                            <button type="submit" style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Submit Claim</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats + breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Pending Amount',   value: fmt(totalPending),  color: '#D97706', bg: '#FFFBEB', icon: ICONS.warn   },
                    { label: 'Approved Amount',  value: fmt(totalApproved), color: '#16A34A', bg: '#F0FDF4', icon: ICONS.check  },
                    { label: 'Total Claims',     value: expenses.length,    color: '#2563EB', bg: '#EEF2FF', icon: ICONS.receipt },
                ].map(s => (
                    <div key={s.label} style={{ background: '#fff', border: '1.5px solid #E8EDF5', borderRadius: 14, padding: '16px 18px', boxShadow: '0 2px 6px rgba(37,99,235,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Ic d={s.icon} size={18} color={s.color} />
                            </div>
                        </div>
                        <p style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: '0 0 4px' }}>{s.value}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: 0 }}>{s.label}</p>
                    </div>
                ))}

                {/* Category breakdown */}
                <div style={{ background: '#fff', border: '1.5px solid #E8EDF5', borderRadius: 14, padding: '16px 18px', boxShadow: '0 2px 6px rgba(37,99,235,0.04)' }}>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', margin: '0 0 12px' }}>APPROVED BY CATEGORY</p>
                    {catBreakdown.length === 0 ? (
                        <p style={{ color: '#94A3B8', fontSize: 12 }}>No approved expenses yet.</p>
                    ) : catBreakdown.map(c => (
                        <div key={c.key} style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{c.label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{fmt(c.total)}</span>
                            </div>
                            <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${(c.total / maxCat) * 100}%`, background: c.color, borderRadius: 4 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, dept, or description…"
                    style={{ flex: 1, minWidth: 180, padding: '8px 12px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 13, background: '#F8FAFF', outline: 'none', fontFamily: 'inherit', color: '#1E293B' }} />
                {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${filter === s ? '#2563EB' : '#E2E8F0'}`, background: filter === s ? '#EEF2FF' : '#fff', color: filter === s ? '#2563EB' : '#64748B', fontWeight: filter === s ? 700 : 500, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{s}</button>
                ))}
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: '7px 12px', border: '1.5px solid #E2E8F0', borderRadius: 9, fontSize: 12.5, background: '#fff', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
            </div>

            {/* ── Main: table + detail ── */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0, background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', overflow: 'hidden', boxShadow: '0 2px 6px rgba(37,99,235,0.04)' }}>
                    {/* Table Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr', padding: '10px 18px', background: '#F8FAFF', borderBottom: '1px solid #F1F5F9' }}>
                        {['Employee', 'Description', 'Amount', 'Date', 'Status'].map(h => (
                            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em' }}>{h.toUpperCase()}</span>
                        ))}
                    </div>
                    {filtered.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>No expenses match your filter.</div>
                    ) : (
                        filtered.map((exp, i) => {
                            const cat = CATEGORIES.find(c => c.key === exp.category) || CATEGORIES[4];
                            const isSel = selected?.id === exp.id;
                            return (
                                <div key={exp.id} onClick={() => setSelected(isSel ? null : exp)}
                                    style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr', alignItems: 'center', padding: '12px 18px', borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer', background: isSel ? '#F8FAFF' : 'transparent', transition: 'background 0.15s' }}
                                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#F8FAFF'; }}
                                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {/* Employee */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Avatar name={exp.name} size={32} />
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', margin: 0 }}>{exp.name}</p>
                                            <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{exp.department}</p>
                                        </div>
                                    </div>
                                    {/* Description */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                        <div style={{ width: 24, height: 24, borderRadius: 7, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Ic d={cat.icon} size={13} color={cat.color} />
                                        </div>
                                        <span style={{ fontSize: 12.5, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description}</span>
                                    </div>
                                    {/* Amount */}
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{fmt(exp.amount)}</span>
                                    {/* Date */}
                                    <span style={{ fontSize: 12.5, color: '#64748B' }}>{exp.date}</span>
                                    {/* Status */}
                                    <Badge status={exp.status} />
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Detail panel */}
                {selected && (() => {
                    const cat = CATEGORIES.find(c => c.key === selected.category) || CATEGORIES[4];
                    return (
                        <div style={{ width: 280, flexShrink: 0, background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', overflow: 'hidden', boxShadow: '0 4px 20px rgba(37,99,235,0.08)' }}>
                            <div style={{ background: cat.color, padding: '18px 18px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                        <Ic d={cat.icon} size={22} color="#fff" />
                                    </div>
                                    <p style={{ fontWeight: 800, fontSize: 22, color: '#fff', margin: '0 0 2px' }}>{fmt(selected.amount)}</p>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{cat.label}</p>
                                </div>
                                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, cursor: 'pointer', padding: 4 }}>
                                    <Ic d={ICONS.close} size={16} color="#fff" />
                                </button>
                            </div>
                            <div style={{ padding: '16px 18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                    <Avatar name={selected.name} size={36} />
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: 13.5, color: '#0F172A', margin: 0 }}>{selected.name}</p>
                                        <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>{selected.department}</p>
                                    </div>
                                </div>
                                {[
                                    { label: 'Date',        value: selected.date },
                                    { label: 'Status',      value: <Badge status={selected.status} /> },
                                    { label: 'Receipt',     value: selected.receipt ? '✅ Attached' : '⚠️ Missing' },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}>
                                        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{r.label}</span>
                                        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#374151' }}>{r.value}</span>
                                    </div>
                                ))}
                                {selected.description && (
                                    <div style={{ background: '#F8FAFF', borderRadius: 9, padding: '10px 12px', margin: '12px 0' }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', margin: '0 0 4px' }}>DESCRIPTION</p>
                                        <p style={{ fontSize: 12.5, color: '#374151', margin: 0 }}>{selected.description}</p>
                                    </div>
                                )}
                                {selected.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => updateStatus(selected.id, 'approved')} style={{ flex: 1, padding: '8px 0', background: 'linear-gradient(135deg,#16A34A,#15803D)', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Approve</button>
                                        <button onClick={() => updateStatus(selected.id, 'rejected')} style={{ flex: 1, padding: '8px 0', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Reject</button>
                                    </div>
                                )}
                                {selected.status !== 'pending' && (
                                    <button onClick={() => updateStatus(selected.id, 'pending')} style={{ width: '100%', padding: '8px 0', background: '#F1F5F9', color: '#374151', border: '1px solid #E2E8F0', borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Revert to Pending</button>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default Expenses;
