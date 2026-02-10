import { useEffect, useState } from "react";
import axios from "axios";
import { BsSearch } from "react-icons/bs";

export default function Assets() {
  const [showstatus, setShowstatus] = useState(false)
  const [requeststatusid, setRequeststatusid] = useState("")
  // console.log(requeststatusid)
  const [requeststatus, setRequeststatus] = useState("")
  const [statusFilter, setStatusFilter] = useState("all");
  const [requestasset, setRequestasset] = useState([])

  const [original_asset, set_original_asset] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    assetName: "",
    description: "",
    category: "",
    status: "",
    assignedTo: "",
    assetImg: ""
  });
  const [editAssetId, setEditAssetId] = useState("");
  const [user, setUser] = useState([]);
  const [assets, setAssets] = useState([]);
  const [txt, setTxt] = useState("");
  const [btnsearch, setBtnsearch] = useState("");
  const [showassign, setShowassign] = useState(false);
  const [assignuser, setAssignuser] = useState("");
  const [selectedassetid, setSelectedassetid] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/assets")
      .then(res => setAssets(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/findusers")
      .then(res => setUser(res.data))
      .catch(err => console.log(err.message));
  }, []);

  const filtereddata = assets.filter((asset) => {
    const matchesSearch = asset.assetName
      ? asset.assetName.toLowerCase().includes(btnsearch.toLowerCase())
      : false;

    const assetStatus = asset.status ? asset.status.toLowerCase() : "";

    const matchesStatus =
      statusFilter === "all" || assetStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });


  const handleSearch = () => setBtnsearch(txt);

  const handleAssign = (assertid) => {
    const asset = assets.find(a => a._id === assertid);
    set_selected_asset_for_assign(asset);
  };

  const set_selected_asset_for_assign = (asset) => {
    setSelectedassetid(asset._id);
    set_original_asset(asset);
    setAssignuser(asset.assignedTo ? asset.assignedTo._id : "");
    setShowassign(true);
  };

  const handleAssignTo = async () => {
    if (!assignuser || !selectedassetid) {
      alert("Select a user to assign");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/assets/${selectedassetid}`,
        { userid: assignuser },{
          headers:{
            Authorization:localStorage.getItem("token")
          }
        }
      );

    setAssets(prev =>
  prev.map(asset =>
    asset._id === selectedassetid ? res.data.asset : asset
  )
);


      if (editAssetId === selectedassetid) {
        setEditForm(prev => ({
          ...prev,
          assignedTo: assignuser,
          status: "assigned"
        }));
      }
      console.log(res.data)
      setShowassign(false);
      setAssignuser("");
      setSelectedassetid("");
      set_original_asset(null);

    } catch (err) {
      console.error(err.message);
    }
  };


  const handleEdit = (asset) => {
    setEditForm({
      assetName: asset.assetName,
      description: asset.description,
      category: asset.category,
      status: asset.status,
      assignedTo: asset.assignedTo ? asset.assignedTo._id || "" : "",
      assetImg: asset.assetImg
    });
    setEditAssetId(asset._id);
    setShowEdit(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editAssetId) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/editassert/${editAssetId}`,
        editForm
      );

      setAssets(prev =>
        prev.map(asset => asset._id === editAssetId ? res.data : asset)
      );

      setEditForm({
        assetName: "",
        description: "",
        category: "",
        status: "",
        assignedTo: "",
        assetImg: ""
      });
      setEditAssetId("");
      setShowEdit(false);
    } catch (err) {
      console.error(err.message);
    }
  };



  useEffect(() => {
    axios.get("http://localhost:5000/api/getallrequestasset")
      .then((res) => {
        console.log(res.data)
        setRequestasset(res.data)
      })
      .catch((err) => {
        console.log(err.message)
      })

  }, [])

  const handleStatusEdit = (id) => {
    setRequeststatusid(id)
    setRequeststatus("")
    setShowstatus(true)
  }



  const handleeditrequeststatus = () => {


    axios.put(`http://localhost:5000/api/updaterequeststatus/${requeststatusid}`, { status: requeststatus })
      .then((res) => {
        const updatedRequest = res.data;

       setRequestasset(prev =>
  prev.map(req =>
    req._id === updatedRequest._id
      ? { ...req, status: updatedRequest.status }
      : req
  )
)

        console.log(res.data)
        setShowstatus(false)
      })
      .catch((err) => console.log(err.message))


  }



  return (
    <>



      <div>
      <div className="ml-64 mt-10 px-4 overflow-x-auto font-sans">
  <table className="min-w-full border border-gray-200 rounded-md overflow-hidden text-sm shadow-sm">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
          Asset Request
        </th>
        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
          Requested By
        </th>
        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
          Status
        </th>
        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
          Action
        </th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100 bg-white">
      {requestasset.map((ele) => (
        <tr
          key={ele._id}
          className="hover:bg-gray-50 transition-colors"
        >
          <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">
            {ele.name}
          </td>

          <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
            {ele.requestedBy.name}
          </td>

          <td className="px-5 py-3 whitespace-nowrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                ele.status === "pending"
                  ? "bg-amber-100 text-amber-800"
                  : ele.status === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
            </span>
          </td>

          <td className="px-5 py-3">
            <button
              onClick={() => handleStatusEdit(ele._id)}
              className="inline-flex items-center px-4 py-1.5 rounded-md 
                         bg-gray-900 text-white text-xs font-medium
                         hover:bg-gray-800 transition"
            >
              Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {showstatus && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-96 rounded-md bg-white border border-gray-200 shadow-xl p-6 font-sans">
      
      <h2 className="mb-1 text-lg font-serif font-semibold text-gray-900">
        Admin Action Required
      </h2>

      <p className="mb-5 text-sm text-gray-600">
        Review and update the status of this request.
      </p>

      <select
        value={requeststatus}
        onChange={(e) => setRequeststatus(e.target.value)}
        className="mb-6 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
      >
        <option value="" disabled>
          Select status
        </option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowstatus(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 
                     border border-gray-300 rounded-md
                     hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleeditrequeststatus}
          className="px-4 py-2 text-sm font-medium text-white 
                     bg-gray-900 rounded-md
                     hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}




{showEdit && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <form
      onSubmit={handleEditSubmit}
      className="relative w-[420px] max-w-[92%] bg-white border border-gray-200 shadow-xl rounded-md p-6 space-y-4 font-sans"
    >
      <button
        type="button"
        onClick={() => setShowEdit(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition text-lg"
      >
        ✕
      </button>
      <h2 className="text-lg font-serif font-semibold text-gray-900 border-b border-gray-200 pb-2 text-center">
        Edit Asset Details
      </h2>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Asset Name
        </label>
        <input
          type="text"
          name="assetName"
          value={editForm.assetName}
          onChange={(e) =>
            setEditForm({ ...editForm, assetName: e.target.value })
          }
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm
                     focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows="2"
          value={editForm.description}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm resize-none
                     focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Category
        </label>
        <select
          name="category"
          value={editForm.category}
          onChange={(e) =>
            setEditForm({ ...editForm, category: e.target.value })
          }
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          required
        >
          {editForm.category && (
            <option value={editForm.category} disabled>
              {editForm.category.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
            </option>
          )}
          <option value="office_equipment">Office Equipment</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Status
        </label>
        <select
          name="status"
          value={editForm.status}
          onChange={(e) => {
            const newStatus = e.target.value;
            setEditForm((prev) => ({
              ...prev,
              status: newStatus,
              assignedTo: newStatus === "unassigned" ? "" : prev.assignedTo,
            }));

            if (newStatus === "assigned" && !editForm.assignedTo) {
              setSelectedassetid(editAssetId);
              setShowassign(true);
            }
          }}
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          required
        >
          <option value="">Select status</option>
          <option value="unassigned">Unassigned</option>
          <option value="assigned">Assigned</option>
          <option value="undermaintenance">Under Maintenance</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Assigned To
        </label>
        <input
          type="text"
          name="assignedTo"
          value={editForm.assignedTo}
          onChange={(e) =>
            setEditForm({ ...editForm, assignedTo: e.target.value })
          }
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm
                     focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Asset Image URL
        </label>
        <input
          type="text"
          name="assetImg"
          value={editForm.assetImg}
          onChange={(e) =>
            setEditForm({ ...editForm, assetImg: e.target.value })
          }
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm
                     focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-sm
                     hover:bg-gray-800 transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
)}


  {showassign && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
    <div className="relative w-[420px] max-w-[92%] bg-white border border-slate-200 shadow-2xl rounded-md p-6 font-sans animate-fadeIn">

      <button
        onClick={() => {
          setShowassign(false);
          if (original_asset) {
            setAssets(prev =>
              prev.map(a => a._id === original_asset._id ? original_asset : a)
            );
          }
          setAssignuser("");
          setSelectedassetid("");
          set_original_asset(null);
        }}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition text-lg"
      >
        ✕
      </button>

      <h2 className="text-lg font-serif font-semibold text-slate-900">
        Assign Asset
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-5">
        Select a user to assign this asset
      </p>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          User
        </label>
        <select
          value={assignuser}
          onChange={(e) => setAssignuser(e.target.value)}
          className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm text-slate-700 bg-white
                     focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="" disabled>
            Select user
          </option>
          {user.map(ele => (
            <option key={ele._id} value={ele._id}>
              {ele.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowassign(false);
            if (original_asset) {
              setAssets(prev =>
                prev.map(a => a._id === original_asset._id ? original_asset : a)
              );
            }
            setAssignuser("");
            setSelectedassetid("");
            set_original_asset(null);
          }}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200
                     rounded-sm hover:bg-slate-200 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleAssignTo}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600
                     rounded-sm hover:bg-indigo-700 transition shadow-sm"
        >
          Assign Asset
        </button>
      </div>
    </div>
  </div>
)}


      <div className="ml-64 px-8 pt-8 pb-4">
  <h1 className="text-2xl font-serif font-semibold text-gray-900 border-b border-gray-200 inline-block pb-1">
    All Assets
  </h1>
</div>


      <div className="ml-64 mt-8 flex flex-wrap items-center gap-4 font-sans">

  <div className="relative">
    <input
      value={txt}
      onChange={(e) => setTxt(e.target.value)}
      type="text"
      placeholder="Search assets"
      className="h-11 w-72 rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
    />
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 text-base">
      <BsSearch />
    </span>
  </div>

  <button
    onClick={handleSearch}
    className="h-11 px-5 rounded-md bg-blue-600 text-white text-sm font-medium shadow-sm
               hover:bg-blue-700 transition"
  >
    Search
  </button>

  <div className="relative">
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="h-11 w-60 rounded-md border border-gray-300 bg-white px-4 pr-10 text-sm text-gray-800 shadow-sm
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition"
    >
      <option value="all">All Assets</option>
      <option value="assigned">Assigned</option>
      <option value="unassigned">Unassigned</option>
      <option value="undermaintenance">Under Maintenance</option>
    </select>

   
  </div>
</div>





        <div className="flex flex-wrap gap-4 justify-start p-4 ml-64">
          {filtereddata.length > 0 ? filtereddata.reverse().map(asset => (
            <div key={asset._id} className="bg-gray-50 border border-gray-200 shadow-sm rounded-lg overflow-hidden w-52 hover:shadow-lg transition-shadow duration-200 flex flex-col">
              <img src={asset.assetImg} alt={asset.assetName} className="w-full p-3 h-40 object-cover" />
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-1">{asset.assetName}</h3>
                  <p className="text-gray-600 text-xs mb-0.5"><strong>Category:</strong> {asset.category}</p>
                  <p className="text-gray-600 text-xs mb-0.5 line-clamp-3"><strong>Description:</strong> {asset.description}</p>
                  <p className="text-gray-600 text-xs mb-0.5"><strong>Status:</strong> <span className={asset.status === "unassigned" ? "text-green-600 font-medium" : asset.status === "assigned" ? "text-blue-600 font-medium" : "text-red-600 font-medium"}>{asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}</span></p>
                  <p className="text-gray-600 text-xs mb-0.5"><strong>Assigned To:</strong> {asset.assignedTo ? asset.assignedTo.name : "Not assigned"}</p>
                  <p className="text-gray-500 text-[10px]"><strong>Created At:</strong> {new Date(asset.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  {asset.status !== "undermaintenance" && asset.status !== "assigned" && (
                    <button onClick={() => handleAssign(asset._id)} className="flex-1 text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700">Assign</button>
                  )}
                  <button onClick={() => handleEdit(asset)} className="flex-1 text-xs bg-gray-600 text-white py-1.5 rounded hover:bg-gray-700">Edit</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="w-full text-center mt-16">
              <p className="text-lg text-gray-500 font-medium">No assets found</p>
              <p className="text-sm text-gray-400 mt-1">Try searching with a different name</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
