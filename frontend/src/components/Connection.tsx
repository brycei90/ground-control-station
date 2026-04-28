import { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

type ConnectionStatus = "connected" | "disconnected";

const Connection = () => {
  const [connection, setConnection] =
    useState<ConnectionStatus>("disconnected");

  const isLive = connection === "connected";

  useEffect(() => {
    const socket = new ReconnectingWebSocket(
      "ws://localhost:8000/telemetry",
      [],
      {
        maxRetries: 10,
        reconnectInterval: 3000,
      }
    );

    socket.onopen = () => {
      console.log("Telemetry WebSocket opened");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("Telemetry websocket data:", data);

        if (data.connection === "connected") {
          setConnection("connected");
        } else if (data.connection === "disconnected") {
          setConnection("disconnected");
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
        setConnection("disconnected");
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error for connection:", err);
      setConnection("disconnected");
    };

    socket.onclose = () => {
      console.log("Telemetry WebSocket closed");
      setConnection("disconnected");
    };

    return () => socket.close();
  }, []);

  return (
    <div className="connection-card">
      <div className="connection-row">
        <span
          className={`status-dot ${isLive ? "status-live" : "status-dead"}`}
        />

        <div>
          <div className="connection-title">
            {isLive ? "Live Telemetry" : "Telemetry Offline"}
          </div>

          <div className="connection-subtitle">
            {isLive ? "Vehicle link active" : "No active vehicle link"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connection;