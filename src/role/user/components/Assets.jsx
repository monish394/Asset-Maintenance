import { useState, useEffect } from "react";
import axios from "../../../config/api";
import { motion } from "framer-motion";
console.log(motion)
import { BsSearch } from "react-icons/bs";
import { useUserAsset } from "../context/userassetprovider";

export default function PickAssets() {
  const [assets, setAssets] = useState([]);

  const {  setMyasset } = useUserAsset();
  const [categoryFilter, setCategoryFilter] = useState("");
const categories = [...new Set(assets.map((a) => a.category))];

  const [txt, setTxt] = useState("");
  const [btnsearch, setBtnsearch] = useState("");
 
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    axios
      .get("/assets")
      .then((res) => setAssets(res.data))
      .catch((err) => console.log(err));
  }, []);
  console.log(assets)

  const unassignedAssets = assets.filter((ele) => ele.status !== "undermaintenance");

const filteredData = unassignedAssets.filter((ele) => {
  const matchesName = ele.assetName.toLowerCase().includes(btnsearch.toLowerCase());
  const matchesCategory = categoryFilter ? ele.category === categoryFilter : true;
  return matchesName && matchesCategory;
});


  const handleSearch = () => setBtnsearch(txt);

  const handleConfirmPickup = async () => {
    if (!selectedAsset) return;

    try {
      const res = await axios.put(
        `/user/assign-asset/${selectedAsset._id}`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      setMyasset((prev) => [...prev, res.data.asset]);
      setAssets((prev) => prev.filter((a) => a._id !== selectedAsset._id));
      setShowConfirm(false);
      setSelectedAsset(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.err || "Failed to pick asset");
    }
  };

  return (
  <div>
  {showConfirm && selectedAsset && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowConfirm(false)}
      />
      <div className="relative bg-white rounded-xl p-6 shadow-2xl w-80">
        <h3 className="text-lg font-semibold mb-4">Confirm Pickup</h3>
        <p className="mb-6">
          Are you sure you want to pick <strong>{selectedAsset.assetName}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowConfirm(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPickup}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Confirm Pickup
          </button>
        </div>
      </div>
    </div>
  )}


<div className="relative mt-10 flex flex-wrap items-center gap-4 ml-24 font-sans">
  <div className="relative w-full sm:w-auto">
    <input
      value={txt}
      onChange={(e) => setTxt(e.target.value)}
      type="text"
      placeholder="Search assets..."
      className="w-full sm:w-72 h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
    />
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
      <BsSearch />
    </span>
  </div>

  <button
    onClick={handleSearch}
    className="h-11 px-6 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
  >
    Search
  </button>
  <div className="relative w-full sm:w-auto">
  <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="w-full sm:w-72 h-11 pl-3 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
  >
    <option value="">All Categories</option>
    {categories.map((cat, idx) => (
      <option key={idx} value={cat}>{cat}</option>
    ))}
  </select>
</div>

</div>



 <div className="flex flex-wrap gap-4 justify-start p-4 ml-6 mt-20">
  {filteredData.length > 0 ? (
    filteredData.map((ele, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.01 }}
        className="bg-gray-50 border border-gray-200 shadow-sm rounded-lg overflow-hidden w-52 hover:shadow-lg transition-shadow duration-200 flex flex-col"
      >
        <div className="relative">
          <img
            src={ele.assetImg}
            alt={ele.assetName}
            className="w-full p-3 h-40 object-cover"
          />
          <span
            className={`absolute top-2 right-2 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              ele.status === "unassigned"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {ele.status === "unassigned" ? "Available" : "Not Available"}
          </span>
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-1">{ele.assetName}</h3>
            <p className="text-gray-600 text-xs mb-0.5">
              <strong>Category:</strong> {ele.category}
            </p>
            <p className="text-gray-600 text-xs mb-0.5 line-clamp-3">
              <strong>Description:</strong> {ele.description}
            </p>
            <p className="text-gray-600 text-xs mb-0.5">
              <strong>Status:</strong>{" "}
              <span
                className={
                  ele.status === "unassigned"
                    ? "text-green-600 font-medium"
                    : "text-blue-600 font-medium"
                }
              >
                {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
              </span>
            </p>
            {/* <p className="text-gray-600 text-xs mb-0.5">
              <strong>Assigned To:</strong>{" "}
              {ele.assignedTo ? ele.assignedTo.name : "Not assigned"}
            </p> */}
            <p className="text-gray-500 text-[10px]">
              <strong>Created At:</strong>{" "}
              {new Date(ele.createdAt).toLocaleDateString()}
            </p>
          </div>

          {ele.status === "unassigned" ? (
            <button
              onClick={() => {
                setSelectedAsset(ele);
                setShowConfirm(true);
              }}
              className="mt-2 bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700 transition"
            >
              Pick Asset
            </button>
          ) : (
            <button
              disabled
              className="mt-2 bg-gray-400 text-white px-1 py-1 rounded-lg cursor-not-allowed"
            >
              Not Available
            </button>
          )}
        </div>
      </motion.div>
    ))
  ) : (
    <div className="w-full text-center mt-16">
      <p className="text-lg text-gray-500 font-medium">No assets found</p>
      <p className="text-sm text-gray-400 mt-1">Try searching with a different name</p>
    </div>
  )}
</div>

</div>

  );
}
