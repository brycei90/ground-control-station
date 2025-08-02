import React, { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const Altitude = () => {
  const [Altitude, updateAltitude] = useState<number>(0);

  useEffect(() => {
    const options = {
      maxRetries: 10,
      reconnectInterval: 3000,
    };

    const socket = new ReconnectingWebSocket(
      "ws://localhost:8000/altitude",
      [],
      options
    );

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
    //still working on this... this is meant to automatically reconnect
    //websocket... but need to make this a function and call it in a
    //useEffect

    socket.onerror = (err) => {
      console.error("WebSocket error for altitude:", err);
      socket?.close();
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
