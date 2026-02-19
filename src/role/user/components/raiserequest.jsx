import { useEffect, useState } from "react"
import { useUserAsset } from "../context/userassetprovider";
import { FcIdea } from "react-icons/fc";
import { FaLeaf, FaPlus } from "react-icons/fa6";
import axios from "../../../config/api";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import GeneralRequestForm from "./generalrequstform";



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
// const getUserLocation = () => {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         resolve({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       (err) => reject(err)
//     );
//   });
// };



export default function RaiseRequest() {
  //nearby tech
  const [showNearbyMap, setShowNearbyMap] = useState(false);
  const [nearbyTechs, setNearbyTechs] = useState([]);
  const [userCoords, setUserCoords] = useState(null);



  const handleNearbyTechnician = async () => {
    try {
      const resUser = await axios.get("/user/location", {
        headers: { Authorization: localStorage.getItem("token") },
      });

      const coords = resUser.data;
      setUserCoords(coords);

      const resTech = await axios.post(
        "/getnearbytechnician",
        { lat: coords.lat, lng: coords.lng },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      setNearbyTechs(resTech.data);
      setShowNearbyMap(true);

    } catch (err) {
      console.log("Error fetching nearby technicians:", err.message);
    }
  };





  // const [showForm, setShowForm] = useState(false);
  const [usersrequestasset, setUsersrequestasset] = useState([])
  console.log(usersrequestasset)
  const [showgenralraiseform, setShowgenralraiseform] = useState(false)
  const [generalissue, setGeneralissue] = useState("");
  // const [name,setName]=useState("")
  // const [category,setCategory]=useState("Electronics")
  const [assetid, setAssetid] = useState("")
  const [trackingCoords, setTrackingCoords] = useState(null);
  const [showMap, setShowMap] = useState(false)

  console.log(assetid)
  const [assetdescription, setAssetdescription] = useState("")

  const { myasset, myraiserequest, setMyraiserequest, userinfo, usergeneralrequest, setUsergeneralrequest } = useUserAsset();
  console.log(usergeneralrequest)


  console.log(myraiserequest)
  console.log("User assets raise request page:", myasset);
  console.log("my raise request -", myraiserequest)
  const [showform, setShowform] = useState(false)

  const handleShowform = () => {
    setShowform(!showform)
  }
  const handleCancel = () => {
    setAssetid("")
    setAssetdescription("")
    handleShowform()

  }



  const handleSubmit = async () => {
    if (!assetid) {

      return;
    }

    try {
      const res = await axios.post(
        "/raiserequest",
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
          assetImg: selectedAsset?.assetImg,
        },
      };

      setMyraiserequest([newRequest, ...myraiserequest]);

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
  useEffect(() => {
    axios.get("/getusersrequest", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then((res) => {
        console.log(res.data)
        setUsersrequestasset(res.data)
      })
      .catch((err) => console.log(err.message))

  }, [])


  const handleGeneralRequestSubmit = (e) => {
    e.preventDefault();

    if (!generalissue.trim()) {
      alert("Please enter an issue description");
      return;
    }

    axios
      .post(
        "/generalraiserequest",
        { issue: generalissue },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        setUsergeneralrequest(prev => [res.data, ...prev])
        setGeneralissue("")
        setShowgenralraiseform(false)
      })

      .catch((err) => {
        console.log("Error submitting general request:", err.response?.data || err.message);
      });
  };





  return (
    <div>





      <div>
      </div>
      <div>


        {showMap && trackingCoords && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-[600px] h-[450px] rounded-xl shadow-lg relative overflow-hidden">

              <button
                className="absolute top-3 right-3 z-[9999] text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-red-600 transition"
                onClick={() => setShowMap(false)}
              >
                ✕
              </button>

              <div className="absolute top-3 left-3 z-[9999] bg-white px-3 py-1 rounded-lg shadow-md font-medium text-gray-800">
                Distance: {getDistanceKm(trackingCoords.origin, trackingCoords.destination)} km
              </div>

              <MapContainer
                center={[trackingCoords.origin.lat, trackingCoords.origin.lng]}
                zoom={7}
                scrollWheelZoom={true}
                className="w-full h-full rounded-xl z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker
                  position={[trackingCoords.origin.lat, trackingCoords.origin.lng]}
                  icon={userIcon}
                >
                  <Tooltip
                    permanent
                    direction="top"
                    offset={[0, -20]}
                    className="font-semibold bg-white px-2 py-1 rounded shadow"
                  >
                    Your Location
                  </Tooltip>
                </Marker>

                <Marker
                  position={[trackingCoords.destination.lat, trackingCoords.destination.lng]}
                  icon={techIcon}
                >
                  <Tooltip
                    permanent
                    direction="top"
                    offset={[0, -20]}
                    className="font-semibold bg-white px-2 py-1 rounded shadow"
                  >
                    Technician
                  </Tooltip>
                </Marker>

                <Polyline
                  positions={[
                    [trackingCoords.origin.lat, trackingCoords.origin.lng],
                    [trackingCoords.destination.lat, trackingCoords.destination.lng],
                  ]}
                  color="blue"
                />

                <FitBounds origin={trackingCoords.origin} destination={trackingCoords.destination} />
              </MapContainer>
            </div>
          </div>
        )}
        {showNearbyMap && userCoords && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="relative bg-white w-full max-w-[700px] h-[500px] rounded-xl shadow-lg">

              <button
                onClick={() => setShowNearbyMap(false)}
                className="absolute top-3 right-3 z-[1000] bg-white px-3 py-1 rounded-full shadow text-lg font-bold"
              >
                ✕
              </button>

              <MapContainer
                center={[userCoords.lat, userCoords.lng]}
                zoom={12}
                className="w-full h-full rounded-xl"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={[userCoords.lat, userCoords.lng]}>
                  <Tooltip permanent direction="bottom">
                    You
                  </Tooltip>
                </Marker>

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
                        {`Tech ${tech.name}`}
                      </Tooltip>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        )}












      </div>
      {showform && (
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
                {myasset.map((ele, i) => (
                  <option
                    className="text-gray-900 bg-white"
                    key={i}
                    value={ele._id}
                  >
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
                value={assetdescription}
                onChange={(e) => setAssetdescription(e.target.value)}
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
      )}


      <div className="bg-white shadow-xl rounded-2xl p-6 w-full ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            My Service Requests
          </h1>

          <button
            onClick={handleShowform}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg 
                 hover:bg-blue-700 active:scale-95 transition-all shadow-md self-end sm:self-auto"
          >
            <FaPlus />
            Raise Request
          </button>
        </div>

        <div className="overflow-x-auto mt-20">
          <table className="w-full border border-gray-200 text-sm rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                  Asset Name
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                  Issue Description
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                  Technician
                </th>
              </tr>
            </thead>

            <tbody>
              {myraiserequest.reverse().map((ele, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-200 hover:bg-gray-50 transition duration-150 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  <td className="px-5 py-3 text-gray-900 font-medium">
                    {typeof ele.assetid === "object" ? ele.assetid.assetName : "Loading..."}
                  </td>

                  <td className="px-5 py-3 text-gray-700">
                    <div className="mb-2">{ele.description}</div>

                    {ele.aiResponse && (
                      <div className="mt-2 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow-sm text-gray-800 text-sm leading-relaxed transition-transform transform hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500 text-lg"><FcIdea /></span>
                          <span className="font-semibold text-gray-900">AI Suggestion:</span>
                        </div>
                        <div
                          style={{ fontFamily: "Calibri, sans-serif", fontSize: "15px" }}
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: ele.aiResponse
                              .replace(/`([^`]+)`/g, `<span class="bg-gray-200 px-1 rounded text-gray-800 font-mono">$1</span>`)
                              .replace(/\b(Correct|Incorrect|High|Medium|Low)\b/g, `<span class="font-semibold text-blue-700">$1</span>`)
                          }}
                        />
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`font-medium whitespace-nowrap px-3 py-1 rounded-full ${ele.status === "pending"
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
                      {ele.status.replace("-", " ")}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-gray-700 font-medium">
                    {ele.assignedto ? ele.assignedto.name : "Unassigned"}
                  </td>
                </tr>
              ))}

              {myraiserequest.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-6 text-center text-gray-500 font-medium">
                    No service requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
          Assigned Technicians
        </h2>

        <div className="flex flex-wrap gap-6">
          {myraiserequest.length > 0 ? (
            myraiserequest.filter((ele)=>ele.status!=="completed").map((ele) => {
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
                      {/* <p className="text-sm text-gray-500">{tech.phone || "No Phone"}</p> */}
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
                    onClick={() => handleTrack(ele)}
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










      <GeneralRequestForm
        show={showgenralraiseform}
        value={generalissue}
        onChange={(e) => setGeneralissue(e.target.value)}
        onClose={() => setShowgenralraiseform(false)}
        onSubmit={handleGeneralRequestSubmit}
      />



      <div className="mt-10 px-4 font-[Poppins] mt-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="md:text-2xl font-bold text-gray-800 tracking-tight">
            My General Requests
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowgenralraiseform(true)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              <FaPlus />
              Raise Request
            </button>

            <button
              onClick={handleNearbyTechnician}
              className="px-5 py-2 bg-green-200 text-green-800 font-semibold rounded-lg border border-teal-200 hover:bg-teal-100 transition"
            >
              Nearby Technicians
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Accepted By
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Requested At
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {usergeneralrequest.length > 0 ? (
                usergeneralrequest
                  .filter((ele) => ele && ele.issue)
                  .map((ele, index) => (
                    <tr
                      key={ele._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-3 text-gray-700 font-medium whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 text-gray-700 line-clamp-2">
                        {ele.issue}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                      ${ele.status === "OPEN"
                              ? "bg-yellow-100 text-yellow-800"
                              : ele.status === "ACCEPTED"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                        >
                          {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-700 font-medium whitespace-nowrap">
                        {ele.acceptedBy?.name || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(ele.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400 font-medium"
                  >
                    No General Requests Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>




    </div>

  )

}


