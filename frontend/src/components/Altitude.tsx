import React, { useEffect, useState } from "react";

export const Altitude = () => {
  const [Altitude, updateAltitude] = useState<number>(0);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/altitude");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if ("alt" in data) {
          updateAltitude(data.alt);
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error for altitude:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close(); // cleanup on unmount
  }, []);

  return (
    <div>
      <strong>Alt:</strong> {Altitude}m
    </div>
  );
};

export default Altitude;
