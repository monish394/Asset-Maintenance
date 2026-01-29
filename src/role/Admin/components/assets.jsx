import { useEffect, useState } from "react";
import axios from "axios";

export default function Assets() {
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

  const filtereddata = assets.filter(i =>
    i.assetName.toLowerCase().includes(btnsearch.toLowerCase())
  );

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
      { userid: assignuser }
    );

    setAssets(prev =>
      prev.map(asset =>
        asset._id === selectedassetid ? res.data : asset
      )
    );

    if (editAssetId === selectedassetid) {
      setEditForm(prev => ({
        ...prev,
        assignedTo: assignuser,  
        status: "assigned"       
            }));
    }

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

  return (
    <>
      <div>
        {showEdit && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
            <form
              onSubmit={handleEditSubmit}
              className="relative w-[400px] max-w-[90%] bg-white shadow-lg rounded-xl p-6 space-y-3"
            >
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition text-xl font-bold"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-3 text-center">
                Edit Asset
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  name="assetName"
                  value={editForm.assetName}
                  onChange={(e) => setEditForm({ ...editForm, assetName: e.target.value })}
                  placeholder="Enter asset name"
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="2"
                  placeholder="Enter asset description"
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                >
                  {editForm.category && (
                    <option value={editForm.category} disabled>
                      {editForm.category.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  )}
                  <option value="office_equipment">Office Equipment</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
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
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                >
                  <option value="">Select status</option>
                  <option value="unassigned">Unassigned</option>
                  <option value="assigned">Assigned</option>
                  <option value="undermaintenance">Under Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  value={editForm.assignedTo}
                  onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                  placeholder="Enter user or leave blank"
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Asset Image URL</label>
                <input
                  type="text"
                  name="assetImg"
                  value={editForm.assetImg}
                  onChange={(e) => setEditForm({ ...editForm, assetImg: e.target.value })}
                  placeholder="Paste image URL"
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>

              <div className="flex justify-end gap-2 mt-3">
                {/* <button
                  type="reset"
                  onClick={() => setEditForm({
                    assetName: "",
                    description: "",
                    category: "",
                    status: "",
                    assignedTo: "",
                    assetImg: ""
                  })}
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Reset
                </button> */}
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {showassign && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[400px] max-w-[90%] p-6 font-semibold relative animate-fadeIn">
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
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Assign Asset</h2>
              <p className="text-sm text-gray-500 mb-5">Select a User from the list to assign this Asset</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">User's</label>
                <select
                  value={assignuser}
                  onChange={(e) => setAssignuser(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                >
                  <option value="" disabled>Select User</option>
                  {user.map(ele => (
                    <option key={ele._id} value={ele._id}>{ele.name}</option>
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
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-8 ml-64">
          <h1 className="text-2xl"><u>Assets Page</u></h1>
        </div>

        <div className="flex items-center ml-64 mt-4">
          <input
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            type="text"
            placeholder="Search"
            className="h-12 w-72 rounded-lg border border-gray-300 bg-white px-4 text-xl text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
          <button onClick={handleSearch} className="ml-3 h-12 px-6 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            Search
          </button>
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
