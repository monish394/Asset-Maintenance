import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboardPieChart = ({ stats }) => {
  if (!stats) return null;

  const data = {
    labels: ["Total Assets", "Working Assets", "Under Maintenance", "Pending Requests"],
    datasets: [
      {
        data: [stats.totalAssets, stats.workingAssets, stats.undermaintance, stats.pendingRequests],
        backgroundColor: ["#0022ff", "#00ff6a", "#e03838", "#facc15"],
        borderWidth: 1,
        radius: "100%", // <-- decrease the pie size (default 100%)
      },
    ],
  };

  const options = {
    responsive: true,           // let the container size adjust
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          boxWidth: 15,
          padding: 12,
          font: {
            size: 15,
            family: "Inter, calibri",
          },
          usePointStyle: true,
        },
        maxWidth: 150, 
        animation: {
          duration: 3000,
          easing: "easeOutCubic",
        },// wrap to 2 labels per row
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-100 max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 ">
        Asset Status Overview
      </h3>
      <div style={{ height: 300, width: 300, margin: "0 auto" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default AdminDashboardPieChart;
