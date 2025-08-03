import React, { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const Satellites = () => {
  const [sats, updateSats] = useState<number>(0);

  useEffect(() => {
    const options = {
      maxRetries: 10,
      reconnectInterval: 3000,
    };

    const socket = new ReconnectingWebSocket(
      "ws://localhost:8000/telemetry",
      [],
      options
    );

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        updateSats(data.satellites);
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };
    //still working on this... this is meant to automatically reconnect
    //websocket... but need to make this a function and call it in a
    //useEffect

    socket.onerror = (err) => {
      console.error("WebSocket error for satellites:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed attempting reconnection");
    };

    return () => socket.close(); // cleanup on unmount
  }, []);

  return <div>Satellites: {sats}</div>;
};

export default Satellites;
