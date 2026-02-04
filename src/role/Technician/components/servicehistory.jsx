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
    <div className="p-8 space-y-12 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Service Details
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
          In Progress Work Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm tracking-wider">
                <th className="p-3 text-left">Asset</th>
                <th className="p-3 text-left">Issue</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              {inProgress.length ? (
                inProgress.map(ele => (
                  <tr
                    key={ele._id}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 font-medium">{ele.assetid?.assetName}</td>
                    <td className="p-3">{ele.description}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                          ele.aiPriority === "high"
                            ? "bg-red-500"
                            : ele.aiPriority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {ele.aiPriority}
                      </span>
                    </td>
             <td className="p-3 font-semibold">
  {ele.costEstimate ? `₹${ele.costEstimate}` : "N/A"}
</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-400 font-medium"
                  >
                    No in-progress work orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Completed Work Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm tracking-wider">
                <th className="p-3 text-left">Asset</th>
                <th className="p-3 text-left">Issue</th>
                <th className="p-3 text-left">Completed At</th>
                <th className="p-3 text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              {completed.length ? (
                completed.map(ele => (
                  <tr
                    key={ele._id}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 font-medium">{ele.assetid?.assetName}</td>
                    <td className="p-3">{ele.description}</td>
                    <td className="p-3">
                      {ele.completedAt
                        ? new Date(ele.completedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3 font-semibold">₹{ele.costEstimate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-400 font-medium"
                  >
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
