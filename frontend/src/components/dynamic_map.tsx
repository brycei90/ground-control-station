// import React, { useState } from "react";
// import api from "../api";
import { type LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

const MapUpdate = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
};

const DynamicMap = () => {
  const [position, update_position] = useState<LatLngExpression>([
    51.0447, -114.0719,
  ]);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/gps_position");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const new_position: LatLngExpression = [data.lat, data.lon];
        update_position(new_position);
      } catch (error) {
        console.error("Error fetching position:", error);
      }
    };
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "40%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Drone here!</Popup>
      </Marker>
      <MapUpdate position={position} />
    </MapContainer>
  );
};

export default DynamicMap;
