import { useEffect, useState } from "react"
import { useUserAsset } from "../context/userassetprovider";
import { FcIdea } from "react-icons/fc";
import { FaLeaf, FaPlus } from "react-icons/fa6";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline ,Tooltip} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import RequestAssetForm from "./requestforasset";



import { useMap } from "react-leaflet";

function FitBounds({ origin, destination }) {
  const map = useMap();

  if (origin && destination) {
    const bounds = [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ];
    map.fitBounds(bounds, { padding: [50, 50] }); 
  }

  return null;
}
const getDistanceKm = (origin, destination) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371;
  const dLat = toRad(destination.lat - origin.lat);
  const dLon = toRad(destination.lng - origin.lng);

  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2);
};
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err)
    );
  });
};



export default function RaiseRequest() {
//nearby tech
const [showNearbyMap, setShowNearbyMap] = useState(false);
const [nearbyTechs, setNearbyTechs] = useState([]);
const [userCoords, setUserCoords] = useState(null);



const handleNearbyTechnician = async () => {
  try {
    const coords = await getUserLocation();
    setUserCoords(coords);

    const res = await axios.post(
      "http://localhost:5000/api/getnearbytechnician",
      {
        lat: coords.lat,
        lng: coords.lng,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    setNearbyTechs(res.data);
    setShowNearbyMap(true);
  } catch (err) {
    console.log(err.message);
  }
};



  ///////////////////////////
  const [showForm, setShowForm] = useState(false);
  const [usersrequestasset,setUsersrequestasset]=useState([])
  const [showgenralraiseform,setShowgenralraiseform]=useState(false)
  const [generalissue, setGeneralissue] = useState("");
  // const [name,setName]=useState("")
  // const [category,setCategory]=useState("Electronics")
    const [assetid,setAssetid]=useState("")
    const [trackingCoords, setTrackingCoords] = useState(null); 
    const [showMap, setShowMap] = useState(false)
    
    console.log(assetid)
    const [assetdescription,setAssetdescription]=useState("")

    const { myasset,myraiserequest,setMyraiserequest,userinfo,usergeneralrequest,setUsergeneralrequest } = useUserAsset();
    console.log(usergeneralrequest)


    console.log(myraiserequest)
    console.log("User assets raise request page:", myasset);
    console.log("my raise request -",myraiserequest)
    const [showform, setShowform] = useState(false)

    const handleShowform = () => {
        setShowform(!showform)
    }
    const handleCancel=()=>{
        setAssetid("")
        setAssetdescription("")
        handleShowform()

    }



   const handleSubmit = async () => {
  if (!assetid ) {
    
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/raiserequest",
      { assetid, description: assetdescription },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const selectedAsset = myasset.find(a => a._id === assetid)
    const newRequest = {
      ...res.data,
      assetid: {
        _id: assetid,
        assetName: selectedAsset?.assetName,
      },
    };

    setMyraiserequest([newRequest,...myraiserequest ]);

    setAssetid("");
    setAssetdescription("");
    handleShowform();

  } catch (err) {
    console.log(err.message);
  }
};

const getLatLng = async (address) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    } else {
      return null;
    }
  } catch (err) {
    console.log("Geocoding error:", err);
    return null;
  }
};






const handleTrack = async (ele) => {
  const userCoords = await getLatLng(userinfo.address);
  const techCoords = await getLatLng(ele.assignedto.address);

  if (!userCoords || !techCoords) {
    alert("Unable to get coordinates for route");
    return;
  }

  setTrackingCoords({ origin: userCoords, destination: techCoords });
  setShowMap(true);
};


const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});


const techIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});


// const handleRequestAsset = (e) => {
//   e.preventDefault();
//   onsubmit(name,category)
//   console.log("Request Asset:", name, category);

// };
useEffect(()=>{
  axios.get("http://localhost:5000/api/getusersrequest",{
    headers:{
    Authorization:localStorage.getItem("token")
    }
  })
  .then((res)=>{
    console.log(res.data)
    setUsersrequestasset(res.data)
  })
  .catch((err)=>console.log(err.message))

},[])


const handleGeneralRequestSubmit = (e) => {
  e.preventDefault();

  axios
    .post(
      "http://localhost:5000/api/generalraiserequest",
      { issue: generalissue },
      { headers: { Authorization: localStorage.getItem("token")} }
    )
    .then((res) => {
      setUsergeneralrequest((prev) => [res.data, ...prev]);
      setGeneralissue("");
      setShowgenralraiseform(false);
    })
    .catch((err) => {
      console.log(err.message);
    });
};





    return (
        <div>
{showgenralraiseform && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    
    {/* Modal Box */}
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
      
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Raise General Request
      </h2>

      <form onSubmit={handleGeneralRequestSubmit}>
        <label className="block mb-2 font-medium text-gray-700">
          Issue Description
        </label>

        <textarea
          className="w-full border border-gray-300 rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Describe the issue..."
          value={generalissue}
          onChange={(e) => setGeneralissue(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowgenralraiseform(false)}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}




          
            <div>
            </div>
            <div>
      

{showMap && trackingCoords && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-[600px] h-[450px] rounded-xl shadow-lg relative overflow-hidden">

      {/* Close button */}
      <button
        className="absolute top-3 right-3 z-[9999] text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-red-600 transition"
        onClick={() => setShowMap(false)}
      >
        ✕
      </button>

      {/* Distance display */}
      <div className="absolute top-3 left-3 z-[9999] bg-white px-3 py-1 rounded-lg shadow-md font-medium text-gray-800">
        Distance: {getDistanceKm(trackingCoords.origin, trackingCoords.destination)} km
      </div>

      {/* Map */}
      <MapContainer
        center={[trackingCoords.origin.lat, trackingCoords.origin.lng]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User marker with tooltip */}
        <Marker
          position={[trackingCoords.origin.lat, trackingCoords.origin.lng]}
          icon={userIcon}
        >
          <Tooltip
            permanent
            direction="top"
            offset={[0, -20]} // move tooltip above marker
            className="font-semibold bg-white px-2 py-1 rounded shadow"
          >
            Your Location
          </Tooltip>
        </Marker>

        {/* Technician marker with tooltip */}
        <Marker
          position={[trackingCoords.destination.lat, trackingCoords.destination.lng]}
          icon={techIcon}
        >
          <Tooltip
            permanent
            direction="top"
            offset={[0, -20]} // move tooltip above marker
            className="font-semibold bg-white px-2 py-1 rounded shadow"
          >
            Technician
          </Tooltip>
        </Marker>

        {/* Line between them */}
        <Polyline
          positions={[
            [trackingCoords.origin.lat, trackingCoords.origin.lng],
            [trackingCoords.destination.lat, trackingCoords.destination.lng],
          ]}
          color="blue"
        />

        {/* Fit map to show both points */}
        <FitBounds origin={trackingCoords.origin} destination={trackingCoords.destination} />
      </MapContainer>
    </div>
  </div>
)}
{showNearbyMap && userCoords && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="relative bg-white w-full max-w-[700px] h-[500px] rounded-xl shadow-lg">

      {/* Close Button */}
      <button
        onClick={() => setShowNearbyMap(false)}
        className="absolute top-3 right-3 z-[1000] bg-white px-3 py-1 rounded-full shadow text-lg font-bold"
      >
        ✕
      </button>

      <MapContainer
        center={[userCoords.lat, userCoords.lng]}
        zoom={13}
        className="w-full h-full rounded-xl"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User Marker */}
        <Marker position={[userCoords.lat, userCoords.lng]}>
          <Tooltip permanent direction="bottom">
            You
          </Tooltip>
        </Marker>

        {/* Technician Markers with Labels */}
        {nearbyTechs.map((tech) => {
          const lat = tech.location.coordinates[1];
          const lng = tech.location.coordinates[0];

          return (
            <Marker key={tech._id} position={[lat, lng]}>
              <Tooltip
                permanent
                direction="top"
                offset={[0, -10]}
                className="font-semibold text-blue-700"
              >
                {tech.name}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  </div>
)}












            </div>
            {showform && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-[420px] rounded-xl shadow-lg p-6">

                    <h1 className="text-xl font-semibold text-gray-800 mb-1">
                        Raise New Request
                    </h1>
                    <p className="text-sm text-gray-500 mb-4">
                        Describe the issue with the selected asset
                    </p>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asset
                        </label>
                        <select value={assetid}  onChange={e=>setAssetid(e.target.value)} className="border rounded-lg" >
                            <option  value="">Select Asset</option>
                            {
                                myasset.map((ele,i)=>{
                                    return <option className="text-black bg-grey-600" key={i} value={ele._id}>{ele.assetName}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Description
                        </label>
                        <textarea value={assetdescription} onChange={e=>setAssetdescription(e.target.value)}
                            placeholder="Describe the problem..."
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={handleCancel}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300
                   text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600
                   text-white hover:bg-blue-700 transition"
                        >
                            Submit
                        </button>
                    </div>

                </div>
            </div>}

  <div className="bg-white shadow-lg rounded-lg p-6 w-full">
   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <h1 className="text-3xl font-bold text-gray-800">
    My Service Requests
  </h1>

  <button
    onClick={handleShowform}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg 
               hover:bg-blue-700 active:scale-95 transition-all shadow-md sm:self-auto self-end"
  >
    <FaPlus />
    Raise Request
  </button>
</div>


   <div className="overflow-x-auto">
<table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden shadow-sm">
  <thead className="bg-gray-200">
    <tr>
      <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase">Asset Name</th>
      <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase">Issue Description</th>
      <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase">Status</th>
      <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase">Technician</th>
    </tr>
  </thead>

  <tbody>
    {myraiserequest.reverse().map((ele, i) => (
      <tr
        key={i}
        className={`border-t border-gray-200 hover:bg-gray-50 ${
          i % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}
      >
        <td className="px-4 py-3 text-gray-900 font-medium">
          {typeof ele.assetid === "object" ? ele.assetid.assetName : "Loading..."}
        </td>

        <td className="px-4 py-3 text-gray-700">
          <div className="mb-2">{ele.description}</div>

          {ele.aiResponse && (
            <div className="mt-2 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow-sm text-gray-800 text-sm leading-relaxed transition-transform transform hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-lg"><FcIdea /></span>
                <span className="font-semibold text-gray-900">AI Suggestion about the Issue:</span>
              </div>

              <div style={{fontFamily:"calibri ",fontSize:"15px"}}
                className="whitespace-pre-wrap mb-2"
                dangerouslySetInnerHTML={{
                  __html: ele.aiResponse
                    .replace(/`([^`]+)`/g, `<span class="bg-gray-200 px-1 rounded text-gray-800 font-mono">$1</span>`)
                    .replace(/\b(Correct|Incorrect|High|Medium|Low)\b/g, `<span class="font-semibold text-blue-700">$1</span>`)
                }}
              />


              </div>
          )}
        </td>

        <td className="px-4 py-3 text-gray-700">
          <span
            className={`font-medium whitespace-nowrap px-3 py-1 rounded-full ${
              ele.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : ele.status === "assigned"
                ? "bg-blue-100 text-blue-800"
                : ele.status === "in-process"
                ? "bg-purple-100 text-purple-800"
                : ele.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {ele.status}
          </span>
        </td>

        <td className="px-4 py-3 text-gray-700">
          {ele.assignedto ? ele.assignedto.name : "Unassigned"}
        </td>
      </tr>
    ))}
  </tbody>
</table>










</div>
</div>

<div className="mt-10">
  <h2 className="text-2xl font-bold mb-6 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
    Assigned Technicians
  </h2>

  <div className="flex flex-wrap gap-6">
    {myraiserequest.length > 0 ? (
      myraiserequest.map((ele) => {
        const tech = ele.assignedto;
        if (!tech) return null;

        return (
          <div
            key={ele._id}
            className="w-[280px] bg-white border border-gray-200 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-shadow duration-300"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                {tech.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                <p className="text-sm text-gray-500">{tech.phone || "No Phone"}</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-2 truncate">
              <span className="font-semibold text-gray-800">Address:</span> {tech.address || "Not Provided"}
            </p>

            <p className="text-gray-700 text-sm mb-1">
              <span className="font-semibold">Asset:</span> {ele.assetid?.assetName || "N/A"}
            </p>

            <p className="text-gray-700 text-sm mb-3">
              <span className="font-semibold">Status:</span> {ele.status.replace("-", " ")}
            </p>

            <button
              onClick={() =>handleTrack(ele) }
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Track Technician
            </button>
          </div>
        );
      })
    ) : (
      <p className="text-gray-500 text-sm">No assigned technicians available yet.</p>
    )}
  </div>



</div>



<hr />


<div className="p-6">

  {showForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg relative">
        <button
          onClick={() => setShowForm(false)}
          className="absolute top-3 right-3 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Request For New Asset
        </h2>

        <RequestAssetForm
          onSuccess={(newRequest) => {
            setUsersrequestasset((prev) => [newRequest, ...prev]);
            setShowForm(false);
          }}
        />
      </div>
    </div>
  )}

  <button
    onClick={() => setShowForm(true)}
    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg"
  >
    <FaPlus />
    Request for Asset
  </button>

  <div className="mt-10 overflow-x-auto">
    <table className="min-w-full border rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3 text-left">Request</th>
          <th className="px-4 py-3 text-left">Category</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Info</th>
          <th className="px-4 py-3 text-left">Created At</th>
        </tr>
      </thead>

      <tbody>
        {usersrequestasset.map((ele) => (
          <tr key={ele._id} className="border-t">
            <td className="px-4 py-3">{ele.name}</td>
            <td className="px-4 py-3">{ele.category}</td>
           <td className="px-4 py-3">
  {ele.status === "approved" && (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
      Approved
    </span>
  )}

  {ele.status === "rejected" && (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
      Rejected
    </span>
  )}

  {ele.status === "pending" && (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
      Pending
    </span>
  )}
</td>


          <td className="px-4 py-3">
  {ele.status === "approved" && (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
      Your asset will be assigned to you soon
    </span>
  )}

  {ele.status === "rejected" && (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
     Sorry, product is not available
    </span>
  )}

  {ele.status === "pending" && (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
      N/A
    </span>
  )}
</td>


            <td className="px-4 py-3">
              {new Date(ele.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

</div>



<hr />
<div className="overflow-x-auto">
  <h2>My General Request</h2><button
  onClick={() => setShowgenralraiseform(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Raise General Request
</button>
<button
  onClick={handleNearbyTechnician}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Nearby Technicians
</button>


  <table className="min-w-full border border-gray-200 rounded-lg">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2 border text-left">S.No</th>
        <th className="px-4 py-2 border text-left">Issue</th>
        <th className="px-4 py-2 border text-left">Status</th>
        <th className="px-4 py-2 border text-left">Created At</th>
      </tr>
    </thead>

    <tbody>
      {usergeneralrequest.length > 0 ? (
        usergeneralrequest.map((ele, index) => (
          <tr key={ele._id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border">{index + 1}</td>
            <td className="px-4 py-2 border">{ele.issue}</td>

            <td className="px-4 py-2 border">
              <span
                className={`px-2 py-1 rounded text-sm font-medium
                  ${
                    ele.status === "OPEN"
                      ? "bg-yellow-100 text-yellow-800"
                      : ele.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
              >
                {ele.status}
              </span>
            </td>

            <td className="px-4 py-2 border">
              {new Date(ele.createdAt).toLocaleString()}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
            No General Requests Found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

  </div>

    )

}


