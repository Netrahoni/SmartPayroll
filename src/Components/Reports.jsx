import React, { useState, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Ic = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={d} /></svg>
);
const ICONS = {
  download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
  chart:    'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
  money:    'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  people:   'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  tax:      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  up:       'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z',
  dept:     'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
  filter:   'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
  pdf:      'M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z',
};

const fmt = (n) => `$${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtK = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : fmt(n);

// ── Reusable KPI tile ────────────────────────────────────────────────────────
const KPI = ({ label, value, sub, accent, icon }) => (
  <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E8EDF5', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 6px rgba(37,99,235,0.04)', flex: 1, minWidth: 140 }}>
    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Ic d={icon} size={22} color={accent} />
    </div>
    <div>
      <p style={{ fontSize: 21, fontWeight: 800, color: '#0F172A', margin: 0 }}>{value}</p>
      <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0', fontWeight: 600 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{sub}</p>}
    </div>
  </div>
);

// ── Month labels ─────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─────────────────────────────────────────────────────────────────────────────
const Reports = ({ employees = [] }) => {
  const [view, setView] = useState('overview'); // overview | department | headcount

  // ── Compute real metrics from employees ──────────────────────────────────
  const metrics = useMemo(() => {
    let gross = 0, tax = 0, net = 0, pension = 0;
    const deptMap = {}, deptPayMap = {};
    employees.forEach(e => {
      gross   += e.basicSalary  || 0;
      tax     += e.taxPayment   || 0;
      net     += e.netPay       || 0;
      pension += e.pensionPay   || 0;
      const d = e.department || 'General';
      deptMap[d]    = (deptMap[d]    || 0) + 1;
      deptPayMap[d] = (deptPayMap[d] || 0) + (e.netPay || 0);
    });

    // Simulate 12-month trend (scale from base)
    const base = net || 45000;
    const trend = [0.88, 0.90, 0.93, 0.95, 0.97, 1.0, 1.02, 1.04, 1.07, 1.09, 1.11, 1.14].map(m => Math.round(base * m));
    const grossTrend = trend.map(v => Math.round(v * 1.22));
    const taxTrend   = trend.map(v => Math.round(v * 0.18));

    return { gross, tax, net, pension, deptMap, deptPayMap, trend, grossTrend, taxTrend, totalEmp: employees.length };
  }, [employees]);

  // Demo fills when no real data
  const { gross, tax, net, pension, deptMap, deptPayMap, trend, grossTrend, taxTrend, totalEmp } = metrics;
  const demoTrend = [42000,44500,46200,47800,49100,51000,50200,53100,54500,56000,58200,60000];
  const netTrend  = net > 0 ? trend : demoTrend;
  const gTrend    = net > 0 ? grossTrend : demoTrend.map(v => Math.round(v * 1.22));
  const tTrend    = net > 0 ? taxTrend   : demoTrend.map(v => Math.round(v * 0.18));

  const deptLabels = Object.keys(deptMap).length ? Object.keys(deptMap)    : ['Engineering','Design','HR','Sales','Analytics'];
  const deptCounts = Object.keys(deptMap).length ? Object.values(deptMap)  : [4, 2, 2, 3, 1];
  const deptPays   = Object.keys(deptMap).length ? Object.values(deptPayMap): [52000,28000,22000,35000,15000];

  // ── Charts ──────────────────────────────────────────────────────────────
  const lineData = {
    labels: MONTHS,
    datasets: [
      { label: 'Gross Pay', data: gTrend, borderColor: '#8B5CF6', borderWidth: 2, tension: 0.4, fill: false, pointRadius: 3, pointBackgroundColor: '#8B5CF6' },
      { label: 'Net Pay',   data: netTrend, borderColor: '#2563EB', borderWidth: 2.5, tension: 0.4, fill: true, pointRadius: 3, pointBackgroundColor: '#2563EB',
        backgroundColor: ctx => {
          const g = ctx.chart.ctx.createLinearGradient(0,0,0,220);
          g.addColorStop(0,'rgba(37,99,235,0.14)'); g.addColorStop(1,'rgba(37,99,235,0)'); return g;
        }
      },
      { label: 'Tax',       data: tTrend,  borderColor: '#EF4444', borderWidth: 1.5, tension: 0.4, fill: false, pointRadius: 0, borderDash: [4,3] },
    ],
  };
  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { size: 12 }, color: '#374151' } }, tooltip: { mode: 'index', intersect: false, callbacks: { label: c => ` ${c.dataset.label}: ${fmtK(c.raw)}` } } },
    scales: {
      y: { beginAtZero: false, ticks: { color: '#94A3B8', callback: v => fmtK(v) }, grid: { color: '#F1F5F9' } },
      x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
    },
  };

  const deptBarData = {
    labels: deptLabels,
    datasets: [
      { label: 'Headcount', data: deptCounts, backgroundColor: '#EEF2FF', borderColor: '#2563EB', borderWidth: 2, borderRadius: 6, yAxisID: 'y1' },
      { label: 'Net Pay',   data: deptPays,   backgroundColor: ['#2563EB','#8B5CF6','#10B981','#F59E0B','#EF4444'].slice(0,deptLabels.length), borderRadius: 6, yAxisID: 'y2' },
    ],
  };
  const deptBarOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { usePointStyle: true, font:{ size:12 }, color:'#374151' } }, tooltip: { mode:'index', intersect:false } },
    scales: {
      y1: { type:'linear', position:'left', beginAtZero:true, ticks:{ color:'#94A3B8' }, grid:{ color:'#F1F5F9' }, title:{ display:true, text:'Headcount', color:'#94A3B8', font:{ size:11 } } },
      y2: { type:'linear', position:'right', beginAtZero:true, ticks:{ color:'#94A3B8', callback: v => fmtK(v) }, grid:{ display:false }, title:{ display:true, text:'Net Pay', color:'#94A3B8', font:{ size:11 } } },
      x:  { ticks:{ color:'#374151', font:{weight:'600'} }, grid:{ display:false } },
    },
  };

  const donutData = {
    labels: ['Net Pay', 'Tax & NI', 'Pension'],
    datasets: [{ data: [Math.round((net || 78000)*100)/100, Math.round((tax || 14200)*100)/100, Math.round((pension || 5800)*100)/100], backgroundColor: ['#2563EB','#EF4444','#F59E0B'], borderWidth: 0, borderRadius: 3 }],
  };
  const donutOpts = { responsive:true, maintainAspectRatio:false, cutout:'70%', plugins:{ legend:{ position:'right', labels:{ usePointStyle:true, font:{size:12}, color:'#374151' } }, tooltip:{ callbacks:{ label: c => ` ${c.label}: ${fmtK(c.raw)}` } } } };

  const headcountBar = {
    labels: MONTHS,
    datasets: [{ label:'Active Employees', data:[8,8,9,9,10,10,11,11,12,12,totalEmp||13,totalEmp||13], backgroundColor:'#2563EB', borderRadius:5 }],
  };
  const headcountOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{ y:{ beginAtZero:true, ticks:{ color:'#94A3B8', stepSize:1 }, grid:{ color:'#F1F5F9' } }, x:{ ticks:{color:'#94A3B8'}, grid:{display:false} } },
  };

  // ── CSV export ──────────────────────────────────────────────────────────
  const exportCSV = () => {
    const rows = [['Employee','Department','Gross','Tax','Net Pay','Status']];
    (employees.length > 0 ? employees : []).forEach(e =>
      rows.push([e.employeeName, e.department, e.basicSalary, e.taxPayment, e.netPay, e.status])
    );
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`; a.download = `smart-payroll-report-${format(new Date(),'yyyy-MM-dd')}.csv`; a.click();
  };

  const TABS = [
    { key: 'overview',   label: 'Payroll Overview' },
    { key: 'department', label: 'By Department'    },
    { key: 'headcount',  label: 'Headcount Trend'  },
  ];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', margin:0 }}>Reports & Analytics</h1>
          <p style={{ fontSize:13.5, color:'#64748B', marginTop:4 }}>
            {format(new Date(),'MMMM yyyy')} · {totalEmp} employee{totalEmp!==1?'s':''} · Payroll analysis &amp; insights
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', background:'#fff', color:'#374151', border:'1.5px solid #E2E8F0', borderRadius:10, fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            <Ic d={ICONS.download} size={16} color="#374151" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display:'flex', gap:14, marginBottom:24, flexWrap:'wrap' }}>
        <KPI label="Total Net Payroll"  value={fmtK(net  || 78000)} sub="This cycle"  accent="#2563EB" icon={ICONS.money}  />
        <KPI label="Total Gross"        value={fmtK(gross|| 98000)} sub="Pre-tax"     accent="#8B5CF6" icon={ICONS.chart}  />
        <KPI label="Total Tax Withheld" value={fmtK(tax  || 14200)} sub="PAYE + NI"   accent="#EF4444" icon={ICONS.tax}   />
        <KPI label="Total Employees"    value={totalEmp  || 0}      sub="On payroll"  accent="#10B981" icon={ICONS.people} />
      </div>

      {/* ── Tab selector ── */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#F8FAFF', padding:5, borderRadius:12, width:'fit-content', border:'1.5px solid #E8EDF5' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setView(t.key)}
            style={{ padding:'7px 18px', borderRadius:9, border:'none', background: view===t.key ? '#fff' : 'transparent', color: view===t.key ? '#2563EB' : '#64748B', fontWeight: view===t.key ? 700 : 500, fontSize:13, cursor:'pointer', fontFamily:'inherit', boxShadow: view===t.key ? '0 1px 6px rgba(37,99,235,0.12)' : 'none', transition:'all 0.18s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Main chart area ── */}
      {view === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
          {/* Payroll trend line */}
          <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', padding:'22px 24px', boxShadow:'0 2px 8px rgba(37,99,235,0.05)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div>
                <h3 style={{ fontWeight:700, fontSize:15, color:'#0F172A', margin:0 }}>Payroll Cost Trend — 2026</h3>
                <p style={{ fontSize:12, color:'#94A3B8', marginTop:3 }}>Monthly gross, net, and tax breakdown</p>
              </div>
            </div>
            <div style={{ height:260 }}><Line data={lineData} options={lineOpts} /></div>
          </div>

          {/* Deduction breakdown donut */}
          <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', padding:'22px 24px', boxShadow:'0 2px 8px rgba(37,99,235,0.05)' }}>
            <h3 style={{ fontWeight:700, fontSize:15, color:'#0F172A', margin:'0 0 6px' }}>Pay Breakdown</h3>
            <p style={{ fontSize:12, color:'#94A3B8', marginBottom:16 }}>Net vs deductions (current cycle)</p>
            <div style={{ height:200 }}><Doughnut data={donutData} options={donutOpts} /></div>
            <div style={{ marginTop:18, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[
                { label:'Net Pay', val: fmtK(net||78000),  color:'#2563EB' },
                { label:'Tax',     val: fmtK(tax||14200),  color:'#EF4444' },
                { label:'Pension', val: fmtK(pension||5800),color:'#F59E0B' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ height:3, borderRadius:4, background:s.color, marginBottom:6 }} />
                  <p style={{ fontSize:13, fontWeight:700, color:'#0F172A', margin:0 }}>{s.val}</p>
                  <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly summary table */}
          <div style={{ gridColumn:'1/-1', background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', overflow:'hidden', boxShadow:'0 2px 8px rgba(37,99,235,0.05)' }}>
            <div style={{ padding:'16px 22px', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:'#0F172A', margin:0 }}>Monthly Payroll Summary</h3>
              <span style={{ fontSize:12, color:'#94A3B8' }}>Simulated annual projection</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#F8FAFF' }}>
                    {['Month','Gross Pay','Tax Withheld','Net Pay','vs Prev Month'].map(h => (
                      <th key={h} style={{ padding:'10px 18px', fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:'0.06em', textAlign:'left', borderBottom:'1px solid #F1F5F9' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MONTHS.map((m, i) => {
                    const n = netTrend[i], g = gTrend[i], t = tTrend[i];
                    const prev = i > 0 ? netTrend[i-1] : n;
                    const delta = prev > 0 ? (((n - prev) / prev) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={m} style={{ borderBottom: i < 11 ? '1px solid #F8FAFF' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background='#F8FAFF'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'10px 18px', fontWeight:600, fontSize:13, color:'#374151' }}>{m}</td>
                        <td style={{ padding:'10px 18px', fontSize:13, color:'#374151' }}>{fmtK(g)}</td>
                        <td style={{ padding:'10px 18px', fontSize:13, color:'#DC2626' }}>{fmtK(t)}</td>
                        <td style={{ padding:'10px 18px', fontSize:13, fontWeight:700, color:'#0F172A' }}>{fmtK(n)}</td>
                        <td style={{ padding:'10px 18px' }}>
                          <span style={{ fontSize:11, fontWeight:700, color: parseFloat(delta)>=0 ? '#16A34A' : '#DC2626', background: parseFloat(delta)>=0 ? '#F0FDF4' : '#FEF2F2', padding:'2px 8px', borderRadius:20 }}>
                            {parseFloat(delta)>=0?'↑':'↓'}{Math.abs(delta)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'department' && (
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
          <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', padding:'22px 24px', boxShadow:'0 2px 8px rgba(37,99,235,0.05)' }}>
            <h3 style={{ fontWeight:700, fontSize:15, color:'#0F172A', margin:'0 0 4px' }}>Department: Headcount &amp; Net Pay</h3>
            <p style={{ fontSize:12, color:'#94A3B8', marginBottom:20 }}>Dual-axis: people count (left) vs payroll spend (right)</p>
            <div style={{ height:280 }}><Bar data={deptBarData} options={deptBarOpts} /></div>
          </div>
          <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', padding:'22px 24px', boxShadow:'0 2px 8px rgba(37,99,235,0.05)' }}>
            <h3 style={{ fontWeight:700, fontSize:15, color:'#0F172A', margin:'0 0 18px' }}>Department Details</h3>
            {deptLabels.map((dept, i) => {
              const count = deptCounts[i], pay = deptPays[i];
              const maxPay = Math.max(...deptPays, 1);
              const COLORS = ['#2563EB','#8B5CF6','#10B981','#F59E0B','#EF4444'];
              return (
                <div key={dept} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{dept}</span>
                    <div style={{ display:'flex', gap:12 }}>
                      <span style={{ fontSize:12, color:'#64748B' }}>{count} people</span>
                      <span style={{ fontSize:13, fontWeight:700, color:COLORS[i%COLORS.length] }}>{fmtK(pay)}</span>
                    </div>
                  </div>
                  <div style={{ height:6, background:'#F1F5F9', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(pay/maxPay)*100}%`, background:COLORS[i%COLORS.length], borderRadius:4, transition:'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'headcount' && (
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
          <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', padding:'22px 24px', boxShadow:'0 2px 8px rgba(37,99,235,0.05)' }}>
            <h3 style={{ fontWeight:700, fontSize:15, color:'#0F172A', margin:'0 0 4px' }}>Headcount Trend — 2026</h3>
            <p style={{ fontSize:12, color:'#94A3B8', marginBottom:20 }}>Monthly active employee count (simulated growth)</p>
            <div style={{ height:280 }}><Bar data={headcountBar} options={headcountOpts} /></div>
          </div>
          <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E8EDF5', padding:'22px 24px', boxShadow:'0 2px 8px rgba(37,99,235,0.05)' }}>
            <h3 style={{ fontWeight:700, fontSize:15, color:'#0F172A', margin:'0 0 18px' }}>Workforce Snapshot</h3>
            {[
              { label:'Total Active',    value: totalEmp, color:'#2563EB', bg:'#EEF2FF' },
              { label:'Avg. Net Pay',    value: fmtK(totalEmp > 0 ? (net/totalEmp) : 6500), color:'#10B981', bg:'#ECFDF5' },
              { label:'Depts. Active',   value: deptLabels.length, color:'#8B5CF6', bg:'#F5F3FF' },
              { label:'On Leave',        value: employees.filter(e=>e.status==='On Leave').length, color:'#F59E0B', bg:'#FFFBEB' },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:s.bg, borderRadius:12, marginBottom:10 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{s.label}</span>
                <span style={{ fontSize:18, fontWeight:800, color:s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;