import axios from "../../../config/api";
import { useState } from "react";

const RequestAssetForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Electronics");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "/requestasset",
      { name, category },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    onSuccess(res.data);
    setName("");
    setCategory("Electronics");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Asset Name"
        className="border rounded p-2"
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded p-2"
      >
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Other">Other</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default RequestAssetForm;
