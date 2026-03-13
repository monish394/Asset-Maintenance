import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

function RaiseRequestForm({ assets, onSubmit, onCancel, initialDescription = "" }) {
  const [assetid, setAssetid] = useState("");
  const [description, setDescription] = useState(initialDescription);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!assetid || !description.trim()) return;
    setIsSubmitting(true);
    await onSubmit(assetid, description, imageFile);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setAssetid("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCancel}
        className="absolute inset-0 bg-black/40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-[440px] md:w-[500px] rounded-2xl shadow-xl p-6 md:p-8 font-sans"
      >
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
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition disabled:opacity-50"
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
            disabled={isSubmitting}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none transition disabled:opacity-50"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Fault Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 transition"
          />
          {imagePreview && (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <img
                src={imagePreview}
                alt="Fault preview"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !assetid || !description.trim()}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
            )}
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(RaiseRequestForm);
