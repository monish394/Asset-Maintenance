import { useEffect, useState } from "react";
import axios from "../../../config/api";
import { motion } from "framer-motion";

import { BsSearch } from "react-icons/bs";
import { MdAddBox } from "react-icons/md";

export default function Assets() {
  const [statusFilter, setStatusFilter] = useState("all");

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

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [addForm, setAddForm] = useState({
    assetName: "",
    description: "",
    category: "office_equipment",
  });
  const [addImageFile, setAddImageFile] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("/assets")
      .then(res => {
        setAssets(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get("/findusers")
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAddImageFile(file);
    setAddImagePreview(URL.createObjectURL(file));
    setAddError("");
  };

  const handleAddAssetSubmit = async (e) => {
    e.preventDefault();
    if (!addImageFile) {
      setAddError("Please select an image for the asset.");
      return;
    }
    setAddLoading(true);
    setAddError("");
    try {
      const formData = new FormData();
      formData.append("image", addImageFile);
      const uploadRes = await axios.post("/assets/upload-image", formData);
      const imageUrl = uploadRes.data.imageUrl;

      const assetRes = await axios.post("/assets", {
        ...addForm,
        assetImg: imageUrl,
        status: "unassigned",
      });

      setAssets((prev) => [assetRes.data, ...prev]);
      setShowAddAsset(false);
      setAddForm({ assetName: "", description: "", category: "office_equipment" });
      setAddImageFile(null);
      setAddImagePreview("");
    } catch (err) {
      console.error(err);
      setAddError(err.response?.data?.err || "Failed to create asset. Try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteClick = (asset) => {
    setAssetToDelete(asset);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/assets/${assetToDelete._id}`);
      setAssets((prev) => prev.filter((a) => a._id !== assetToDelete._id));
      setShowDeleteConfirm(false);
      setAssetToDelete(null);
    } catch (err) {
      console.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post("/assets/upload-image", formData);
      setEditForm((prev) => ({ ...prev, assetImg: res.data.imageUrl }));
    } catch (err) {
      console.error("Edit image upload failed:", err.message);
    } finally {
      setEditImageUploading(false);
    }
  };

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
        `/assets/${selectedassetid}`,
        { userid: assignuser }
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
        `/editassert/${editAssetId}`,
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
  }


  return (
    <>



      <div>
        <div className="mt-4 px-4 md:px-6 font-[Inter]">
        </div>






        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <form
              onSubmit={handleEditSubmit}
              className="relative w-[520px] max-w-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden font-sans"
            >
              <div className="bg-gradient-to-r from-slate-800 to-slate-600 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-white text-lg font-bold tracking-tight">Edit Asset</h2>
                  <p className="text-slate-300 text-xs mt-0.5">Update asset information below</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

                {editForm.assetImg && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="h-14 w-14 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                      <img src={editForm.assetImg} alt="Asset" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Current Image</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[300px]">{editForm.assetImg}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">

                  <div className="col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" /></svg>
                      Asset Name
                    </label>
                    <input
                      type="text"
                      value={editForm.assetName}
                      onChange={(e) => setEditForm({ ...editForm, assetName: e.target.value })}
                      placeholder="Enter asset name"
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400
                                 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white text-slate-800
                                 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition cursor-pointer"
                      required
                    >
                      <option value="office_equipment">Office Equipment</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Status
                    </label>
                    <select
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
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white text-slate-800
                                 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition cursor-pointer"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="unassigned">🟢 Unassigned</option>
                      <option value="assigned">🔵 Assigned</option>
                      <option value="undermaintenance">🔴 Under Maintenance</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Describe the asset..."
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 resize-none
                                 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Replace Asset Image
                    </label>

                    <label
                      htmlFor="edit-asset-img-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300
                                 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition overflow-hidden"
                    >
                      {editImageUploading ? (
                        <div className="flex flex-col items-center text-slate-500">
                          <span className="animate-spin inline-block w-6 h-6 border-2 border-slate-500 border-t-transparent rounded-full mb-2"></span>
                          <span className="text-xs font-medium">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-500">
                          <span className="text-2xl mt-1">🖼️</span>
                          <span className="text-xs mt-1 font-medium">Click to upload new image</span>
                          <span className="text-[10px] text-slate-400">Replaces current image</span>
                        </div>
                      )}
                    </label>
                    <input
                      id="edit-asset-img-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleEditImageChange}
                      disabled={editImageUploading}
                    />
                  </div>

                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
                <p className="text-xs text-slate-400">Fields marked with <span className="text-red-400">*</span> are required</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition shadow-sm flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Save Changes
                  </button>
                </div>
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


        <div className="px-4 md:px-8 pt-6 pb-4">
          <h1 className="text-2xl font-serif font-semibold text-gray-900 border-b border-gray-200 inline-block pb-1">
            All Assets
          </h1>
        </div>


        <div className="mt-4 flex flex-wrap items-center gap-4 px-4 font-sans">

          <div className="relative">
            <input
              value={txt}
              onChange={(e) => {
                setTxt(e.target.value);
                if (e.target.value.length === 0) {
                  setBtnsearch("");
                }
              }}
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

          <button
            onClick={() => { setShowAddAsset(true); setAddError(""); }}
            className="h-11 px-5 rounded-md bg-emerald-600 text-white text-sm font-medium shadow-sm
               hover:bg-emerald-700 transition flex items-center gap-2"
          >
            <MdAddBox className="text-base" />
            Add Asset
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





        <div className="flex flex-wrap gap-5 justify-center p-4 mt-6">
          {loading ? (
            <div className="w-full h-80 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading assets...</p>
            </div>
          ) : filtereddata.length > 0 ?
            filtereddata.reverse().map((ele, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.01 }}
                className="bg-gray-50 border border-gray-200 shadow-sm rounded-lg overflow-hidden w-52 hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <div className="overflow-hidden">
                  <img
                    src={ele.assetImg}
                    alt={ele.assetName}
                    className="w-full p-3 h-40 object-cover transition-transform duration-300 hover:scale-95 cursor-pointer"
                  />
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">{ele.assetName}</h3>
                    <p className="text-gray-600 text-xs mb-0.5"><strong>Category:</strong> {ele.category}</p>
                    <p className="text-gray-600 text-xs mb-0.5 line-clamp-3"><strong>Description:</strong> {ele.description}</p>
                    <p className="text-gray-600 text-xs mb-0.5"><strong>Status:</strong> <span className={ele.status === "unassigned" ? "text-green-600 font-medium" : ele.status === "assigned" ? "text-blue-600 font-medium" : "text-red-600 font-medium"}>{ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}</span></p>
                    <p className="text-gray-600 text-xs mb-0.5"><strong>Assigned To:</strong> {ele.assignedTo ? ele.assignedTo.name : "Not assigned"}</p>
                    <p className="text-gray-500 text-[10px]"><strong>Created At:</strong> {new Date(ele.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {ele.status !== "undermaintenance" && ele.status !== "assigned" && (
                      <button onClick={() => handleAssign(ele._id)} className="flex-1 text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700">Assign</button>
                    )}
                    <button onClick={() => handleEdit(ele)} className="flex-1 text-xs bg-gray-600 text-white py-1.5 rounded hover:bg-gray-700">Edit</button>
                    <button
                      onClick={() => handleDeleteClick(ele)}
                      className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="w-full text-center mt-16">
                <p className="text-lg text-gray-500 font-medium">No assets found</p>
                <p className="text-sm text-gray-400 mt-1">Try searching with a different name</p>
              </div>
            )}
        </div>

        {showAddAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              onSubmit={handleAddAssetSubmit}
              className="relative w-[440px] max-w-[94%] bg-white border border-gray-200 shadow-2xl rounded-xl p-7 space-y-4 font-sans"
            >
              <button
                type="button"
                onClick={() => { setShowAddAsset(false); setAddImagePreview(""); setAddImageFile(null); }}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl transition"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 text-center tracking-tight">
                ➕ Add New Asset
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={addForm.assetName}
                  onChange={(e) => setAddForm({ ...addForm, assetName: e.target.value })}
                  placeholder="e.g. Dell Laptop"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  rows="2"
                  required
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  placeholder="Brief description of the asset"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                >
                  <option value="office_equipment">Office Equipment</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Asset Image</label>
                <label
                  htmlFor="asset-img-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-emerald-400
                     rounded-xl cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition overflow-hidden"
                >
                  {addImagePreview ? (
                    <img
                      src={addImagePreview}
                      alt="preview"
                      className="max-h-full max-w-full object-contain p-1"
                      style={{ maxHeight: '156px' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-emerald-600">
                      <span className="text-3xl">🖼️</span>
                      <span className="text-xs mt-1 font-medium">Click to upload image</span>
                      <span className="text-[10px] text-emerald-400">JPG, PNG, WEBP · max 5 MB</span>
                    </div>
                  )}
                </label>
                <input
                  id="asset-img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {addError && (
                <p className="text-xs text-red-600 font-medium">{addError}</p>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowAddAsset(false); setAddImagePreview(""); setAddImageFile(null); }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg
                     hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {addLoading ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Uploading...</>
                  ) : (
                    "Create Asset"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {showDeleteConfirm && assetToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-[400px] max-w-[92%] bg-white border border-gray-200 shadow-2xl rounded-xl p-7 font-sans">

              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
                <span className="text-2xl">🗑️</span>
              </div>

              <h2 className="text-center text-lg font-semibold text-gray-900 mb-1">
                Delete Asset?
              </h2>
              <p className="text-center text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">&ldquo;{assetToDelete.assetName}&rdquo;</span>?
                <br />
                <span className="text-red-500 text-xs">This action cannot be undone.</span>
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setAssetToDelete(null); }}
                  disabled={deleteLoading}
                  className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-60 flex items-center gap-2"
                >
                  {deleteLoading ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Deleting...</>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}



      </div>
    </>
  );
}
