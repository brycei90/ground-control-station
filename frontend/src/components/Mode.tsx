import React, { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const Mode = () => {
  const [mode, updateMode] = useState<string>("undetermined");

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

    try {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateMode(data.mode);
      };
    } catch (err) {
      console.error("failed to parse mode message: ", err);
    }

    socket.onerror = (err) => {
      console.error("WebSocket error for mode:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close();
  }, []);

  return <div>Mode: {mode}</div>;
};

export default Mode;
