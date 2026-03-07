import { useEffect, useState, useCallback, useMemo } from "react";
import { useUserAsset } from "../context/userassetprovider";
import { FcIdea } from "react-icons/fc";
import { FaPlus, FaComments, FaTimes } from "react-icons/fa";
import axios from "../../../config/api";
import { socket } from "../../../socket";
import { toast } from "sonner";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import GeneralRequestForm from "./generalrequstform";
import RaiseRequestForm from "./raiserequestform";
import AiTechBot from "./AiTechBot";
import Chat from "../../../components/Chat";

function FitBounds({ origin, destination }) {
  const map = useMap();
  useEffect(() => {
    if (origin && destination) {
      const bounds = [
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ];
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, origin, destination]);
  return null;
}

const getDistanceKm = (origin, destination) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(destination.lat - origin.lat);
  const dLon = toRad(destination.lng - origin.lng);
  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

const getLatLng = async (address) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`
    );
    const data = await res.json();
    if (data?.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
};

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const techIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/6009/6009047.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

export default function RaiseRequest() {
  const [showNearbyMap, setShowNearbyMap] = useState(false);
  const [nearbyTechs, setNearbyTechs] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [showRaiseForm, setShowRaiseForm] = useState(false);
  const [showGeneralForm, setShowGeneralForm] = useState(false);
  const [trackingCoords, setTrackingCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [usersrequestasset, setUsersrequestasset] = useState([]);
  const [draftDescription, setDraftDescription] = useState("");
  const [searchRadius, setSearchRadius] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [unreadChats, setUnreadChats] = useState({});
  const [hoveredTech, setHoveredTech] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    myasset,
    myraiserequest,
    setMyraiserequest,
    userinfo,
    usergeneralrequest,
    setUsergeneralrequest,
  } = useUserAsset();

  useEffect(() => {
    if (userinfo?._id) {
      socket.connect();
      socket.emit("join", userinfo._id);

      const handleNewMsg = (msg) => {
        if (!activeChat || String(activeChat.requestId) !== String(msg.requestId)) {
          setUnreadChats((prev) => ({
            ...prev,
            [msg.requestId]: true,
          }));
        }
      };

      socket.on("receiveMessage", handleNewMsg);
      socket.on("notification", (data) => {
        toast.info(data.message, {});
      });

      return () => {
        socket.off("receiveMessage", handleNewMsg);
        socket.off("notification");
        socket.disconnect();
      };
    }
  }, [userinfo, activeChat]);

  const openChat = (chatData) => {
    setActiveChat(chatData);
    setUnreadChats((prev) => {
      const updated = { ...prev };
      delete updated[chatData.requestId];
      return updated;
    });
  };

  useEffect(() => {
    if (userinfo?._id) {
      axios.get("/chat/unread", {
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          const unreadMap = {};
          res.data.forEach(id => unreadMap[id] = true);
          setUnreadChats(unreadMap);
        })
        .catch(err => console.error("Error fetching unread status:", err));
    }
  }, [userinfo]);

  const reversedRequests = useMemo(
    () => [...myraiserequest].reverse(),
    [myraiserequest]
  );

  const assignedTechs = useMemo(
    () => myraiserequest.filter((e) => e.status !== "completed" && e.assignedto),
    [myraiserequest]
  );

  useEffect(() => {
    axios
      .get("/getusersrequest", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => setUsersrequestasset(res.data))
      .catch((err) => console.error(err.message));
  }, []);

  const handleNearbyTechnician = useCallback(async (radiusVal = searchRadius) => {
    setIsRefreshing(true);
    try {
      const resUser = await axios.get("/user/location", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const coords = resUser.data;
      setUserCoords(coords);
      const resTech = await axios.post(
        "/getnearbytechnician",
        { lat: coords.lat, lng: coords.lng, radius: radiusVal },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setNearbyTechs(resTech.data);
      setShowNearbyMap(true);
    } catch (err) {
      console.error(err.message);
      if (err.response?.status === 404) {
        alert("Your location is not set. Please update your profile address first.");
      } else {
        alert("Failed to fetch technicians. Please try again later.");
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [searchRadius]);

  const handleRaiseSubmit = useCallback(
    async (assetid, description, imageFile) => {
      if (!assetid) return;
      try {
        let faultImg = null;
        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile);
          const uploadRes = await axios.post("/assets/upload-image", formData);
          faultImg = uploadRes.data.imageUrl;
        }

        const res = await axios.post(
          "/raiserequest",
          { assetid, description, faultImg },
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        const selectedAsset = myasset.find((a) => a._id === assetid);
        const newRequest = {
          ...res.data,
          assetid: {
            _id: assetid,
            assetName: selectedAsset?.assetName,
            assetImg: selectedAsset?.assetImg,
          },
        };
        setMyraiserequest((prev) => [newRequest, ...prev]);
        setShowRaiseForm(false);
        setDraftDescription("");
      } catch (err) {
        console.error(err.message);
      }
    },
    [myasset, setMyraiserequest]
  );


  const handleGeneralSubmit = useCallback(
    async (issue, imageFile) => {
      if (!issue.trim()) {
        alert("Please enter an issue description");
        return;
      }
      try {
        let faultImg = null;
        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile);
          const uploadRes = await axios.post("/assets/upload-image", formData);
          faultImg = uploadRes.data.imageUrl;
        }

        const res = await axios.post(
          "/generalraiserequest",
          { issue, faultImg },
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        setUsergeneralrequest((prev) => [res.data, ...prev]);
        setShowGeneralForm(false);
        setDraftDescription("");
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    },
    [setUsergeneralrequest]
  );

  const handleTrack = useCallback(
    async (ele) => {
      const uCoords = await getLatLng(userinfo.address);
      const tCoords = await getLatLng(ele.assignedto.address);
      if (!uCoords || !tCoords) {
        alert("Unable to get coordinates for route");
        return;
      }
      setTrackingCoords({ origin: uCoords, destination: tCoords });
      setShowMap(true);
    },
    [userinfo]
  );

  return (
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
              Distance:{" "}
              {getDistanceKm(trackingCoords.origin, trackingCoords.destination)}{" "}
              km
            </div>
            <MapContainer
              center={[trackingCoords.origin.lat, trackingCoords.origin.lng]}
              zoom={7}
              scrollWheelZoom
              className="w-full h-full rounded-xl z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[trackingCoords.origin.lat, trackingCoords.origin.lng]}
                icon={userIcon}
              >
                <Tooltip permanent direction="top" offset={[0, -20]}>
                  Your Location
                </Tooltip>
              </Marker>
              <Marker
                position={[
                  trackingCoords.destination.lat,
                  trackingCoords.destination.lng,
                ]}
                icon={techIcon}
              >
                <Tooltip permanent direction="top" offset={[0, -20]}>
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
              <FitBounds
                origin={trackingCoords.origin}
                destination={trackingCoords.destination}
              />
            </MapContainer>
          </div>
        </div>
      )}

      {showNearbyMap && userCoords && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-4xl h-[600px] rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col border border-white/20">

            <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

              <div className="relative z-10">
                <h2 className="text-xl font-extrabold tracking-tight mb-1">Nearby Support</h2>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">Finding technicians within {searchRadius}km</p>
              </div>

              <div className="flex flex-1 max-w-md items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md relative z-10">
                <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Radius: <span className="text-blue-400">{searchRadius}km</span></span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={searchRadius}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchRadius(val);
                    handleNearbyTechnician(val);
                  }}
                  className="flex-1 accent-blue-500 h-1.5 rounded-lg appearance-none bg-slate-700 cursor-pointer"
                />
                <div className="flex gap-1">
                  {[5, 15, 30, 50].map(km => (
                    <button
                      key={km}
                      onClick={() => {
                        setSearchRadius(km);
                        handleNearbyTechnician(km);
                      }}
                      className={`w-8 py-1 rounded-md text-[9px] font-bold transition-all ${searchRadius == km ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                    >
                      {km}k
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowNearbyMap(false)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-red-500 w-10 h-10 rounded-full flex items-center justify-center transition-all group z-20"
              >
                <span className="text-white font-bold text-lg">✕</span>
              </button>
            </div>
            <div className="flex-1 relative">
              {isRefreshing && (
                <div className="absolute inset-0 z-[1001] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                    <span className="text-xs font-bold text-slate-700 tracking-tight">Scanning Area...</span>
                  </div>
                </div>
              )}

              <MapContainer
                center={[userCoords.lat, userCoords.lng]}
                zoom={searchRadius > 20 ? 10 : searchRadius > 10 ? 11 : 12}
                className="w-full h-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
                  <Tooltip permanent direction="bottom">
                    You
                  </Tooltip>
                </Marker>
                {nearbyTechs.map((tech) => (
                  <Marker
                    key={tech._id}
                    position={[
                      tech.location.coordinates[1],
                      tech.location.coordinates[0],
                    ]}
                    eventHandlers={{
                      mouseover: () => setHoveredTech(tech),
                      mouseout: () => setHoveredTech(null),
                    }}
                  >
                    <Tooltip permanent direction="top" offset={[0, -10]}>
                      Tech {tech.name}
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>

              {hoveredTech && (
                <div className="absolute top-4 right-4 z-[1002] animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/20 w-80 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                    <div className="flex items-center gap-4 mb-5 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30 overflow-hidden">
                        {hoveredTech.profile ? (
                          <img src={hoveredTech.profile} alt={hoveredTech.name} className="w-full h-full object-cover" />
                        ) : (
                          hoveredTech.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{hoveredTech.name}</h3>
                        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.1em] mt-0.5">{hoveredTech.role}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="w-2h-2 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                          <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Active Now</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                      <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Location</p>
                          <span className="bg-blue-600 text-white text-[9px] px-2.5 py-0.5 rounded-full font-black tracking-tighter">
                            {(hoveredTech.distance / 1000).toFixed(1)}KM AWAY
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-2 italic">
                          "{hoveredTech.address}"
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Experience</span>
                        <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">5.2 Years</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Success Rate</span>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                          <span className="text-xs font-black text-amber-700">98%</span>
                          <span className="text-amber-500">★</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRaiseForm && (
        <RaiseRequestForm
          assets={myasset}
          initialDescription={draftDescription}
          onSubmit={handleRaiseSubmit}
          onCancel={() => {
            setShowRaiseForm(false);
            setDraftDescription("");
          }}
        />
      )}

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            My Service Requests
          </h1>
          <button
            onClick={() => setShowRaiseForm(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md self-end sm:self-auto"
          >
            <FaPlus /> Raise Request
          </button>
        </div>

        <div className="overflow-x-auto mt-10">
          <table className="w-full border border-gray-200 text-sm rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                  Asset Name
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                  Fault Image
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
                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {reversedRequests.map((ele, i) => (
                <tr
                  key={ele._id || i}
                  className={`border-t border-gray-200 hover:bg-gray-50 transition duration-150 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  <td className="px-5 py-3 text-gray-900 font-medium">
                    {typeof ele.assetid === "object"
                      ? ele.assetid.assetName
                      : "Loading..."}
                  </td>
                  <td className="px-5 py-3">
                    {ele.faultImg ? (
                      <div className="relative group w-16 h-16">
                        <img
                          src={ele.faultImg}
                          alt="Fault"
                          className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-200 cursor-pointer group-hover:scale-105 transition-all duration-300 group-hover:shadow-lg"
                          onClick={() => setSelectedImage(ele.faultImg)}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">VIEW</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                        <span className="text-[10px] font-bold uppercase">No Img</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    <div className="mb-2">{ele.description}</div>
                    {ele.aiResponse && (
                      <div className="mt-2 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow-sm text-gray-800 text-sm leading-relaxed">
                        <div className="flex items-center gap-2 mb-2">
                          <FcIdea className="text-lg" />
                          <span className="font-semibold text-gray-900">
                            AI Suggestion:
                          </span>
                        </div>
                        <div
                          className="whitespace-pre-wrap"
                          style={{ fontFamily: "Calibri, sans-serif", fontSize: 15 }}
                          dangerouslySetInnerHTML={{
                            __html: ele.aiResponse
                              .replace(
                                /`([^`]+)`/g,
                                '<span class="bg-gray-200 px-1 rounded text-gray-800 font-mono">$1</span>'
                              )
                              .replace(
                                /\b(Correct|Incorrect|High|Medium|Low)\b/g,
                                '<span class="font-semibold text-blue-700">$1</span>'
                              ),
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
                  <td className="px-5 py-3">
                    {["assigned", "in-process"].includes(ele.status) && (
                      <button
                        onClick={() => openChat({
                          requestId: ele._id,
                          requestModel: 'RaiseRequest',
                          senderId: userinfo._id,
                          receiverId: ele.assignedto?._id,
                          receiverName: ele.assignedto?.name
                        })}
                        className="relative p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                        title="Chat with Technician"
                      >
                        <FaComments />
                        {unreadChats[ele._id] && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {myraiserequest.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-6 text-center text-gray-500 font-medium"
                  >
                    No service requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-20">
        <h2
          className="text-2xl font-bold mb-6 text-gray-800"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Assigned Technicians
        </h2>
        <div className="flex flex-wrap gap-6">
          {assignedTechs.length > 0 ? (
            assignedTechs.map((ele) => (
              <div
                key={ele._id}
                className="w-[280px] bg-white border border-gray-200 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-shadow duration-300"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {ele.assignedto.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ele.assignedto.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  <span className="font-semibold text-gray-800">Address:</span>{" "}
                  {ele.assignedto.address || "Not Provided"}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-semibold">Asset:</span>{" "}
                  {ele.assetid?.assetName || "N/A"}
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  <span className="font-semibold">Status:</span>{" "}
                  {ele.status.replace("-", " ")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTrack(ele)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Track
                  </button>
                  {["assigned", "in-process"].includes(ele.status) && (
                    <button
                      onClick={() => openChat({
                        requestId: ele._id,
                        requestModel: 'RaiseRequest',
                        senderId: userinfo._id,
                        receiverId: ele.assignedto._id,
                        receiverName: ele.assignedto.name
                      })}
                      className="relative px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                      title="Chat with Technician"
                    >
                      <FaComments />
                      {unreadChats[ele._id] && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No assigned technicians available yet.
            </p>
          )}
        </div>
      </div>

      {activeChat && (
        <Chat
          {...activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}

      <GeneralRequestForm
        show={showGeneralForm}
        onClose={() => {
          setShowGeneralForm(false);
          setDraftDescription("");
        }}
        onSubmit={handleGeneralSubmit}
        initialIssue={draftDescription}
      />

      <div className="mt-20 px-4 font-[Poppins]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="md:text-2xl font-bold text-gray-800 tracking-tight">
            My General Requests
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowGeneralForm(true)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              <FaPlus /> Raise Request
            </button>
            <button
              onClick={() => handleNearbyTechnician()}
              className="px-5 py-2 bg-green-200 text-green-800 font-semibold rounded-lg border border-teal-200 hover:bg-teal-100 transition"
            >
              Nearby Technicians
            </button>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-16 px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                  S.No
                </th>
                <th className="w-24 px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                  Fault Img
                </th>
                <th className="w-2/5 px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                  Issue
                </th>
                <th className="w-32 px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="w-40 px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                  Accepted By
                </th>
                <th className="w-48 px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                  Requested At
                </th>
                <th className="w-24 px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {usergeneralrequest.length > 0 ? (
                usergeneralrequest
                  .filter((e) => e?.issue)
                  .map((ele, index) => (
                    <tr
                      key={ele._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-3 text-gray-700 font-medium">
                        {index + 1}
                      </td>

                      <td className="px-6 py-3">
                        {ele.faultImg ? (
                          <div className="relative group w-14 h-14">
                            <img
                              src={ele.faultImg}
                              alt="Fault"
                              className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-200 cursor-pointer group-hover:scale-105 transition-all duration-300 group-hover:shadow-lg"
                              onClick={() => setSelectedImage(ele.faultImg)}
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                            <span className="text-[9px] font-bold uppercase">N/A</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-3 align-top">
                        <p className="text-gray-700 text-sm whitespace-normal break-words mb-2">
                          {ele.issue}
                        </p>
                      </td>

                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${ele.status === "OPEN"
                            ? "bg-yellow-100 text-yellow-800"
                            : ele.status === "ACCEPTED"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                            }`}
                        >
                          {ele.status
                            ? ele.status.charAt(0).toUpperCase() + ele.status.slice(1).toLowerCase()
                            : ""}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-gray-700 font-medium truncate">
                        {ele.acceptedBy?.name || "N/A"}
                      </td>

                      <td className="px-6 py-3 text-gray-500 text-sm whitespace-nowrap">
                        {new Date(ele.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-3">
                        {["ACCEPTED", "APPROVED"].includes(ele.status) && (
                          <button
                            onClick={() => openChat({
                              requestId: ele._id,
                              requestModel: 'GeneralRequest',
                              senderId: userinfo._id,
                              receiverId: ele.acceptedBy?._id,
                              receiverName: ele.acceptedBy?.name
                            })}
                            className="relative p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                            title="Chat with Technician"
                          >
                            <FaComments />
                            {unreadChats[ele._id] && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
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

      {(showRaiseForm || showGeneralForm) && (
        <AiTechBot
          autoOpen={showGeneralForm}
          onApplyDescription={(text) => {
            setDraftDescription(text);
          }}
        />
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Frosted Glass Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedImage(null)}
          />

          <div className="relative z-10 max-w-4xl w-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            {/* Image Container with Integrated Close Button */}
            <div className="relative group bg-white p-2 rounded-2xl shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-3 -right-3 z-20 w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 border-2 border-white"
                title="Close"
              >
                <FaTimes size={18} />
              </button>

              <div className="rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Fault Detail"
                  className="max-h-[75vh] md:max-h-[80vh] w-auto object-contain block shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}