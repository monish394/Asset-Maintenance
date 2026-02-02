import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";
import { TechData } from "../context/Techniciandatamaintenance";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TechnicianRequestCostChart = ({ technicianassignedassert }) => {


  if (!technicianassignedassert || technicianassignedassert.length === 0) return null;

  const data = {
    labels: technicianassignedassert.map((req) => req.assetid.assetName),
    datasets: [
      {
        label: "Request Cost",
        data: technicianassignedassert.map((req) => req.costEstimate || 0),
        backgroundColor: technicianassignedassert.map((req) => {
          switch (req.status.toLowerCase()) {
            case "completed":
              return "#22c55e"; 
            case "in-process":
              return "#3b82f6";
            case "pending":
              return "#f97316";
            case "assigned":
              return "#f1cb33"; 
            default:
              return "#fa4134";
          }
        }),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: "y", 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const req = technicianassignedassert[context.dataIndex];
            return `${req.assetid.assetName}: ₹${req.costEstimate || 0} (${req.status})`;
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutQuart",
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `₹${val}`,
        },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl mx-auto h-[400px] mt-6">
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
        Request Cost Overview
      </h3>
      <div className="h-[320px]">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
};

export default TechnicianRequestCostChart;
