import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TechnicianStatsPieChart = ({ stats }) => {
  if (!stats) return null;

  const data = {
    labels: ["Completed", "In Process", "Pending", "Assigned"],
    datasets: [
      {
        data: [
          stats.completedrequest,
          stats.inprocessrequest,
          stats.technicianpendingrequest,
          stats.technicianassignstats,
        ],
        backgroundColor: ["#5f22e4", "#23af2a", "#f97316", "#0066ff"], // green, blue, orange, yellow
        borderWidth: 1,
        radius: "100%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          boxWidth: 15,
          padding: 12,
          font: {
            size: 15,
            family: "Inter, Calibri",
          },
          usePointStyle: true,
        },
        maxWidth: 180,
        animation: {
          duration: 1500,       // smooth animation
          easing: "easeOutCubic",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} request${context.raw > 1 ? "s" : ""}`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: "easeOutCubic",
    },
    hoverOffset: 20, // slices pop out on hover
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
        Technician Request Status
      </h3>
      <div style={{ height: 300, width: 300, margin: "0 auto" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default TechnicianStatsPieChart;
