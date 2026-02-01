import { useState } from "react"
import { useUserAsset } from "../context/userassetprovider";
import { FcIdea } from "react-icons/fc";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
export default function RaiseRequest() {
    const [assetid,setAssetid]=useState("")
    
    console.log(assetid)
    const [assetdescription,setAssetdescription]=useState("")

    const { myasset,myraiserequest,setMyraiserequest } = useUserAsset();
    console.log("User assets raise request page:", myasset);
    console.log("my raise request -",myraiserequest)
    const [showform, setShowform] = useState(false)

    const handleShowform = () => {
        setShowform(!showform)
    }
    const handleCancel=()=>{
        setAssetid("")
        setAssetdescription("")
        handleShowform()

    }

   const handleSubmit = async () => {
  if (!assetid ) {
    
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/raiserequest",
      { assetid, description: assetdescription },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const selectedAsset = myasset.find(a => a._id === assetid)
    const newRequest = {
      ...res.data,
      assetid: {
        _id: assetid,
        assetName: selectedAsset?.assetName,
      },
    };

    setMyraiserequest([newRequest,...myraiserequest ]);

    setAssetid("");
    setAssetdescription("");
    handleShowform();

  } catch (err) {
    console.log(err.message);
  }
};

    return (
        <div>
            <div>
            </div>
            <div>
      



            </div>
            {showform && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-[420px] rounded-xl shadow-lg p-6">

                    <h1 className="text-xl font-semibold text-gray-800 mb-1">
                        Raise New Request
                    </h1>
                    <p className="text-sm text-gray-500 mb-4">
                        Describe the issue with the selected asset
                    </p>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asset
                        </label>
                        <select value={assetid}  onChange={e=>setAssetid(e.target.value)} className="border rounded-lg" >
                            <option  value="">Select Asset</option>
                            {
                                myasset.map((ele,i)=>{
                                    return <option className="text-black bg-grey-600" key={i} value={ele._id}>{ele.assetName}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Description
                        </label>
                        <textarea value={assetdescription} onChange={e=>setAssetdescription(e.target.value)}
                            placeholder="Describe the problem..."
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={handleCancel}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300
                   text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600
                   text-white hover:bg-blue-700 transition"
                        >
                            Submit
                        </button>
                    </div>

                </div>
            </div>}

  <div className="bg-white shadow-lg rounded-lg p-6 w-full">
   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <h1 className="text-3xl font-bold text-gray-800">
    My Service Requests
  </h1>

  <button
    onClick={handleShowform}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg 
               hover:bg-blue-700 active:scale-95 transition-all shadow-md sm:self-auto self-end"
  >
    <FaPlus />
    Raise Request
  </button>
</div>


   <div className="overflow-x-auto">
<table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden shadow-sm">
  <thead className="bg-gray-200">
    <tr>
      <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase">Asset Name</th>
      <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase">Issue Description</th>
      <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase">Status</th>
      <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase">Technician</th>
    </tr>
  </thead>

  <tbody>
    {myraiserequest.reverse().map((ele, i) => (
      <tr
        key={i}
        className={`border-t border-gray-200 hover:bg-gray-50 ${
          i % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}
      >
        <td className="px-4 py-3 text-gray-900 font-medium">
          {typeof ele.assetid === "object" ? ele.assetid.assetName : "Loading..."}
        </td>

        <td className="px-4 py-3 text-gray-700">
          <div className="mb-2">{ele.description}</div>

          {ele.aiResponse && (
            <div className="mt-2 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow-sm text-gray-800 text-sm leading-relaxed transition-transform transform hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-lg"><FcIdea /></span>
                <span className="font-semibold text-gray-900">AI Suggestion about the Issue:</span>
              </div>

              <div style={{fontFamily:"calibri ",fontSize:"15px"}}
                className="whitespace-pre-wrap mb-2"
                dangerouslySetInnerHTML={{
                  __html: ele.aiResponse
                    .replace(/`([^`]+)`/g, `<span class="bg-gray-200 px-1 rounded text-gray-800 font-mono">$1</span>`)
                    .replace(/\b(Correct|Incorrect|High|Medium|Low)\b/g, `<span class="font-semibold text-blue-700">$1</span>`)
                }}
              />


              </div>
          )}
        </td>

        <td className="px-4 py-3 text-gray-700">
          <span
            className={`font-medium whitespace-nowrap px-3 py-1 rounded-full ${
              ele.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : ele.status === "assigned"
                ? "bg-blue-100 text-blue-800"
                : ele.status === "in-process"
                ? "bg-purple-100 text-purple-800"
                : ele.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {ele.status}
          </span>
        </td>

        <td className="px-4 py-3 text-gray-700">
          {ele.assignedto ? ele.assignedto.name : "Unassigned"}
        </td>
      </tr>
    ))}
  </tbody>
</table>





</div>
</div>

  </div>

    )

}


