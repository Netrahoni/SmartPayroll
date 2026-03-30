import React, { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Ic = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={d} /></svg>
);
const ICONS = {
  people:  'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  netpay:  'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  up:      'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z',
  down:    'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z',
  gross:   'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
  tax:     'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  active:  'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  leave:   'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  chevL:   'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  chevR:   'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  dept:    'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
  pay:     'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
  star:    'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
};

const fmt = (n) => `$${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Sparkline (tiny inline chart) ─────────────────────────────────────────────
const Sparkline = ({ data, color }) => {
  const max = Math.max(...data, 1), min = Math.min(...data);
  const range = max - min || 1;
  const w = 64, h = 28;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// ── Premium KPI card ─────────────────────────────────────────────────────────
const KPI = ({ label, value, icon, accent, subLabel, spark, trend }) => (
  <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 2px 8px rgba(37,99,235,0.05)', flex: 1, minWidth: 0 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Ic d={icon} size={20} color={accent} />
      </div>
      {spark && <Sparkline data={spark} color={accent} />}
    </div>
    <div>
      <p style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>{value}</p>
      <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0', fontWeight: 600 }}>{label}</p>
    </div>
    {(subLabel || trend !== undefined) && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {trend !== undefined && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: trend >= 0 ? '#16A34A' : '#DC2626', background: trend >= 0 ? '#F0FDF4' : '#FEF2F2', padding: '2px 7px', borderRadius: 20 }}>
            <Ic d={trend >= 0 ? ICONS.up : ICONS.down} size={10} color={trend >= 0 ? '#16A34A' : '#DC2626'} />
            {Math.abs(trend)}%
          </span>
        )}
        {subLabel && <span style={{ fontSize: 11, color: '#94A3B8' }}>{subLabel}</span>}
      </div>
    )}
  </div>
);

// ── Avatar initials ──────────────────────────────────────────────────────────
const Av = ({ name, size = 32 }) => {
  const p = (name || '?').split(' ');
  const init = (p[0][0] + (p[1]?.[0] || '')).toUpperCase();
  const hue = (name || '').charCodeAt(0) * 11 % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, color: '#fff', background: `hsl(${hue},60%,48%)` }}>
      {init}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = ({ employees = [], user, onNavigate }) => {
  const [calDate, setCalDate] = useState(new Date());

  const {
    totalEmployees, totalNetPay, totalGross, totalTax,
    activeCount, onLeaveCount, deptChart, topEarners,
    payrollByMonth, statusDoughnut,
  } = useMemo(() => {
    let gross = 0, ded = 0, net = 0;
    const deptCount = {}, deptPay = {};
    employees.forEach(e => {
      gross += e.basicSalary || 0;
      ded   += (e.taxPayment || 0) + (e.pensionPay || 0) + (e.niPayment || 0) + (e.studentLoan || 0);
      net   += e.netPay || 0;
      const dept = e.department || 'General';
      deptCount[dept] = (deptCount[dept] || 0) + 1;
      deptPay[dept]   = (deptPay[dept] || 0) + (e.netPay || 0);
    });
    const activeCount  = employees.filter(e => e.status === 'Active').length;
    const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
    const topEarners   = [...employees].sort((a, b) => (b.netPay || 0) - (a.netPay || 0)).slice(0, 5);

    // Simulate monthly payroll cost (±10% variation)
    const base = net || 48000;
    const payrollByMonth = [0.91, 0.95, 0.98, 1.0, 1.02, 1.05, 1.03, 1.08, 1.06, 1.10, 1.09, 1.12].map(m => Math.round(base * m));

    const deptLabels = Object.keys(deptCount);
    const deptCounts = Object.values(deptCount);

    return {
      totalEmployees: employees.length, totalNetPay: net, totalGross: gross, totalTax: ded,
      activeCount, onLeaveCount,
      deptChart: { labels: deptLabels, data: deptCounts },
      topEarners, payrollByMonth,
      statusDoughnut: { active: activeCount, onLeave: onLeaveCount },
    };
  }, [employees]);

  // Calendar
  const monthStart = startOfMonth(calDate);
  const monthEnd   = endOfMonth(calDate);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startIdx   = getDay(monthStart);
  const today      = format(new Date(), 'yyyy-MM-dd');

  // Charts
  const lineData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [{
      data: payrollByMonth,
      borderColor: '#2563EB', borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0,0,0,220);
        g.addColorStop(0, 'rgba(37,99,235,0.18)'); g.addColorStop(1, 'rgba(37,99,235,0)');
        return g;
      },
    }],
  };
  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, callbacks: { label: (c) => ` $${c.raw.toLocaleString()}` } } },
    scales: {
      y: { beginAtZero: false, ticks: { color: '#94A3B8', callback: v => `$${(v/1000).toFixed(0)}k` }, grid: { color: '#F1F5F9' } },
      x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
    },
  };

  const barData = {
    labels: deptChart.labels,
    datasets: [{
      data: deptChart.data,
      backgroundColor: ['#2563EB','#8B5CF6','#10B981','#F59E0B','#EF4444','#06B6D4'].slice(0, deptChart.data.length),
      borderRadius: 6, borderSkipped: false,
    }],
  };
  const barOpts = {
    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { color: '#94A3B8' }, grid: { color: '#F1F5F9' } },
      y: { ticks: { color: '#374151', font: { weight: '600' } }, grid: { display: false } },
    },
  };

  const donutData = {
    labels: ['Active', 'On Leave'],
    datasets: [{ data: [statusDoughnut.active || 1, statusDoughnut.onLeave || 0], backgroundColor: ['#2563EB','#F59E0B'], borderWidth: 0, borderRadius: 4 }],
  };
  const donutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '72%',
    plugins: { legend: { display: false } },
  };

  const MONTH_SPARK = [22,20,23,22,21,22,23,22,21,22];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName || 'Admin'} 👋
        </h1>
        <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 6 }}>Here's your payroll overview for {format(new Date(), 'MMMM yyyy')}.</p>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <KPI label="Total Employees"     value={totalEmployees} icon={ICONS.people} accent="#2563EB" spark={[8,9,9,10,10,11,11,totalEmployees]} trend={8}   subLabel="vs last month" />
        <KPI label="Total Net Payroll"   value={fmt(totalNetPay)} icon={ICONS.netpay} accent="#10B981" spark={payrollByMonth.slice(-8)} trend={4}   subLabel="Apr 2026" />
        <KPI label="Gross Earnings"      value={fmt(totalGross)} icon={ICONS.gross}  accent="#8B5CF6" spark={MONTH_SPARK} trend={2}   subLabel="this cycle" />
        <KPI label="Total Deductions"    value={fmt(totalTax)}   icon={ICONS.tax}    accent="#EF4444" spark={MONTH_SPARK.map(x=>x*0.7)} trend={-1} subLabel="tax + NI" />
      </div>

      {/* ── Row 2: Status cards ── */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flex: '0 0 auto' }}>
          {[
            { label: 'Active',    val: activeCount,  color: '#16A34A', bg: '#F0FDF4', icon: ICONS.active },
            { label: 'On Leave',  val: onLeaveCount, color: '#D97706', bg: '#FFFBEB', icon: ICONS.leave  },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: `1.5px solid ${s.color}22`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 6px rgba(37,99,235,0.04)', minWidth: 130 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic d={s.icon} size={18} color={s.color} />
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: 0 }}>{s.val}</p>
                <p style={{ fontSize: 11.5, color: '#64748B', margin: 0, fontWeight: 600 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Quick actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { label: '+ Run Payroll',    bg: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#fff', nav: 'Payroll'    },
            { label: 'View Team',        bg: '#EEF2FF',  color: '#2563EB',  nav: 'Employees'  },
            { label: 'Time Off Requests',bg: '#FFFBEB',  color: '#D97706',  nav: 'TimeOff'    },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate?.(a.nav)}
              style={{ padding: '9px 18px', background: a.bg, color: a.color, border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: a.nav === 'Payroll' ? '0 4px 14px rgba(37,99,235,0.28)' : '0 1px 4px rgba(0,0,0,0.06)', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Payroll Cost Line */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: '20px 24px', boxShadow: '0 2px 8px rgba(37,99,235,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: 0 }}>Monthly Payroll Cost</h3>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>Projected annual payroll trend</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '3px 10px', borderRadius: 20 }}>↑ 12% YoY</span>
          </div>
          <div style={{ height: 210 }}><Line data={lineData} options={lineOpts} /></div>
        </div>

        {/* Status Donut */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: '20px 24px', boxShadow: '0 2px 8px rgba(37,99,235,0.05)' }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: '0 0 8px' }}>Workforce Status</h3>
          <div style={{ height: 160, position: 'relative' }}>
            <Doughnut data={donutData} options={donutOpts} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>{totalEmployees}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Total</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
            {[{ label: 'Active', color: '#2563EB', val: activeCount }, { label: 'On Leave', color: '#F59E0B', val: onLeaveCount }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{l.label} ({l.val})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Dept bar + Top Earners + Calendar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 20 }}>
        {/* Department Bar */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: '20px 24px', boxShadow: '0 2px 8px rgba(37,99,235,0.05)' }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: '0 0 18px' }}>Employees by Department</h3>
          <div style={{ height: deptChart.labels.length > 0 ? Math.max(120, deptChart.labels.length * 40) : 120 }}>
            {deptChart.labels.length > 0
              ? <Bar data={barData} options={barOpts} />
              : <p style={{ color: '#94A3B8', textAlign: 'center', paddingTop: 40 }}>No department data yet.</p>
            }
          </div>
        </div>

        {/* Top Earners */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: '20px 24px', boxShadow: '0 2px 8px rgba(37,99,235,0.05)' }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: '0 0 16px' }}>Top Earners</h3>
          {topEarners.length === 0
            ? <p style={{ color: '#94A3B8', fontSize: 13 }}>No employee data yet.</p>
            : topEarners.map((emp, i) => (
              <div key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', width: 16 }}>#{i + 1}</span>
                <Av name={emp.employeeName} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.employeeName}</p>
                  <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{emp.position || 'Staff'}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>{fmt(emp.netPay)}</span>
              </div>
            ))
          }
        </div>

        {/* Mini Calendar */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8EDF5', padding: '20px 24px', boxShadow: '0 2px 8px rgba(37,99,235,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: 0 }}>{format(calDate, 'MMM yyyy')}</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setCalDate(subMonths(calDate, 1))} style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic d={ICONS.chevL} size={14} color="#64748B" />
              </button>
              <button onClick={() => setCalDate(addMonths(calDate, 1))} style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic d={ICONS.chevR} size={14} color="#64748B" />
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', paddingBottom: 4 }}>{d}</div>
            ))}
            {Array(startIdx).fill(null).map((_, i) => <div key={`e${i}`} />)}
            {days.map(day => {
              const isToday = format(day, 'yyyy-MM-dd') === today;
              return (
                <div key={day.toString()} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 12, fontWeight: isToday ? 700 : 400, background: isToday ? '#2563EB' : 'transparent', color: isToday ? '#fff' : '#374151', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = '#F1F5F9'; }}
                  onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = 'transparent'; }}>
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
          {/* Next payroll hint */}
          <div style={{ marginTop: 16, background: '#EEF2FF', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ic d={ICONS.pay} size={16} color="#2563EB" />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', margin: 0 }}>Next Payroll</p>
              <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>{format(endOfMonth(calDate), 'MMM dd, yyyy')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;