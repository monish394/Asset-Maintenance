import { TechData } from "../context/Techniciandatamaintenance"
export default function RequestDetails() {
    const { technicianassignedassert } = TechData();
    console.log(technicianassignedassert)
    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold mb-6">Request Details</h1>

                {technicianassignedassert.map((ele) => (
                    <div
                        key={ele._id}
                        className="bg-white rounded-xl p-4 mb-4 shadow-sm border"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <img
                                    src={ele.assetid?.assetImg}
                                    alt={ele.assetid?.assetName}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {ele.assetid?.assetName}
                                    </h2>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {ele.aiCategory} • {ele.requesttype}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex justify-end gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                ${ele.status === "completed" && "bg-green-100 text-green-700"}
                ${ele.status === "in-progress" && "bg-orange-100 text-orange-700"}
                ${ele.status === "pending" && "bg-yellow-100 text-yellow-700"}
              `}
                                    >
                                        {ele.status}
                                    </span>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                ${ele.aiPriority === "high" && "bg-red-100 text-red-700"}
                ${ele.aiPriority === "medium" && "bg-orange-100 text-orange-700"}
                ${ele.aiPriority === "low" && "bg-blue-100 text-blue-700"}
              `}
                                    >
                                        {ele.aiPriority}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-400 mt-1">
                                    Request ID: {ele._id}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-4 text-sm text-gray-600">
                            <span>
                                <strong>Created:</strong>{" "}
                                {new Date(ele.createdAt).toLocaleString()}
                            </span>
                            <span>
                                <strong>Assigned:</strong>{" "}
                                {ele.assignAt
                                    ? new Date(ele.assignAt).toLocaleString()
                                    : "pending"}
                            </span>
                            {ele.completedAt && (
                                <span>
                                    <strong>Completed:</strong>{" "}
                                    {new Date(ele.completedAt).toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                {technicianassignedassert.map((ele) => (
                    <div
                        key={ele._id}
                        className="bg-white rounded-2xl border shadow-sm p-6 space-y-6 m-4"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">
                            Issue Details
                        </h2>

                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="text-base font-semibold text-gray-700 mb-1">
                                Customer Reported Issue
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {ele.description}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 border">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-semibold text-gray-700">
                                    AI Diagnosis
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
            ${ele.aiPriority === "high" && "bg-red-100 text-red-700"}
            ${ele.aiPriority === "medium" && "bg-orange-100 text-orange-700"}
            ${ele.aiPriority === "low" && "bg-blue-100 text-blue-700"}
          `}
                                >
                                    {ele.aiPriority} priority
                                </span>
                            </div>

                            <p className="text-gray-600 leading-relaxed">
                                {ele.aiResponse}
                            </p>
                        </div>
                    </div>
                ))}

            </div>


           


        </>

    )

}