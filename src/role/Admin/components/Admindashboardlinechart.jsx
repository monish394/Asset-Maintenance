import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const AdminDashboardLineBarChart = ({ stats }) => {
  if (!stats) return null;

  const data = {
    labels: ["Requests"],
    datasets: [
      {
        type: "bar",
        label: "Completed",
        data: [stats.completedrequest],
        backgroundColor: "#22c55e",
        borderRadius: 10,
      },
      {
        type: "bar",
        label: "In Process",
        data: [stats.inprocessrequest],
        backgroundColor: "#3b82f6",
        borderRadius: 10,
      },
      {
        type: "bar",
        label: "Pending",
        data: [stats.pendingrequest],
        backgroundColor: "#ef4444",
        borderRadius: 10,
      },
      {
        type: "line",
        label: "Pending Trend",
        data: [stats.pendingrequest],
        borderColor: "#f97316",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1300,
      easing: "easeOutCubic",
    },
    plugins: {
      legend: {
        position: "bottom",
        onClick: () => {},
        labels: {
          usePointStyle: true,
          filter: (item) => item.text !== "Pending Trend",
        },
      },
      tooltip: {
        mode: "nearest",
        intersect: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md h-[390px]">
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">
        Work Request Status
      </h3>
      <div className="h-[280px]">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
};

export default AdminDashboardLineBarChart;
