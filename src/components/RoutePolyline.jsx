import { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";

export default function RoutePolyline({ origin, destination, color = "blue" }) {
  const [routePoints, setRoutePoints] = useState(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const fetchRoute = async () => {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
          `?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.code === "Ok" && data.routes?.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRoutePoints(coords);
        } else {
          setRoutePoints([
            [origin.lat, origin.lng],
            [destination.lat, destination.lng],
          ]);
        }
      } catch {
        setRoutePoints([
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ]);
      }
    };

    fetchRoute();
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  if (!routePoints) return null;

  return (
    <Polyline
      positions={routePoints}
      pathOptions={{
        color,
        weight: 5,
        opacity: 0.85,
        lineJoin: "round",
        lineCap: "round",
      }}
    />
  );
}
