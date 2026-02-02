import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const OSMTrackMap = ({ userAddress, onClose }) => {
  const [techCoords, setTechCoords] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return alert("Geolocation not supported!");
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setTechCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 1000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!userAddress) return;
    const fetchCoords = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: { q: userAddress, format: "json", limit: 1 },
        });
        if (res.data.length > 0) {
          setUserCoords({ lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) });
        } else {
          alert("User location not found");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoords();
  }, [userAddress]);

  useEffect(() => {
    if (mapRef.current && techCoords && userCoords) {
      const bounds = L.latLngBounds([
        [techCoords.lat, techCoords.lng],
        [userCoords.lat, userCoords.lng],
      ]);
      mapRef.current.fitBounds(bounds, { padding: [100, 100] });
    }
  }, [techCoords, userCoords]);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative z-[10000] w-4/5 md:w-3/4 lg:w-2/3 h-[75vh] rounded-lg overflow-hidden shadow-xl bg-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[10001] px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Close
        </button>

        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
            <p className="text-gray-700 text-lg">Loading map...</p>
          </div>
        )}

        {techCoords && userCoords && (
          <MapContainer
            center={[
              (techCoords.lat + userCoords.lat) / 2,
              (techCoords.lng + userCoords.lng) / 2,
            ]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />

            <Marker position={[techCoords.lat, techCoords.lng]}>
              <Tooltip
                direction="top"
                offset={[0, -10]}
                permanent
                className="bg-blue-600 text-white rounded px-2 py-1 text-sm"
              >
                Your Location
              </Tooltip>
            </Marker>

            <Marker position={[userCoords.lat, userCoords.lng]}>
              <Tooltip
                direction="top"
                offset={[0, -10]}
                permanent
                className="bg-green-600 text-white rounded px-2 py-1 text-sm"
              >
                User
              </Tooltip>
            </Marker>

            <Polyline positions={[techCoords, userCoords]} color="red">
              <Tooltip
                direction="center"
                offset={[0, 0]}
                permanent
                className="bg-black text-white rounded px-2 py-1 text-sm"
              >
                {getDistance(
                  techCoords.lat,
                  techCoords.lng,
                  userCoords.lat,
                  userCoords.lng
                )}{" "}
                km
              </Tooltip>
            </Polyline>
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default OSMTrackMap;
