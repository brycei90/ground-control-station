import React, { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const Batt_remaining = () => {
  const [voltage, updateVoltage] = useState<number>(0);

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
        if ("battery_rem" in data) {
          updateVoltage(data.battery_rem);
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error for voltage:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close(); // cleanup on unmount
  }, []);

  return (
    <div>
      <strong>Battery Remaining:</strong> {voltage}
    </div>
  );
};

export default Batt_remaining;
