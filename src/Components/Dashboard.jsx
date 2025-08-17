import React, { useMemo, useState } from 'react';
// PageHeader is no longer needed here
import Card from './Card';
import Icon from './Icon';
import { ICONS } from '../icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, startOfYear, endOfYear, isAfter } from 'date-fns';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const Dashboard = ({ onNavigate, employees }) => {
    // --- DYNAMIC CALCULATIONS ---
    const { metrics, departmentSummaries, positionData, upcomingPaydays } = useMemo(() => {
        let totalEarnings = 0;
        let totalDeductions = 0;
        let totalNetPay = 0;
        const departmentData = {};
        const positionCount = {};

        employees.forEach(emp => {
            const gross = (emp.basicSalary || 0) + (emp.otherPayment || 0) + ((emp.overtimeHours || 0) * (emp.hourlyRate || 0));
            const deductions = (emp.taxPayment || 0) + (emp.pensionPay || 0) + (emp.niPayment || 0) + (emp.studentLoan || 0);
            const net = emp.netPay || 0;

            totalEarnings += gross;
            totalDeductions += deductions;
            totalNetPay += net;

            if (!departmentData[emp.department]) {
                departmentData[emp.department] = { totalEarnings: 0, totalDeductions: 0, totalNetPay: 0, count: 0 };
            }
            departmentData[emp.department].totalEarnings += gross;
            departmentData[emp.department].totalDeductions += deductions;
            departmentData[emp.department].totalNetPay += net;
            departmentData[emp.department].count++;
            
            positionCount[emp.position] = (positionCount[emp.position] || 0) + 1;
        });
        
        const topDepartments = Object.entries(departmentData)
            .sort(([,a],[,b]) => b.count - a.count)
            .slice(0, 2)
            .map(([name, data]) => ({ name, ...data }));

        const today = new Date();
        const upcoming = employees
            .filter(emp => isAfter(new Date(emp.nextPayDate), today))
            .sort((a, b) => new Date(a.nextPayDate) - new Date(b.nextPayDate))
            .slice(0, 3);

        const averageSalary = employees.length > 0 ? totalEarnings / employees.length : 0;

        return {
            metrics: {
                totalEmployees: employees.length,
                totalEarnings,
                totalDeductions,
                totalNetPay,
                averageSalary
            },
            departmentSummaries: topDepartments,
            positionData: {
                labels: Object.keys(positionCount),
                counts: Object.values(positionCount),
            },
            upcomingPaydays: upcoming,
        };
    }, [employees]);

    const formatCurrency = (amount) => `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // --- CHART CONFIGURATIONS ---
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 30 }, x: { grid: { display: false } } },
        elements: { line: { tension: 0.4, borderColor: '#4f46e5', borderWidth: 2 }, point: { radius: 0 } },
    };

    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Working Days',
            data: [22, 20, 23, 22, 22, 21, 22, 23, 22, 21, 22, 20],
            fill: true,
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
        }],
    };
    
    const barChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } },
    };

    const barChartData = {
        labels: positionData.labels,
        datasets: [{
            label: 'No. of Employees',
            data: positionData.counts,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
        }],
    };
    
    // --- CALENDAR LOGIC ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startingDayIndex = getDay(monthStart);

    return (
        <div className="bg-slate-100 min-h-screen font-['Inter',_sans-serif]">
            {/* --- NEW HEADER SECTION --- */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500">Welcome back! Here's what's happening with your payroll today.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- MAIN CONTENT (Left & Center) --- */}
                <div className="lg:col-span-2 space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card><p className="text-sm text-slate-500">NO. OF EMPLOYEE</p><p className="text-2xl font-bold text-slate-800">{metrics.totalEmployees}</p></Card>
                        <Card><p className="text-sm text-slate-500">TOTAL NET PAY</p><p className="text-2xl font-bold text-slate-800">{formatCurrency(metrics.totalNetPay)}</p></Card>
                        <Card><p className="text-sm text-slate-500">TOTAL EARNINGS</p><p className="text-2xl font-bold text-slate-800">{formatCurrency(metrics.totalEarnings)}</p></Card>
                        <Card><p className="text-sm text-slate-500">TOTAL DEDUCTIONS</p><p className="text-2xl font-bold text-red-500">{formatCurrency(metrics.totalDeductions)}</p></Card>
                    </div>
                    {/* Line Chart */}
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Monthly Working Days</h3>
                        <div className="h-64"><Line options={lineChartOptions} data={lineChartData} /></div>
                    </Card>
                    {/* Department Summaries */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {departmentSummaries.map(dept => (
                            <Card key={dept.name}>
                                <h4 className="font-bold text-slate-800 mb-2">{dept.name}</h4>
                                <div className="text-sm space-y-1 text-slate-600">
                                    <p className="flex justify-between"><span>Total Earnings:</span> <span className="font-medium">{formatCurrency(dept.totalEarnings)}</span></p>
                                    <p className="flex justify-between"><span>Total Deductions:</span> <span className="font-medium text-red-500">{formatCurrency(dept.totalDeductions)}</span></p>
                                    <p className="flex justify-between font-bold"><span>Total Net Pay:</span> <span>{formatCurrency(dept.totalNetPay)}</span></p>
                                    <p className="flex justify-between pt-2 border-t mt-2"><span>No. of Employees:</span> <span className="font-medium">{dept.count}</span></p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* --- SIDEBAR (Right) --- */}
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-700">{format(currentDate, 'MMMM yyyy')}</h3>
                            <div className="space-x-1">
                                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-slate-100">&lt;</button>
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
                        <div className="mt-4 text-xs text-slate-500 space-y-1">
                            <p className="flex justify-between"><span>START:</span> <span>{format(startOfYear(new Date()), 'MM-dd-yyyy')}</span></p>
                            <p className="flex justify-between"><span>END:</span> <span>{format(endOfYear(new Date()), 'MM-dd-yyyy')}</span></p>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">No. of Position and Department</h3>
                        <div className="h-48"><Bar options={barChartOptions} data={barChartData} /></div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Upcoming Paydays</h3>
                        <ul className="space-y-3">
                            {upcomingPaydays.length > 0 ? upcomingPaydays.map(emp => (
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
                            )) : (
                                <p className="text-sm text-slate-500">No upcoming paydays in the near future.</p>
                            )}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
