import { useEffect, useState } from "react"
import axios from "axios"
export default function Assets() {
  const[user,setUser]=useState([])
  const [assets, setAssets] = useState([])
  const [txt,setTxt]=useState("")
  const [btnsearch,setBtnsearch]=useState("")
  const [showassign,setShowassign]=useState(false)
  const [assignuser,setAssignuser]=useState("")
  const [selectedassetid,setSelectedassetid]=useState("")
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/assets")
      .then((res) => {
        setAssets(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
   useEffect(() => {
    axios
      .get("http://localhost:5000/api/findusers")
      .then((res) => {
        console.log(res.data)
        setUser(res.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [])
  const filtereddata=assets.filter((i)=>{
    return i.assetName.toLowerCase().includes(btnsearch.toLowerCase())
  })

  const handleSearch=()=>{
    setBtnsearch(txt)
   
  }
  
  const handleAssign=(assertid)=>{
    setSelectedassetid(assertid)
    console.log("assetid -",assertid)
    setShowassign(true)
    


    console.log("handleAssign clicked")
  }
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
    setShowassign(false);
    setAssignuser("");
    setSelectedassetid("");

  } catch (err) {
    console.error(err.message);
  }
};


  return (
    <>
      <div>
{showassign && (
  <div className="backdrop-blur-sm fixed z-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-gray-100 bg-opacity-95 p-6 rounded-lg shadow-lg font-semibold">
    <h2 className="text-xl mb-4 text-gray-700">Assign To</h2>

    <div className="mb-4">
     <select
  value={assignuser}
  onChange={(e) => setAssignuser(e.target.value)}
  className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
>
  <option value="" disabled>
    Select User
  </option>

  {user.map((ele) => (
    <option  key={ele._id} value={ele._id}>
      <b style={{color:"black"}}>{ele.name}</b>
    </option>
  ))}
</select>

    </div>

    <div className="flex gap-2">
      <button  onClick={handleAssignTo} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Assign
      </button>
      <button
        onClick={() => setShowassign(false)}
        className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
      >
        Cancel
      </button>
    </div>
  </div>
)}



        <div className="p-8  ml-64">
          <h1 className="text-2xl"><u>Assets Page </u></h1>
        </div>
 <div className="flex items-center ml-64 mt-4">
  <input 
    value={txt}
    onChange={(e) => setTxt(e.target.value)}
    type="text"
    placeholder="Search "
    className="h-12 w-72 rounded-lg border border-gray-300 bg-white px-4 text-xl text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
  />

  <button onClick={handleSearch} className="ml-3 h-12 px-6 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
    Search
  </button>
</div>

        <div className="flex flex-wrap gap-4 justify-start p-4 ml-64">
 {filtereddata.length > 0 ? (
  filtereddata.map((asset) => (
    <div
      key={asset._id}
      className="bg-gray-50 border border-gray-200 shadow-sm rounded-lg overflow-hidden w-52 hover:shadow-lg transition-shadow duration-200"
    >
      <img
        src={asset.assetImg}
        alt={asset.assetName}
        className="w-full p-3 h-40 object-cover"
      />

      <div className="p-3">
        <h3 className="text-sm font-semibold mb-1">{asset.assetName}</h3>

        <p className="text-gray-600 text-xs mb-0.5">
          <strong>Category:</strong> {asset.category}
        </p>

        <p className="text-gray-600 text-xs mb-0.5">
          <strong>Description:</strong> {asset.description}
        </p>

        <p className="text-gray-600 text-xs mb-0.5">
          <strong>Status:</strong>{" "}
          <span
            className={
              asset.status === "unassigned"
                ? "text-green-600 font-medium"
                : asset.status === "assigned"
                ? "text-blue-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
          </span>
        </p>

        <p className="text-gray-600 text-xs mb-0.5">
          <strong>Assigned To:</strong>{" "}
          {asset.assignedTo ? asset.assignedTo.name : "Not assigned"}
        </p>

        <p className="text-gray-500 text-[10px]">
          <strong>Created At:</strong> {new Date(asset.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2 p-3 pt-0">
        <button
          onClick={() => handleAssign(asset._id)}
          className="flex-1 text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700"
        >
          Assign
        </button>

        <button className="flex-1 text-xs bg-gray-600 text-white py-1.5 rounded hover:bg-gray-700">
          Edit
        </button>
      </div>
    </div>
  ))
) : (
  <div className="w-full text-center mt-16">
    <p className="text-lg text-gray-500 font-medium">No assets found</p>
    <p className="text-sm text-gray-400 mt-1">Try searching with a different name</p>
  </div>
)}

</div>


      </div>
    </>
  )
}
