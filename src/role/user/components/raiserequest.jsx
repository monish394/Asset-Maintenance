import { useEffect, useState, useCallback, useMemo } from "react";
import { useUserAsset } from "../context/userassetprovider";
import { FcIdea } from "react-icons/fc";
import { FaPlus, FaComments, FaTimes, FaTrash, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import axios from "../../../config/api";
import { socket } from "../../../socket";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import RoutePolyline from "../../../components/RoutePolyline";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import GeneralRequestForm from "./generalrequstform";
import RaiseRequestForm from "./raiserequestform";
import AiTechBot from "./AiTechBot";
import Chat from "../../../components/Chat";

function FitBounds({ origin, destination }) {
  const map = useMap();
  const [hasFit, setHasFit] = useState(false);

  useEffect(() => {
    if (origin && destination && !hasFit) {
      const bounds = [
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ];
      map.fitBounds(bounds, { padding: [50, 50] });
      setHasFit(true);
    }
  }, [map, origin, destination, hasFit]);
  return null;
}

function FitAllBounds({ userCoords, techs }) {
  const map = useMap();

  useEffect(() => {
    if (userCoords && techs) {
      const bounds = [[userCoords.lat, userCoords.lng]];
      if (techs.length > 0) {
        techs.forEach(tech => {
          if (tech.location?.coordinates) {
            bounds.push([tech.location.coordinates[1], tech.location.coordinates[0]]);
          }
        });
      }
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 15 });
    }
  }, [map, userCoords, techs]);
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
  const [showNoAssetModal, setShowNoAssetModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

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
        setMyraiserequest((prev) => [...prev,newRequest]);
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

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;
    const { id, type } = requestToDelete;
    try {
      if (type === 'asset') {
        await axios.delete(`/raiserequest/${id}`, {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setMyraiserequest(prev => prev.filter(r => r._id !== id));
      } else {
        await axios.delete(`/generalraiserequest/${id}`, {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setUsergeneralrequest(prev => prev.filter(r => r._id !== id));
      }
      toast.success("Request deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.err || "Failed to delete request");
    } finally {
      setRequestToDelete(null);
    }
  };

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
              <RoutePolyline
                origin={trackingCoords.origin}
                destination={trackingCoords.destination}
                color="#2563eb"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[80vh] min-h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

            <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between bg-white relative z-10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-none">Nearby Supported Technicians</h2>
                  <p className="text-[13px] text-gray-500 font-medium mt-1">Found ({nearbyTechs.length}) within {searchRadius}km radius</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Radius</span>
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
                      className="w-32 accent-indigo-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-black text-indigo-600 w-8">{searchRadius}km</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                <button
                  onClick={() => setShowNearbyMap(false)}
                  className="p-2 bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all hidden md:flex border border-gray-100"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>


            <div className="flex-1 relative bg-slate-50">
              {isRefreshing && (
                <div className="absolute inset-0 z-[1001] bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
                    <span className="text-sm font-bold text-slate-700">Scanning Area...</span>
                  </div>
                </div>
              )}

              <MapContainer
                center={[userCoords.lat, userCoords.lng]}
                zoom={searchRadius > 20 ? 10 : searchRadius > 10 ? 11 : 12}
                className="w-full h-full z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
                  <Tooltip permanent direction="bottom">
                    Your Location
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
                      {tech.name}
                    </Tooltip>
                  </Marker>
                ))}
                <FitAllBounds userCoords={userCoords} techs={nearbyTechs} />
              </MapContainer>


              <AnimatePresence>
                {hoveredTech && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute bottom-6 left-6 z-[1002] pointer-events-none"
                  >
                    <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 w-[300px] flex flex-col">
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md shadow-indigo-200 overflow-hidden ring-2 ring-white">
                          {hoveredTech.profile ? (
                            <img src={hoveredTech.profile} alt={hoveredTech.name} className="w-full h-full object-cover" />
                          ) : (
                            hoveredTech.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-bold text-gray-900 truncate leading-tight">{hoveredTech.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-emerald-600 text-[10px] uppercase tracking-wider font-bold">Available Now</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100/50 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Distance</span>
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/50">
                            {(hoveredTech.distance / 1000).toFixed(1)} km away
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed font-medium mt-1">
                          {hoveredTech.address || "Local Technician"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setShowNearbyMap(false)}
              className="absolute top-4 right-4 p-2 bg-white text-slate-500 rounded-full shadow-md sm:hidden z-[1010]"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
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
      </AnimatePresence>

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            My Service Requests
          </h1>
          <button
            onClick={() => {
              if (myasset.length === 0) {
                setShowNoAssetModal(true);
              } else {
                setShowRaiseForm(true);
              }
            }}
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
                  Cost
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
                  <td className="px-5 py-3 text-gray-700 font-semibold">
                    {ele.costEstimate ? `₹${ele.costEstimate}` : "N/A"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
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
                      {ele.status === "pending" && (
                        <button
                          onClick={() => setRequestToDelete({ id: ele._id, type: 'asset' })}
                          className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                          title="Delete Request"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                      {ele.status === "completed" && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50 shadow-sm shadow-emerald-100/20 group">
                          <FaCheckCircle className="text-emerald-500 scale-110 group-hover:scale-125 transition-transform" size={14} />

                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {myraiserequest.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
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

      <div className="mt-16">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Assigned Technicians</h2>
          <p className="text-[11px] text-slate-400 font-medium">Technicians currently handling your requests</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assignedTechs.length > 0 ? (
            assignedTechs.map((ele) => (
              <div
                key={ele._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col h-full hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 text-xl font-bold overflow-hidden border border-gray-100 shadow-inner">
                    {ele.assignedto.profile ? (
                      <img src={ele.assignedto.profile} alt={ele.assignedto.name} className="w-full h-full object-cover" />
                    ) : (
                      ele.assignedto.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">{ele.assignedto.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-gray-500 font-medium">Technician Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 flex-1 mb-6">
                  <div className="flex justify-between items-center text-xs py-2 border-b border-gray-50">
                    <span className="text-gray-400 font-semibold tracking-wide uppercase text-[10px]">Asset</span>
                    <span className="text-gray-800 font-bold truncate max-w-[140px]">{ele.assetid?.assetName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-gray-400 font-semibold tracking-wide uppercase text-[10px]">Current Status</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border border-blue-100">
                      {ele.status.replace("-", " ")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleTrack(ele)}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                  >
                    <FaMapMarkerAlt size={12} /> Track
                  </button>
                  <button
                    onClick={() => openChat({
                      requestId: ele._id,
                      requestModel: 'RaiseRequest',
                      senderId: userinfo._id,
                      receiverId: ele.assignedto._id,
                      receiverName: ele.assignedto.name
                    })}
                    className="relative flex-1 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <FaComments size={12} /> Message
                    {unreadChats[ele._id] && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">!</span>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-[11px] font-medium italic">No technicians assigned yet.</p>
            </div>
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
                <th className="w-32 px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                  Cost
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

                      <td className="px-6 py-3 text-gray-700 font-semibold">
                        {ele.costEstimate ? `₹${ele.costEstimate}` : "N/A"}
                      </td>

                      <td className="px-6 py-3 text-gray-500 text-sm whitespace-nowrap">
                        {new Date(ele.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-3">
                        <div className="flex gap-2">
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
                          {ele.status === "OPEN" && (
                            <button
                              onClick={() => setRequestToDelete({ id: ele._id, type: 'general' })}
                              className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                              title="Delete General Request"
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                          {ele.status === "COMPLETED" && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50 shadow-sm shadow-emerald-100/20 group">
                              <FaCheckCircle className="text-emerald-500 scale-110 group-hover:scale-125 transition-transform" size={14} />

                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
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
          autoOpen={false}
          onApplyDescription={(text) => {
            setDraftDescription(text);
          }}
        />
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedImage(null)}
          />

          <div className="relative z-10 max-w-4xl w-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="relative group bg-white p-2 rounded-2xl shadow-2xl">
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
      {showNoAssetModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-[340px] rounded-[2rem] shadow-2xl border border-white/40 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📦</span>
              </div>

              <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">
                No Assets Found
              </h3>

              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 px-2">
                It looks like you don't have any assigned assets yet. Please add an asset to your profile before raising a service request.
              </p>

              <button
                onClick={() => setShowNoAssetModal(false)}
                className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all active:scale-[0.98]"
              >
                Got it, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {requestToDelete && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRequestToDelete(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative bg-white w-full max-w-[300px] rounded-3xl shadow-2xl border border-slate-50 p-8 text-center"
              style={{ fontFamily: 'Calibri, sans-serif' }}
            >
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-rose-500" size={18} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Request?</h3>
              <p className="text-black-400 text-xs font-medium mb-8">
                Are you sure? This action cannot be reversed.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setRequestToDelete(null)}
                  className="flex-1 py-3 px-2 text-black-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRequest}
                  className="flex-1 py-3 px-2 bg-rose-500 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-rose-100 hover:bg-rose-600 active:scale-95 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}