import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminRequestTrendChart = ({ requests = [] }) => {
    const chartData = useMemo(() => {
        const days = [];
        const counts = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
            days.push(dateStr);
            counts[dateStr] = 0;
        }

        requests.forEach((req) => {
            const dateStr = new Date(req.createdAt).toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
            if (counts[dateStr] !== undefined) {
                counts[dateStr]++;
            }
        });

        const labels = days;
        const data = days.map((day) => counts[day]);

        return {
            labels,
            datasets: [
                {
                    label: "Volume of Requests",
                    data,
                    fill: true,
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        gradient.addColorStop(0, "rgba(59, 130, 246, 0.4)");
                        gradient.addColorStop(1, "rgba(59, 130, 246, 0.01)");
                        return gradient;
                    },
                    borderColor: "#3b82f6",
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#3b82f6",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };
    }, [requests]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "#111827",
                titleFont: { size: 13, weight: "bold" },
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "#f3f4f6",
                    drawBorder: false,
                },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 11 },
                    stepSize: 1,
                },
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: "#4b5563",
                    font: { weight: "600", size: 10 },
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-50 w-full max-w-md h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 tracking-tight">Activity Trend</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Service requests over the last 7 days</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    📈
                </div>
            </div>
            <div className="flex-grow">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default AdminRequestTrendChart;
