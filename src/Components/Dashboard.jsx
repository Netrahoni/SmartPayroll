import React, { useMemo, useState } from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import Icon from './Icon';
import { ICONS } from '../icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';

// Import Chart.js components
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for both charts
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = ({ onNavigate, employees }) => {

    // --- DYNAMIC CALCULATIONS ---
    const { metrics, positionData } = useMemo(() => {
        let totalMonthlyPayroll = 0;
        let totalNetPay = 0;
        const positionCount = {};

        employees.forEach(emp => {
            totalMonthlyPayroll += (emp.basicSalary || 0);
            totalNetPay += (emp.netPay || 0);
            positionCount[emp.position] = (positionCount[emp.position] || 0) + 1;
        });

        const averageSalary = employees.length > 0 ? totalMonthlyPayroll / employees.length : 0;
        
        const positionLabels = Object.keys(positionCount);
        const positionCounts = Object.values(positionCount);

        return {
            metrics: {
                totalEmployees: employees.length,
                totalMonthlyPayroll,
                totalNetPay,
                averageSalary
            },
            positionData: {
                labels: positionLabels,
                counts: positionCounts,
            }
        };
    }, [employees]);

    const formatCurrency = (amount) => `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // --- CHART CONFIGURATIONS ---
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Monthly Payroll Costs (Last 6 Months)',
                font: { size: 16, family: 'Inter', weight: '600' },
                color: '#334155'
            },
        },
        scales: {
            y: { ticks: { callback: value => '$' + value / 1000 + 'k' } },
            x: { grid: { display: false } }
        }
    };

    const barChartData = {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
            label: 'Total Payroll',
            data: [110234, 115678, 124560, 122345, 130112, metrics.totalMonthlyPayroll],
            backgroundColor: 'rgba(79, 70, 229, 0.8)',
            borderRadius: 6,
        }],
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' },
            title: {
                display: true,
                text: 'Employee Distribution by Role',
                font: { size: 16, family: 'Inter', weight: '600' },
                color: '#334155'
            },
        },
    };

    const doughnutChartData = {
        labels: positionData.labels,
        datasets: [{
            label: '# of Employees',
            data: positionData.counts,
            backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };
    
    // --- RECENT ACTIVITY & CALENDAR ---
    const recentActivity = [
        { id: 1, icon: ICONS.check, text: `Payroll for July 2025 was successfully processed.`, time: '2 weeks ago' },
        { id: 2, icon: ICONS.add, text: `New employee 'Sudeep Dhami' was added.`, time: '3 weeks ago' },
        { id: 3, icon: ICONS.pdf, text: `Tax report for Q2 2025 was generated.`, time: '1 month ago' },
    ];
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startingDayIndex = getDay(monthStart);

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-['Inter',_sans-serif]">
            <PageHeader title="Dashboard" />

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Welcome Back, Admin!</h2>
                <p className="text-slate-500">Here's your payroll overview for {format(new Date(), 'MMMM yyyy')}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* KPI Cards */}
                <Card><div className="flex items-center"><div className="p-3 bg-blue-100 rounded-full mr-4"><Icon path={ICONS.group} className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-slate-500">Total Employees</p><p className="text-2xl font-bold text-slate-800">{metrics.totalEmployees}</p></div></div></Card>
                <Card><div className="flex items-center"><div className="p-3 bg-green-100 rounded-full mr-4"><Icon path={ICONS.cash} className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-slate-500">Monthly Gross Pay</p><p className="text-2xl font-bold text-slate-800">{formatCurrency(metrics.totalMonthlyPayroll)}</p></div></div></Card>
                <Card><div className="flex items-center"><div className="p-3 bg-indigo-100 rounded-full mr-4"><Icon path={ICONS.check} className="w-6 h-6 text-indigo-600" /></div><div><p className="text-sm text-slate-500">Net Pay Disbursed</p><p className="text-2xl font-bold text-slate-800">{formatCurrency(metrics.totalNetPay)}</p></div></div></Card>
                <Card><div className="flex items-center"><div className="p-3 bg-yellow-100 rounded-full mr-4"><Icon path={ICONS.chart} className="w-6 h-6 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Average Salary</p><p className="text-2xl font-bold text-slate-800">{formatCurrency(metrics.averageSalary)}</p></div></div></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* --- MAIN CONTENT (CHARTS) --- */}
                <div className="lg:col-span-3 space-y-8">
                    <Card><div className="h-80 relative"><Bar options={barChartOptions} data={barChartData} /></div></Card>
                    <Card><div className="h-64 relative"><Doughnut options={doughnutChartOptions} data={doughnutChartData} /></div></Card>
                </div>

                {/* --- SIDEBAR (CALENDAR & ACTIVITY) --- */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-700">{format(currentDate, 'MMMM yyyy')}</h3>
                            <div className="space-x-1">
                                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-slate-100">&lt;</button>
                                <button onClick={() => setCurrentDate(new Date())} className="text-sm px-3 py-1.5 rounded-full hover:bg-slate-100">Today</button>
                                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-slate-100">&gt;</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center">
                            {daysOfWeek.map((day, index) => <div key={`${day}-${index}`} /* ... */ >{day}</div>)}
                            {Array.from({ length: startingDayIndex }).map((_, index) => <div key={`empty-${index}`}></div>)}
                            {daysInMonth.map(day => (
                                <div key={day.toString()} className={`py-1.5 text-sm rounded-full cursor-pointer ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}>
                                    {format(day, 'd')}
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Upcoming Paydays</h3>
                        <ul className="space-y-3">
                            {employees.slice(0, 3).map(emp => (
                                <li key={emp._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-full object-cover mr-3" src={`https://i.pravatar.cc/150?u=${emp._id}`} alt="avatar" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{emp.employeeName}</p>
                                            <p className="text-xs text-slate-500">{emp.position}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-indigo-600">{format(new Date(emp.nextPayDate), 'MMM dd')}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
