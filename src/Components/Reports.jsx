import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import PageHeader from './PageHeader';
import Card from './Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Payroll Cost ($)',
            data: [110200, 115500, 120100, 118900, 124560, 126300],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        }, ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Payroll Costs' },
        },
    };

    return (
        <div>
            <PageHeader title="Reports & Analytics" />
            <Card>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Payroll Overview</h2>
                <div style={{ height: '400px' }}>
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </Card>
        </div>
    );
};

export default Reports;