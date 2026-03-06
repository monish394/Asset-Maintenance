import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AcceptedRequestsChart({
    raiseRequests = [],
    generalRequests = [],
    completedRaise = [],
    completedGeneral = []
}) {
    const acceptedData = {
        labels: ["Asset", "General"],
        datasets: [
            {
                label: "Accepted",
                data: [raiseRequests.length, generalRequests.length],
                backgroundColor: [
                    "rgba(0, 49, 173, 1)", // indigo-500
                    "rgba(123, 0, 180, 1)", // violet-500
                ],
                borderRadius: 6,
            },
        ],
    };

    const completedData = {
        labels: ["Asset", "General"],
        datasets: [
            {
                label: "Completed",
                data: [completedRaise.length, completedGeneral.length],
                backgroundColor: [
                    "rgba(3, 0, 201, 0.8)", // custom blue
                    "rgba(100, 0, 171, 0.8)", // custom purple
                ],
                borderWidth: 0,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, color: '#94a3b8', font: { size: 10 } },
                grid: { color: '#f1f5f9' },
            },
            x: {
                ticks: { color: '#64748b', font: { size: 11, weight: '600' } },
                grid: { display: false },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: { size: 10, weight: '600' },
                    color: '#64748b'
                }
            },
        },
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
                Work Summary Overview
            </h3>

            <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-center text-slate-400 mb-2 uppercase tracking-tighter">Accepted Work</p>
                    <div className="flex-1 min-h-[180px]">
                        <Bar data={acceptedData} options={barOptions} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-center text-slate-400 mb-2 uppercase tracking-tighter">Completed Work</p>
                    <div className="flex-1 min-h-[180px]">
                        <Pie data={completedData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
