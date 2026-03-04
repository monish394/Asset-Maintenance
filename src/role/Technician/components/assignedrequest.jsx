import { useState, useEffect } from "react";
import { TechData } from "../context/Techniciandatamaintenance";
import axios from "../../../config/api";
import OSMTrackMap from "./techniciantrack";
import { FaMapMarkerAlt, FaPhone, FaEdit, FaTimes, FaCheckCircle, FaComments } from "react-icons/fa";
import { socket } from "../../../socket";
import Chat from "../../../components/Chat";

export default function AssignedRequest() {
  const [showMap, setShowMap] = useState(false);
  const [trackAddress, setTrackAddress] = useState("");
  const [acceptedtechniciangeneralreqeust, setAcceptedtechniciangeneralreqeust] = useState([]);
  const [nearbyAssetRequests, setNearbyAssetRequests] = useState([]);
  const [costEstimateEdit, setCostEstimateEdit] = useState("");
  const [requestid, setRequestid] = useState("");
  const [statusedit, setStatusedit] = useState("");
  const [showeditform, setShoweditform] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const { technicianassignedassert, setTechnicianassignedassert, requests, setRequests, techinfo } = TechData();
  const [unreadChats, setUnreadChats] = useState({});

  useEffect(() => {
    if (techinfo?._id) {
      socket.connect();
      socket.emit("join", techinfo._id);

      const handleNewMsg = (msg) => {

        if (!activeChat || String(activeChat.requestId) !== String(msg.requestId)) {
          setUnreadChats(prev => ({
            ...prev,
            [msg.requestId]: true
          }));
        }
      };

      socket.on("receiveMessage", handleNewMsg);
      return () => {
        socket.off("receiveMessage", handleNewMsg);
      };
    }
  }, [techinfo, activeChat]);

  const openChat = (chatData) => {
    setActiveChat(chatData);

    setUnreadChats(prev => {
      const updated = { ...prev };
      delete updated[chatData.requestId];
      return updated;
    });
  };

  useEffect(() => {
    if (techinfo?._id) {
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
  }, [techinfo]);

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const res = await axios.get("/getnearbyassetrequest", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setNearbyAssetRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch nearby requests:", err.response?.data || err.message);
      }
    };
    fetchNearby();
  }, []);

  useEffect(() => {
    axios.get("/gettechnicianaccepetedgeneralrequest", {
      headers: { Authorization: localStorage.getItem("token") }
    })
      .then((res) => setAcceptedtechniciangeneralreqeust(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const res = await axios.put(
        `/raiserequest/accept/${requestId}`,
        null,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setTechnicianassignedassert(prev =>
        prev.map(req =>
          req._id === requestId
            ? { ...res.data, assetid: req.assetid, userid: req.userid }
            : req
        )
      );
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.err || "This request has already been assigned.");
      } else {
        console.log("Accept request error:", err.message);
      }
    }
  };

  const handleEdit = (request) => {
    setRequestid(request._id);
    setStatusedit(request.status || "assigned");
    setCostEstimateEdit(request.costEstimate || "");
    setShoweditform(true);
  };

  const handleUpdate = async () => {
    try {
      const payload = {};
      if (statusedit && statusedit !== "") payload.status = statusedit;
      if (costEstimateEdit !== "" && costEstimateEdit !== null)
        payload.costEstimate = Number(costEstimateEdit);

      const res = await axios.put(`/technicianstatusupdate/${requestid}`, payload);
      setTechnicianassignedassert(prev =>
        prev.map(item =>
          item._id === res.data.updated._id
            ? {
              ...item,
              status: res.data.updated.status,
              costEstimate: res.data.updated.costEstimate ?? Number(costEstimateEdit),
              completedAt: res.data.updated.completedAt ?? item.completedAt
            }
            : item
        )
      );
      setShoweditform(false);
      setCostEstimateEdit("");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleTrack = (address) => {
    if (!address) return alert("User address not available");
    setTrackAddress(address);
    setShowMap(true);
  };

  const handleGeneralAccept = async (id) => {
    try {
      const res = await axios.post(
        `/technician/general-request/${id}/accept`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setRequests(prev => prev.filter(req => req._id !== id));
      setAcceptedtechniciangeneralreqeust(prev => [...prev, res.data]);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.err || "This request is already accepted by another technician");
        setRequests(prev => prev.filter(req => req._id !== id));
      } else {
        console.error("Failed to accept request:", err.response?.data || err.message);
      }
    }
  };

  const handleComplete = async (requestId) => {
    try {
      const res = await axios.patch(
        `/technician/general-request/${requestId}/complete`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setAcceptedtechniciangeneralreqeust((prev) =>
        prev.map((req) => (req._id === requestId ? res.data : req))
      );
    } catch (err) {
      console.log("Error completing request:", err.response?.data || err.message);
    }
  };

  const handleNearbyAssetAccept = async (requestId) => {
    try {
      const res = await axios.put(
        `/raiserequest/accept/${requestId}`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setTechnicianassignedassert(prev => [...prev, res.data]);
      setNearbyAssetRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "in-process":
      case "in_progress":
      case "accepted":
        return "bg-indigo-50 text-indigo-600 border border-indigo-100";
      case "pending":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "assigned":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "open":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-rose-50 text-rose-600 border border-rose-100";
      case "medium": return "bg-amber-50 text-amber-600 border border-amber-100";
      case "low": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      default: return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // const filteredRequests = nearbyAssetRequests.filter(
  //   (req) => req.aiPriority && ["low", "medium","high"].includes(req.aiPriority.toLowerCase())
  // );

  return (
    <div className="p-6" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {showeditform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShoweditform(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Update Request</h3>
              <button onClick={() => setShoweditform(false)} className="text-slate-400 hover:text-slate-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={statusedit}
                  onChange={(e) => setStatusedit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                >
                  <option value="assigned">Assigned</option>
                  <option value="in-process">In Process</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cost Estimate</label>
                <input
                  type="number"
                  placeholder="Enter cost estimate"
                  value={costEstimateEdit}
                  onChange={(e) => setCostEstimateEdit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setCostEstimateEdit(""); setShoweditform(false); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMap && trackAddress && (
        <OSMTrackMap userAddress={trackAddress} onClose={() => setShowMap(false)} />
      )}

      <div className="mb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Assets Requests</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Manage all asset maintenance requests</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Asset</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Issue</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Raised By</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Address</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Priority</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Cost</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {technicianassignedassert.map((ele, idx) => (
                  <tr key={ele._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{ele.assetid?.assetName || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ele.description || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{ele.userid?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ele.userid?.address || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${getPriorityStyle(ele.aiPriority)}`}>
                        {ele.aiPriority || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusStyle(ele.status)}`}>
                        {ele.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 whitespace-nowrap">₹{ele.costEstimate || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {ele.status === "pending" && (
                          <button
                            onClick={() => handleAccept(ele._id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition whitespace-nowrap"
                          >
                            Accept
                          </button>
                        )}
                        {["assigned", "in-process", "completed"].includes(ele.status) && (
                          <button
                            onClick={() => handleEdit(ele)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition flex items-center gap-1 whitespace-nowrap"
                          >
                            <FaEdit size={10} />
                            Edit
                          </button>
                        )}
                        {["assigned", "in-process"].includes(ele.status) && (
                          <button
                            onClick={() => openChat({
                              requestId: ele._id,
                              requestModel: 'RaiseRequest',
                              senderId: techinfo._id,
                              receiverId: ele.userid?._id,
                              receiverName: ele.userid?.name
                            })}
                            className="relative p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                            title="Chat with User"
                          >
                            <FaComments />
                            {unreadChats[ele._id] && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Assigned Requests</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Track assigned requests and contact details</p>
        </div>

        {technicianassignedassert.filter((ele) => ["assigned", "in-process"].includes(ele.status)).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {technicianassignedassert.filter((ele) => ["assigned", "in-process"].includes(ele.status)).map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {item.userid?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 font-bold text-sm truncate">{item.userid?.name || "Unknown User"}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{item.assetid?.assetName}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  {item.userid?.phone && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-slate-400" size={10} />
                      <a href={`tel:${item.userid?.phone}`} className="text-indigo-600 hover:underline font-medium">
                        {item.userid?.phone}
                      </a>
                    </div>
                  )}
                  {item.userid?.address && (
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-slate-400 mt-0.5" size={10} />
                      <p className="text-slate-600 line-clamp-2">{item.userid?.address}</p>
                    </div>
                  )}
                  {item.description && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue</p>
                      <p className="text-slate-600 line-clamp-2">{item.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleTrack(item.userid?.address)}
                    className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <FaMapMarkerAlt size={12} />
                    Track
                  </button>
                  {["assigned", "in-process"].includes(item.status) && (
                    <button
                      onClick={() => openChat({
                        requestId: item._id,
                        requestModel: 'RaiseRequest',
                        senderId: techinfo._id,
                        receiverId: item.userid?._id,
                        receiverName: item.userid?.name
                      })}
                      className="relative p-2.5 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors"
                      title="Chat with User"
                    >
                      <FaComments />
                      {unreadChats[item._id] && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-400 text-sm">No assigned requests available.</p>
          </div>
        )}
      </div>

      <div className="mb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Nearby General Requests</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">New general maintenance requests in your area</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {requests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-sm">No general requests available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">User</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Issue</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Phone</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Address</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{req.userId?.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.issue}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{req.userId?.phone}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.userId?.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusStyle(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {req.status === "OPEN" && (
                          <button
                            onClick={() => handleGeneralAccept(req._id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition whitespace-nowrap"
                          >
                            Accept
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Accepted General Requests</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Requests you've accepted and are working on</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {acceptedtechniciangeneralreqeust.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-sm">No accepted requests yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">User</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Issue</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Phone</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Address</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {acceptedtechniciangeneralreqeust.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{req.userId?.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.issue}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{req.userId?.phone}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.userId?.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusStyle(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTrack(req.userId?.address)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition whitespace-nowrap"
                          >
                            Track
                          </button>
                          {["ACCEPTED", "APPROVED"].includes(req.status) && (
                            <button
                              onClick={() => openChat({
                                requestId: req._id,
                                requestModel: 'GeneralRequest',
                                senderId: techinfo._id,
                                receiverId: req.userId?._id,
                                receiverName: req.userId?.name
                              })}
                              className="relative p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                              title="Chat with User"
                            >
                              <FaComments />
                              {unreadChats[req._id] && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                              )}
                            </button>
                          )}
                          {req.status !== "COMPLETED" && (
                            <button
                              onClick={() => handleComplete(req._id)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition flex items-center gap-1 whitespace-nowrap"
                            >
                              <FaCheckCircle size={10} />
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Nearby Asset Requests</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Low and medium priority requests in your vicinity</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {nearbyAssetRequests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-sm">No nearby requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Raised By</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Category</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Priority</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Type</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Description</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Created</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {nearbyAssetRequests.map((ele) => (
                    <tr key={ele._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{ele.userid?.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{ele.aiCategory}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${getPriorityStyle(ele.aiPriority)}`}>
                          {ele.aiPriority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize whitespace-nowrap">{ele.requesttype}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{ele.description}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{formatDate(ele.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleNearbyAssetAccept(ele._id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition whitespace-nowrap"
                        >
                          Accept
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
}
