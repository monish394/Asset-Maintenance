
import axios from "axios";
import { useState } from "react";

const RequestAssetForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Electronics");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, category);
    axios.post("http://localhost:5000/api/requestasset",{name,category},{
        headers:{
            Authorization:localStorage.getItem("token")
        }
    })
    .then((res)=>{
        console.log(res.data)
        setName("")
        setCategory("")
    })
    .catch((err)=>console.log(err.message))
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Asset Name"
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Other">Other</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};

export default RequestAssetForm;
