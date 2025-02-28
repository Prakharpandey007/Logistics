import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

// Custom Leaflet marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Initial center point
const initialCenter = { lat: -3.745, lng: -38.523 };

// Component to update map view dynamically
const UpdateMapView = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);
  return null;
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(initialCenter);

  useEffect(() => {
    const successHandler = (position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition((prev) => {
        if (
          prev.lat.toFixed(5) !== latitude.toFixed(5) ||
          prev.lng.toFixed(5) !== longitude.toFixed(5)
        ) {
          return { lat: latitude, lng: longitude };
        }
        return prev;
      });
    };

    const errorHandler = (error) => {
      console.error("Geolocation error:", error.message);
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);

    // Watch for position changes
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapContainer
      center={currentPosition}
      zoom={15}
      style={{ width: "100%", height: "65vh", marginTop: "50px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={currentPosition} icon={customIcon} />
      <UpdateMapView position={currentPosition} />
    </MapContainer>
  );
};

export default LiveTracking;
