import React, { useMemo, useState } from 'react';
import Card from './Card.jsx';
import { Icon } from './Icon.jsx';
import { ICONS } from '../icons.jsx';
import MetricCard from './MetricCard.jsx';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = ({ employees, user }) => {
  const { metrics, positionData } = useMemo(() => {
    let totalEarnings = 0;
    let totalDeductions = 0;
    let totalNetPay = 0;
    const positionCount = {};

    employees.forEach((emp) => {
      totalEarnings += emp.taxablePay || 0;
      totalDeductions +=
        (emp.taxPayment || 0) +
        (emp.pensionPay || 0) +
        (emp.niPayment || 0) +
        (emp.studentLoan || 0);
      totalNetPay += emp.netPay || 0;
      positionCount[emp.position] = (positionCount[emp.position] || 0) + 1;
    });

    return {
      metrics: {
        totalEmployees: employees.length,
        totalEarnings,
        totalDeductions,
        totalNetPay,
      },
      positionData: {
        labels: Object.keys(positionCount),
        counts: Object.values(positionCount),
      },
    };
  }, [employees]);

  const formatCurrency = (amount) =>
    `$${(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    },
    elements: {
      line: {
        tension: 0.4,
        borderColor: '#4338ca',
        borderWidth: 3,
        fill: 'start',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(67, 56, 202, 0.2)');
          gradient.addColorStop(1, 'rgba(67, 56, 202, 0)');
          return gradient;
        },
      },
      point: { radius: 0 },
    },
  };

  const lineChartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Working Days',
        data: [22, 20, 23, 22, 22, 21, 22, 23, 22, 21, 22, 20],
      },
    ],
  };

  const barChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { color: '#94a3b8' } },
      y: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    },
  };

  const barChartData = {
    labels: positionData.labels,
    datasets: [
      {
        label: 'No. of Employees',
        data: positionData.counts,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDayIndex = getDay(monthStart);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {user ? user.firstName : 'Admin'}! Here's what's happening with your payroll today.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="NO. OF EMPLOYEE" value={metrics.totalEmployees} icon={ICONS.group} color="indigo" />
        <MetricCard title="TOTAL NET PAY" value={formatCurrency(metrics.totalNetPay)} icon={ICONS.dollar} color="blue" />
        <MetricCard title="TOTAL EARNINGS" value={formatCurrency(metrics.totalEarnings)} icon={ICONS.trendingUp} color="green" />
        <MetricCard title="TOTAL DEDUCTIONS" value={formatCurrency(metrics.totalDeductions)} icon={ICONS.trendingDown} color="red" />
      </div>

      {/* Charts and Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Monthly Working Days</h3>
            <div className="h-96">
              <Line options={lineChartOptions} data={lineChartData} />
            </div>
          </Card>
        </div>

        <div className="xl:col-span-1 space-y-8">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-700">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <div className="space-x-1">
                <button
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  &lt;
                </button>
                <button
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  &gt;
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="font-bold text-xs text-slate-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: startingDayIndex }).map((_, index) => (
                <div key={`empty-${index}`}></div>
              ))}
              {daysInMonth.map((day) => (
                <div
                  key={day.toString()}
                  className={`py-1.5 text-sm rounded-full cursor-pointer ${
                    format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Employees by Position</h3>
            <div className="h-60">
              <Bar options={barChartOptions} data={barChartData} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;