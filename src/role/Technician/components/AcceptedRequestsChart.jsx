import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AcceptedRequestsChart({ raiseRequests = [], generalRequests = [] }) {
    const data = {
        labels: ["Asset Requests", "General Requests"],
        datasets: [
            {
                label: "Accepted Requests",
                data: [raiseRequests.length, generalRequests.length],
                backgroundColor: [
                    "rgba(59, 246, 96, 0.6)", // blue-500
                    "rgba(76, 0, 255, 0.6)", // purple-500
                ],
                borderColor: [
                    "rgba(60, 255, 0, 1)",
                    "rgba(76, 0, 255, 1)",
                ],
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 text-center mb-6">
                Accepted Work Summary
            </h3>
            <div className="flex-1 w-full min-h-[300px]">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
