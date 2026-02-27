import React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import { TechData } from "../context/Techniciandatamaintenance";
ChartJS.register(...registerables);



const TechnicianRequestCostChart = ({ technicianassignedassert }) => {


  if (!technicianassignedassert || technicianassignedassert.length === 0) return null;

  const data = {
    labels: technicianassignedassert.map((req) => req.assetid?.assetName || "N/A"),
    datasets: [
      {
        label: "Request Cost",
        data: technicianassignedassert.map((req) => req.costEstimate || 0),
        backgroundColor: technicianassignedassert.map((req) => {
          switch (req.status?.toLowerCase()) {
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
            return `${req.assetid?.assetName || "N/A"}: ₹${req.costEstimate || 0} (${req.status})`;
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
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 text-center mb-6">
        Request Cost Overview
      </h3>
      <div className="flex-1 w-full min-h-[300px]">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
};

export default TechnicianRequestCostChart;
