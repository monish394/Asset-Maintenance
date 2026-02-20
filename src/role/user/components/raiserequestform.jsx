import { memo, useState } from "react";

function RaiseRequestForm({ assets, onSubmit, onCancel }) {
  const [assetid, setAssetid] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSubmit(assetid, description);
  };

  const handleCancel = () => {
    setAssetid("");
    setDescription("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[440px] md:w-[500px] rounded-2xl shadow-xl p-6 md:p-8 font-sans">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Raise New Request
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Describe the issue with the selected asset
        </p>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset
          </label>
          <select
            value={assetid}
            onChange={(e) => setAssetid(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
          >
            <option value="">Select Asset</option>
            {assets.map((ele) => (
              <option key={ele._id} value={ele._id}>
                {ele.assetName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem..."
            rows={5}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none transition"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-5 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(RaiseRequestForm);