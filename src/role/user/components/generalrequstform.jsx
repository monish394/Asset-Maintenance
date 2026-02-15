import { memo } from "react";

const GeneralRequestForm = memo(({ show, value, onChange, onClose, onSubmit }) => {
  if (!show) return null; 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Raise General Request</h2>

        <form onSubmit={onSubmit}>
          <label className="block mb-2 font-medium text-gray-700">Issue Description</label>
          <textarea
            className="w-full border border-gray-300 rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Describe the issue..."
            value={value}
            onChange={onChange}
            required
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default GeneralRequestForm;
