import React, { useState, useEffect } from 'react';

const Ic = ({ d, size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true"><path d={d} /></svg>
);
const ICONS = {
    user:    'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    check:   'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    clock:   'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    doc:     'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    gear:    'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.13-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z',
    star:    'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    add:     'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    email:   'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    flag:    'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z',
    chart:   'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
    close:   'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    laptop:  'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
    people:  'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
};

// ── Stages pipeline ──────────────────────────────────────────────────────────
const STAGES = [
    { key: 'offer',       label: 'Offer Sent',     color: '#8B5CF6', bg: '#F5F3FF', icon: ICONS.email   },
    { key: 'documents',   label: 'Documents',      color: '#F59E0B', bg: '#FFFBEB', icon: ICONS.doc     },
    { key: 'setup',       label: 'IT Setup',       color: '#3B82F6', bg: '#EFF6FF', icon: ICONS.laptop  },
    { key: 'orientation', label: 'Orientation',    color: '#10B981', bg: '#ECFDF5', icon: ICONS.people  },
    { key: 'active',      label: 'Active',         color: '#2563EB', bg: '#EEF2FF', icon: ICONS.star    },
];

// ── Checklist tasks per stage ────────────────────────────────────────────────
const STAGE_TASKS = {
    offer:       ['Send offer letter', 'Confirm start date', 'Share company handbook'],
    documents:   ['Collect signed contract', 'ID verification', 'Emergency contact form', 'Tax forms completed'],
    setup:       ['Create email account', 'Assign laptop / equipment', 'Set up system access', 'Add to Slack/Teams'],
    orientation: ['Welcome meeting', 'Office tour / intro', 'Meet the team', 'Complete HR induction'],
    active:      ['30-day check-in', 'Set performance goals', 'Probation review scheduled'],
};

const defaultChecklist = (stage) => STAGE_TASKS[stage].map(t => ({ task: t, done: false }));

// ── Seed some mock hires based on real employees ──────────────────────────────
const seedHires = (employees) => employees.slice(0, 5).map((emp, i) => ({
    id: emp._id,
    name: emp.employeeName,
    position: emp.position || 'New Hire',
    department: emp.department || 'General',
    stage: STAGES[Math.min(i, STAGES.length - 1)].key,
    startDate: new Date(Date.now() - i * 7 * 86400000).toISOString().split('T')[0],
    checklist: defaultChecklist(STAGES[Math.min(i, STAGES.length - 1)].key),
    notes: '',
}));

// ── Avatar initials ──────────────────────────────────────────────────────────
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

// ============================================================================
const Onboarding = ({ employees = [] }) => {
    const [hires, setHires] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [filterStage, setFilterStage] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (employees.length > 0) {
            setHires(seedHires(employees));
        } else {
            // Demo data when no employees loaded
            const demo = [
                { id: '1', name: 'Alice Johnson',  position: 'Frontend Developer', department: 'Engineering', stage: 'documents',   startDate: '2026-04-01', checklist: defaultChecklist('documents'),   notes: '' },
                { id: '2', name: 'Bob Martinez',   position: 'UX Designer',        department: 'Design',      stage: 'setup',        startDate: '2026-04-05', checklist: defaultChecklist('setup'),        notes: '' },
                { id: '3', name: 'Carol Singh',    position: 'HR Generalist',      department: 'HR',          stage: 'orientation',  startDate: '2026-03-20', checklist: defaultChecklist('orientation'),  notes: '' },
                { id: '4', name: 'David Wu',       position: 'Data Analyst',       department: 'Analytics',   stage: 'active',       startDate: '2026-03-10', checklist: defaultChecklist('active'),       notes: '' },
                { id: '5', name: 'Emma Patel',     position: 'Sales Executive',    department: 'Sales',       stage: 'offer',        startDate: '2026-04-15', checklist: defaultChecklist('offer'),        notes: '' },
            ];
            setHires(demo);
        }
    }, [employees]);

    const selected = hires.find(h => h.id === selectedId);
    const selectedStage = selected ? STAGES.find(s => s.key === selected.stage) : null;

    const filtered = hires.filter(h =>
        (filterStage === 'all' || h.stage === filterStage) &&
        (!search || h.name.toLowerCase().includes(search.toLowerCase()) || h.department.toLowerCase().includes(search.toLowerCase()))
    );

    const stageProgress = (hire) => {
        const idx = STAGES.findIndex(s => s.key === hire.stage);
        return Math.round(((idx + 1) / STAGES.length) * 100);
    };

    const toggleTask = (taskIdx) => {
        setHires(prev => prev.map(h => {
            if (h.id !== selectedId) return h;
            const cl = [...h.checklist];
            cl[taskIdx] = { ...cl[taskIdx], done: !cl[taskIdx].done };
            return { ...h, checklist: cl };
        }));
    };

    const advanceStage = () => {
        setHires(prev => prev.map(h => {
            if (h.id !== selectedId) return h;
            const idx = STAGES.findIndex(s => s.key === h.stage);
            if (idx >= STAGES.length - 1) return h;
            const nextStage = STAGES[idx + 1].key;
            return { ...h, stage: nextStage, checklist: defaultChecklist(nextStage) };
        }));
    };

    const completedTasks = selected ? selected.checklist.filter(t => t.done).length : 0;
    const totalTasks     = selected ? selected.checklist.length : 0;

    // Stats
    const stats = STAGES.map(s => ({ ...s, count: hires.filter(h => h.stage === s.key).length }));
    const totalActive = hires.filter(h => h.stage !== 'active').length;

    return (
        <div style={{ fontFamily: 'inherit' }}>
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0 }}>Onboarding</h1>
                    <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>{totalActive} new hire{totalActive !== 1 ? 's' : ''} in progress · Track every step from offer to active</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.30)', fontFamily: 'inherit' }}>
                    <Ic d={ICONS.add} size={17} color="#fff" /> Add New Hire
                </button>
            </div>

            {/* ── Pipeline Stats ── */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
                {stats.map((s, i) => (
                    <button key={s.key} onClick={() => setFilterStage(filterStage === s.key ? 'all' : s.key)}
                        style={{ flex: '1 1 120px', minWidth: 110, background: filterStage === s.key ? s.bg : '#fff', border: `1.5px solid ${filterStage === s.key ? s.color : '#E8EDF5'}`, borderRadius: 14, padding: '14px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.18s', boxShadow: '0 2px 6px rgba(37,99,235,0.04)', fontFamily: 'inherit' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Ic d={s.icon} size={16} color={s.color} />
                            </div>
                            <span style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</span>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: 0 }}>{s.label}</p>
                    </button>
                ))}
            </div>

            {/* ── Main area: list + detail ── */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

                {/* List */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Search */}
                    <div style={{ marginBottom: 14 }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or department…"
                            style={{ width: '100%', padding: '9px 14px', background: '#F8FAFF', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13.5, color: '#1E293B', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                            onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.10)'; }}
                            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {filtered.length === 0 ? (
                            <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E8EDF5', padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                                No hires match your filter.
                            </div>
                        ) : filtered.map(hire => {
                            const stage = STAGES.find(s => s.key === hire.stage);
                            const progress = stageProgress(hire);
                            const isActive = hire.id === selectedId;
                            const doneCount = hire.checklist.filter(t => t.done).length;
                            return (
                                <div key={hire.id} onClick={() => setSelectedId(isActive ? null : hire.id)}
                                    style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${isActive ? '#2563EB' : '#E8EDF5'}`, padding: '16px 18px', cursor: 'pointer', boxShadow: isActive ? '0 4px 16px rgba(37,99,235,0.12)' : '0 2px 6px rgba(37,99,235,0.04)', transition: 'all 0.18s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Avatar name={hire.name} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                                                <p style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', margin: 0, whiteSpace: 'nowrap' }}>{hire.name}</p>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: stage.color, background: stage.bg, padding: '2px 9px', borderRadius: 20 }}>{stage.label}</span>
                                            </div>
                                            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 6px' }}>{hire.position} · {hire.department}</p>
                                            {/* Progress bar */}
                                            <div style={{ height: 4, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${stage.color},${stage.color}cc)`, borderRadius: 4, transition: 'width 0.4s' }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                                <span style={{ fontSize: 11, color: '#94A3B8' }}>Start: {hire.startDate}</span>
                                                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{doneCount}/{hire.checklist.length} tasks · {progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detail Panel */}
                {selected && selectedStage && (
                    <div style={{ width: 320, flexShrink: 0, background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', boxShadow: '0 4px 20px rgba(37,99,235,0.08)', overflow: 'hidden' }}>
                        {/* Top */}
                        <div style={{ background: `linear-gradient(135deg,${selectedStage.color},${selectedStage.color}bb)`, padding: '20px 20px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Avatar name={selected.name} size={48} />
                                <button onClick={() => setSelectedId(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#fff', padding: 4 }}>
                                    <Ic d={ICONS.close} size={16} color="#fff" />
                                </button>
                            </div>
                            <p style={{ fontWeight: 800, fontSize: 15, color: '#fff', margin: '10px 0 2px' }}>{selected.name}</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{selected.position} · {selected.department}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.22)', borderRadius: 20, padding: '2px 10px' }}>{selectedStage.label}</span>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Start: {selected.startDate}</span>
                            </div>
                        </div>

                        {/* Pipeline progress */}
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9' }}>
                            <p style={{ fontSize: 11.5, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', marginBottom: 10 }}>PIPELINE PROGRESS</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {STAGES.map((s, i) => {
                                    const curIdx = STAGES.findIndex(x => x.key === selected.stage);
                                    const done = i < curIdx;
                                    const cur  = i === curIdx;
                                    return (
                                        <React.Fragment key={s.key}>
                                            <div title={s.label} style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: done ? '#22C55E' : cur ? selectedStage.color : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: cur ? `2px solid ${selectedStage.color}` : 'none' }}>
                                                {done ? <Ic d={ICONS.check} size={13} color="#fff" /> : <span style={{ width: 7, height: 7, borderRadius: '50%', background: cur ? '#fff' : 'transparent' }} />}
                                            </div>
                                            {i < STAGES.length - 1 && <div style={{ flex: 1, height: 2, background: done ? '#22C55E' : '#E2E8F0', borderRadius: 2 }} />}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Checklist */}
                        <div style={{ padding: '14px 18px', maxHeight: 300, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <p style={{ fontSize: 11.5, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', margin: 0 }}>CHECKLIST ({completedTasks}/{totalTasks})</p>
                                <div style={{ height: 4, width: 80, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%`, background: selectedStage.color, borderRadius: 4 }} />
                                </div>
                            </div>
                            {selected.checklist.map((t, i) => (
                                <div key={i} onClick={() => toggleTask(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F8FAFF', cursor: 'pointer' }}>
                                    <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${t.done ? selectedStage.color : '#CBD5E1'}`, background: t.done ? selectedStage.color : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                                        {t.done && <Ic d={ICONS.check} size={11} color="#fff" />}
                                    </div>
                                    <span style={{ fontSize: 13, color: t.done ? '#94A3B8' : '#374151', textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</span>
                                </div>
                            ))}
                        </div>

                        {/* Advance button */}
                        {STAGES.findIndex(s => s.key === selected.stage) < STAGES.length - 1 && (
                            <div style={{ padding: '12px 18px', borderTop: '1px solid #F1F5F9' }}>
                                <button onClick={advanceStage} style={{ width: '100%', padding: '9px 0', background: `linear-gradient(135deg,${selectedStage.color},${selectedStage.color}bb)`, color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Advance to {STAGES[STAGES.findIndex(s => s.key === selected.stage) + 1]?.label} →
                                </button>
                            </div>
                        )}
                        {selected.stage === 'active' && (
                            <div style={{ padding: '12px 18px', borderTop: '1px solid #F1F5F9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 9, padding: '10px 14px' }}>
                                    <Ic d={ICONS.star} size={16} color="#16A34A" />
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#15803D' }}>Onboarding Complete!</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
