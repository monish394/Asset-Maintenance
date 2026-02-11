import { TechData } from "../context/Techniciandatamaintenance"

export default function ServiceHistory() {
  const { technicianassignedassert } = TechData()

  const inProgress = technicianassignedassert.filter(
    ele => ele.status === "in-process"
  )

  const completed = technicianassignedassert.filter(
    ele => ele.status === "completed"
  )

  return (
  <div className="p-10 space-y-14 font-[Inter] bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

  <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
    Service Details
  </h1>

  <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        In Progress Work Orders
      </h2>
      <span className="text-sm text-gray-500 font-medium">
        {inProgress.length} Active
      </span>
    </div>

    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-full text-base">
        <thead className="bg-gray-50">
          <tr className="text-gray-600 uppercase text-xs tracking-wider">
            <th className="px-6 py-4 text-left font-semibold">Asset</th>
            <th className="px-6 py-4 text-left font-semibold">Issue</th>
            <th className="px-6 py-4 text-left font-semibold">Priority</th>
            <th className="px-6 py-4 text-left font-semibold">Cost</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {inProgress.length ? (
            inProgress.map((ele, index) => (
              <tr
                key={ele._id}
                className={`transition duration-200 hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {ele.assetid?.assetName}
                </td>

                <td className="px-6 py-4 text-gray-600 max-w-md">
                  {ele.description}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize
                    ${ele.aiPriority === "high" && "bg-red-100 text-red-700"}
                    ${ele.aiPriority === "medium" && "bg-yellow-100 text-yellow-700"}
                    ${ele.aiPriority === "low" && "bg-green-100 text-green-700"}
                  `}
                  >
                    {ele.aiPriority}
                  </span>
                </td>

                <td className="px-6 py-4 font-semibold text-gray-800">
                  {ele.costEstimate ? `₹${ele.costEstimate}` : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-6 text-center text-gray-400 font-medium">
                No in-progress work orders
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>


  <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Completed Work Orders
      </h2>
      <span className="text-sm text-gray-500 font-medium">
        {completed.length} Completed
      </span>
    </div>

    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-full text-base">
        <thead className="bg-gray-50">
          <tr className="text-gray-600 uppercase text-xs tracking-wider">
            <th className="px-6 py-4 text-left font-semibold">Asset</th>
            <th className="px-6 py-4 text-left font-semibold">Issue</th>
            <th className="px-6 py-4 text-left font-semibold">Completed At</th>
            <th className="px-6 py-4 text-left font-semibold">Cost</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {completed.length ? (
            completed.map((ele, index) => (
              <tr
                key={ele._id}
                className={`transition duration-200 hover:bg-green-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {ele.assetid?.assetName}
                </td>

                <td className="px-6 py-4 text-gray-600 max-w-md">
                  {ele.description}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {ele.completedAt
                    ? new Date(ele.completedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-6 py-4 font-semibold text-gray-800">
                  ₹{ele.costEstimate}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-6 text-center text-gray-400 font-medium">
                No completed work orders
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

</div>

  )
}
