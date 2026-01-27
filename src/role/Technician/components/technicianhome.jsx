
import { TechData } from "../context/Techniciandatamaintenance";
export default function TechnicianHome() {
    const {technicianassignedassert}=TechData()
    console.log(technicianassignedassert)



    return(
        <div>
            <h1>Technician Home page</h1>
<div className="p-6 space-y-4">
  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Recent Assigned Requests</h2>

  <div className="grid gap-4">
    {technicianassignedassert.map((ele, i) => (
      <div
        key={i}
        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
      >
        <div className="flex-1 flex flex-col sm:flex-row sm:gap-4">
          {ele.assetid?.assetImg && (
            <img
              src={ele.assetid.assetImg}
              alt={ele.assetid.assetName}
              className="w-20 h-20 rounded-md object-cover mb-2 sm:mb-0"
            />
          )}

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{ele.assetid?.assetName || "N/A"}</h3>
            <p className="text-gray-700 text-sm mt-1 line-clamp-2">{ele.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm text-gray-700 mt-2 sm:mt-0">
          <div>
            <span className="font-semibold">Raised By:</span> {ele.userid?.name || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Address:</span> {ele.userid?.address || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                ele.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 mr-29"
                  : ele.status === "assigned"
                  ? "bg-blue-100 text-blue-800"
                  : ele.status === "in-process"
                  ? "bg-purple-100 text-purple-800"
                  : ele.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {ele.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">Assigned At:</span>{" "}
            {ele.assignAt
              ? new Date(ele.assignAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Not Assigned"}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>



        </div>
    )
    
}