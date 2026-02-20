import { memo, useState, useEffect } from "react";

function GeneralRequestForm({ show, onClose, onSubmit }) {
  const [issue, setIssue] = useState("");


  useEffect(() => {
    if (show) setIssue("");
  }, [show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(issue);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[440px] md:w-[500px] rounded-2xl shadow-xl p-6 md:p-8 font-sans"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          General Request
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Describe the general issue you're facing
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Description
          </label>
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Describe the issue..."
            rows={5}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none transition"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default memo(GeneralRequestForm);