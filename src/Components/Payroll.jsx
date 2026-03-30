import React, { useState, useCallback, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { useNotifications } from '../context/NotificationContext.jsx';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={d} /></svg>
);
const ICONS = {
  add:     'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  refresh: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
  play:    'M8 5v14l11-7z',
  pdf:     'M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z',
  calendar:'M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z',
  clock:   'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  people:  'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  stub:    'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  edit:    'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  trash:   'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  check:   'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  filter:  'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
  money:   'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  warn:    'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
};

const fmt = (n) => `$${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Avatar initials ──────────────────────────────────────────────────────────
const Av = ({ name, size = 34 }) => {
  const p = (name || '?').split(' ');
  const init = (p[0][0] + (p[1]?.[0] || '')).toUpperCase();
  const hue = (name || '').charCodeAt(0) * 11 % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, color: '#fff', background: `hsl(${hue},60%,48%)` }}>
      {init}
    </div>
  );
};

// ── Summary stat tile ─────────────────────────────────────────────────────────
const StatTile = ({ label, value, icon, color, bg }) => (
  <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E8EDF5', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 6px rgba(37,99,235,0.04)', flex: 1, minWidth: 140 }}>
    <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Ic d={icon} size={20} color={color} />
    </div>
    <div>
      <p style={{ fontSize: 20, fontWeight: 800, color, margin: 0 }}>{value}</p>
      <p style={{ fontSize: 12, color: '#64748B', margin: 0, fontWeight: 600 }}>{label}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const Payroll = ({ onNavigate, employees = [], fetchEmployees, globalSearchQuery }) => {
  const { addNotification } = useNotifications();
  const [payPeriodFilter, setPayPeriodFilter] = useState('All Periods');
  const [nextPayDate, setNextPayDate]         = useState(new Date());
  const [runLoading, setRunLoading]           = useState(false);
  const [selectedIds, setSelectedIds]         = useState(new Set());
  const [showRunConfirm, setShowRunConfirm]   = useState(false);

  const filteredEmployees = useMemo(() =>
    employees.filter(emp => {
      const matchesPeriod = payPeriodFilter === 'All Periods' || emp.payPeriod === payPeriodFilter;
      const matchesSearch = !globalSearchQuery ||
        emp.employeeName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        (emp.position || '').toLowerCase().includes(globalSearchQuery.toLowerCase());
      return matchesPeriod && matchesSearch;
    }),
    [employees, payPeriodFilter, globalSearchQuery]
  );

  // ── Aggregates ──
  const totals = useMemo(() => {
    let gross = 0, tax = 0, net = 0;
    filteredEmployees.forEach(e => { gross += e.basicSalary || 0; tax += e.taxPayment || 0; net += e.netPay || 0; });
    return { gross, tax, net };
  }, [filteredEmployees]);

  // ── Department breakdown chart data ──
  const deptChart = useMemo(() => {
    const m = {};
    filteredEmployees.forEach(e => { const d = e.department || 'General'; m[d] = (m[d] || 0) + (e.netPay || 0); });
    return { labels: Object.keys(m), data: Object.values(m) };
  }, [filteredEmployees]);

  const chartData = {
    labels: deptChart.labels,
    datasets: [{ data: deptChart.data, backgroundColor: ['#2563EB','#8B5CF6','#10B981','#F59E0B','#EF4444','#06B6D4'].slice(0, deptChart.data.length), borderRadius: 6 }],
  };
  const chartOpts = {
    responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
    scales: { y: { ticks: { color: '#94A3B8', callback: v => `$${(v/1000).toFixed(0)}k` }, grid: { color: '#F1F5F9' } }, x: { ticks: { color: '#374151', font: { weight: '600' } }, grid: { display: false } } },
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleRunPayroll = async () => {
    setRunLoading(true);
    setShowRunConfirm(false);
    await new Promise(r => setTimeout(r, 1200));
    setRunLoading(false);
    addNotification(`✅ Payroll run complete — ${filteredEmployees.length} employees processed for ${format(nextPayDate, 'MMM dd, yyyy')}.`);
  };

  const handleDownloadFullReport = () => {
    if (filteredEmployees.length === 0) { addNotification('No employees to include in report.', 'warning'); return; }
    addNotification('Generating PDF payroll report…');
    const doc = new jsPDF();
    const cols = ['ID', 'Employee', 'Position', 'Department', 'Gross Pay', 'Taxes', 'Net Pay'];
    const rows = filteredEmployees.map(e => [
      e._id.slice(-6).toUpperCase(), e.employeeName, e.position || '—', e.department || '—',
      fmt(e.basicSalary), fmt(e.taxPayment), fmt(e.netPay),
    ]);
    doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('SmartPayroll — Payroll Report', 14, 22);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${payPeriodFilter}   |   Pay date: ${format(nextPayDate, 'MMM dd, yyyy')}`, 14, 30);
    doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 36);
    autoTable(doc, { startY: 46, head: [cols], body: rows, headStyles: { fillColor: [37,99,235] }, alternateRowStyles: { fillColor: [248,250,255] } });
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text('Summary', 14, finalY);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(`Total Gross: ${fmt(totals.gross)}`, 14, finalY + 7);
    doc.text(`Total Tax: ${fmt(totals.tax)}`, 14, finalY + 13);
    doc.text(`Total Net Pay: ${fmt(totals.net)}`, 14, finalY + 19);
    doc.save(`Payroll-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const handleGeneratePayStub = (emp) => {
    if (!emp) return;
    addNotification(`Generating pay stub for ${emp.employeeName}…`);
    try {
      const doc = new jsPDF();
      const gross = emp.basicSalary || 0, tax = emp.taxPayment || 0, cpp = emp.pensionPay || 0, ei = emp.niPayment || 0, net = emp.netPay || 0;
      doc.setFontSize(20); doc.setFont('helvetica', 'bold');
      doc.text('SmartPayroll Inc.', 14, 20);
      doc.setFontSize(9); doc.setFont('helvetica', 'normal');
      doc.text('Confidential Pay Stub', 14, 27);
      doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text('Pay Stub', 150, 20); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      doc.text(`Date: ${format(new Date(emp.nextPayDate || Date.now()), 'MM/dd/yyyy')}`, 150, 27);
      doc.text(`Net Pay: ${fmt(net)}`, 150, 33);
      doc.line(14, 40, 200, 40);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text('EMPLOYEE', 14, 48); doc.setFont('helvetica', 'normal');
      doc.text(emp.employeeName, 14, 55);
      doc.text(emp.position || '—', 14, 61);
      doc.text(emp.department || '—', 14, 67);
      doc.setFont('helvetica', 'bold'); doc.text('PAY PERIOD', 120, 48); doc.setFont('helvetica', 'normal');
      doc.text(`Period: ${emp.payPeriod || 'Monthly'}`, 120, 55);
      doc.line(14, 74, 200, 74);
      autoTable(doc, { startY: 79, head: [['Earnings', 'Amount']], body: [['Basic Salary', fmt(emp.basicSalary)], ['Other Payments', fmt(emp.otherPayment)], ['Overtime', fmt((emp.overtimeHours||0)*(emp.hourlyRate||0))]], headStyles: { fillColor: [37,99,235] } });
      autoTable(doc, { startY: doc.lastAutoTable.finalY + 4, head: [['Deductions', 'Amount']], body: [['Income Tax', fmt(tax)], ['Pension / CPP', fmt(cpp)], ['NI / EI', fmt(ei)], ['Student Loan', fmt(emp.studentLoan)]], headStyles: { fillColor: [220,38,38] } });
      const fY = doc.lastAutoTable.finalY + 8;
      doc.setFont('helvetica', 'bold'); doc.text('NET PAY', 140, fY); doc.setFontSize(14);
      doc.setTextColor(37, 99, 235); doc.text(fmt(net), 140, fY + 8); doc.setTextColor(0); doc.setFontSize(10);
      doc.setFont('helvetica', 'normal'); doc.text('This is an auto-generated document from SmartPayroll.', 14, fY + 20);
      doc.save(`PayStub-${emp.employeeName.replace(/ /g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (err) { addNotification('Error generating pay stub.', 'error'); }
  };

  const handleDelete = async (empId) => {
    if (!window.confirm('Permanently remove this employee from payroll?')) return;
    const name = employees.find(e => e._id === empId)?.employeeName;
    try {
      await fetch(`/api/employees/${empId}`, { method: 'DELETE' });
      addNotification(`${name} removed from payroll.`);
      fetchEmployees?.();
    } catch { addNotification('Failed to delete employee.', 'error'); }
  };

  const selectAll = (e) => {
    if (e.target.checked) setSelectedIds(new Set(filteredEmployees.map(e => e._id)));
    else setSelectedIds(new Set());
  };
  const toggleSelect = (id) =>
    setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const bulkExport = () => {
    const rows = [['ID','Employee','Position','Dept','Net Pay']];
    filteredEmployees.filter(e => selectedIds.has(e._id)).forEach(e =>
      rows.push([e._id.slice(-6), e.employeeName, e.position, e.department, e.netPay])
    );
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`; a.download = 'payroll-export.csv'; a.click();
  };

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0 }}>Payroll</h1>
          <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>Process and manage employee pay for {format(nextPayDate, 'MMMM yyyy')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => onNavigate?.('AddOrEditEmployee')} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', background:'#fff', color:'#374151', border:'1.5px solid #E2E8F0', borderRadius:10, fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            <Ic d={ICONS.add} size={16} color="#374151" /> Add Employee
          </button>
          <button onClick={() => setShowRunConfirm(true)} disabled={runLoading}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 20px', background:'linear-gradient(135deg,#2563EB,#06B6D4)', color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:13.5, cursor:runLoading?'wait':'pointer', boxShadow:'0 4px 14px rgba(37,99,235,0.30)', fontFamily:'inherit', opacity: runLoading ? 0.7 : 1 }}>
            {runLoading ? '⏳ Running…' : <><Ic d={ICONS.play} size={17} color="#fff" /> Run Payroll</>}
          </button>
        </div>
      </div>

      {/* ── Run Payroll Confirm ── */}
      {showRunConfirm && (
        <div style={{ background:'#FFFBEB', border:'1.5px solid #FDE68A', borderRadius:14, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <Ic d={ICONS.warn} size={22} color="#D97706" />
          <p style={{ flex:1, fontSize:13.5, color:'#92400E', margin:0, fontWeight:600 }}>
            Ready to process payroll for <strong>{filteredEmployees.length}</strong> employee{filteredEmployees.length !== 1 ? 's' : ''} — pay date <strong>{format(nextPayDate, 'MMM dd, yyyy')}</strong>?
          </p>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => setShowRunConfirm(false)} style={{ padding:'7px 16px', background:'#fff', border:'1px solid #E2E8F0', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
            <button onClick={handleRunPayroll} style={{ padding:'7px 16px', background:'linear-gradient(135deg,#2563EB,#06B6D4)', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>Confirm & Run</button>
          </div>
        </div>
      )}

      {/* ── Stats row ── */}
      <div style={{ display:'flex', gap:14, marginBottom:24, flexWrap:'wrap' }}>
        <StatTile label="Employees in Run"  value={filteredEmployees.length} icon={ICONS.people} color="#2563EB" bg="#EEF2FF" />
        <StatTile label="Total Gross Pay"   value={fmt(totals.gross)}  icon={ICONS.money}  color="#8B5CF6" bg="#F5F3FF" />
        <StatTile label="Total Taxes"       value={fmt(totals.tax)}    icon={ICONS.warn}   color="#EF4444" bg="#FEF2F2" />
        <StatTile label="Total Net Pay"     value={fmt(totals.net)}    icon={ICONS.check}  color="#16A34A" bg="#F0FDF4" />
      </div>

      {/* ── Controls row ── */}
      <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', padding:'16px 20px', marginBottom:20, display:'flex', flexWrap:'wrap', gap:14, alignItems:'center', boxShadow:'0 2px 6px rgba(37,99,235,0.04)' }}>
        {/* Period filter */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Ic d={ICONS.filter} size={16} color="#64748B" />
          <select value={payPeriodFilter} onChange={e => setPayPeriodFilter(e.target.value)}
            style={{ padding:'7px 12px', border:'1.5px solid #E2E8F0', borderRadius:9, fontSize:13, background:'#F8FAFF', outline:'none', cursor:'pointer', fontFamily:'inherit', color:'#374151' }}>
            {['All Periods','Per Day','Weekly','Monthly','Annually'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        {/* Date picker */}
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#F8FAFF', border:'1.5px solid #E2E8F0', borderRadius:9, padding:'7px 12px' }}>
          <Ic d={ICONS.calendar} size={16} color="#2563EB" />
          <DatePicker selected={nextPayDate} onChange={d => setNextPayDate(d)} dateFormat="MMM dd, yyyy"
            customInput={<span style={{ fontSize:13, fontWeight:700, color:'#374151', cursor:'pointer' }}>{format(nextPayDate,'MMM dd, yyyy')}</span>} />
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
          <button onClick={handleDownloadFullReport} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA', borderRadius:9, fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            <Ic d={ICONS.pdf} size={16} color="#DC2626" /> Full PDF Report
          </button>
          {selectedIds.size > 0 && (
            <button onClick={bulkExport} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'#F0FDF4', color:'#16A34A', border:'1px solid #BBF7D0', borderRadius:9, fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              Export {selectedIds.size} selected
            </button>
          )}
        </div>
      </div>

      {/* ── Table + Dept Chart ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'flex-start' }}>
        {/* Table */}
        <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', overflow:'hidden', boxShadow:'0 2px 6px rgba(37,99,235,0.04)' }}>
          {/* Table header */}
          <div style={{ display:'grid', gridTemplateColumns:'36px 2fr 1.2fr 1fr 1fr 1fr 1fr auto', alignItems:'center', padding:'11px 18px', background:'#F8FAFF', borderBottom:'1px solid #F1F5F9', gap:8 }}>
            <input type="checkbox" onChange={selectAll} checked={selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0} style={{ width:16, height:16, cursor:'pointer' }} />
            {['Employee','Position','Department','Gross Pay','Tax','Net Pay','Actions'].map(h => (
              <span key={h} style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:'0.06em' }}>{h.toUpperCase()}</span>
            ))}
          </div>

          {filteredEmployees.length === 0 ? (
            <div style={{ padding:'48px', textAlign:'center', color:'#94A3B8' }}>No employees match the current filter.</div>
          ) : filteredEmployees.map((emp, i) => {
            const isSel = selectedIds.has(emp._id);
            return (
              <div key={emp._id} style={{ display:'grid', gridTemplateColumns:'36px 2fr 1.2fr 1fr 1fr 1fr 1fr auto', alignItems:'center', padding:'12px 18px', borderBottom: i < filteredEmployees.length-1 ? '1px solid #F1F5F9' : 'none', background: isSel ? '#EEF2FF' : 'transparent', transition:'background 0.15s', gap:8 }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.background='#F8FAFF'; }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.background='transparent'; }}>
                <input type="checkbox" checked={isSel} onChange={() => toggleSelect(emp._id)} style={{ width:16, height:16, cursor:'pointer' }} />
                {/* Employee */}
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Av name={emp.employeeName} />
                  <div>
                    <p style={{ fontWeight:700, fontSize:13, color:'#0F172A', margin:0 }}>{emp.employeeName}</p>
                    <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>#{emp._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <span style={{ fontSize:13, color:'#374151' }}>{emp.position || '—'}</span>
                <span style={{ fontSize:13, color:'#374151' }}>{emp.department || '—'}</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{fmt(emp.basicSalary)}</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#DC2626' }}>{fmt(emp.taxPayment)}</span>
                <span style={{ fontSize:13, fontWeight:700, color:'#16A34A' }}>{fmt(emp.netPay)}</span>
                <div style={{ display:'flex', gap:8 }}>
                  <button title="Pay Stub PDF" onClick={() => handleGeneratePayStub(emp)} style={{ width:30, height:30, borderRadius:8, border:'1px solid #E2E8F0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Ic d={ICONS.stub} size={15} color="#F59E0B" />
                  </button>
                  <button title="Edit" onClick={() => onNavigate?.('AddOrEditEmployee', emp._id)} style={{ width:30, height:30, borderRadius:8, border:'1px solid #E2E8F0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Ic d={ICONS.edit} size={15} color="#2563EB" />
                  </button>
                  <button title="Remove" onClick={() => handleDelete(emp._id)} style={{ width:30, height:30, borderRadius:8, border:'1px solid #FECACA', background:'#FEF2F2', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Ic d={ICONS.trash} size={15} color="#DC2626" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Department net pay chart */}
        {deptChart.labels.length > 0 && (
          <div style={{ width:260, background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', padding:'18px 18px', boxShadow:'0 2px 6px rgba(37,99,235,0.04)' }}>
            <h3 style={{ fontWeight:700, fontSize:14, color:'#0F172A', margin:'0 0 14px' }}>Net Pay by Dept.</h3>
            <div style={{ height: Math.max(140, deptChart.labels.length * 32) }}>
              <Bar data={chartData} options={chartOpts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;