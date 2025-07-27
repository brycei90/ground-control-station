// import React, { useState } from "react";
// import api from "../api";
import type { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../api";

const Map = () => {
  const [position, update_position] = useState<LatLngExpression>([
    51.0447, -114.0719,
  ]);

  useEffect(() => {
    const fetch_position = async () => {
      try {
        const response = await api.get("/position");
        const data = response.data;
        const new_position: LatLngExpression = [data.lat, data.long];
        update_position(new_position);
      } catch (error) {
        console.error("Error fetching position:", error);
      }
    };
    fetch_position();
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "750px", width: "85%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Drone here!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
