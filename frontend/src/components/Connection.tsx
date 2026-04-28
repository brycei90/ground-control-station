import { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import api from "../api";

type ConnectionStatus = "connected" | "connecting" | "disconnected";

const Connection = () => {
  const [connection, updateConnection] =
    useState<ConnectionStatus>("disconnected");

  const [busy, setBusy] = useState<"connect" | "disconnect" | null>(null);

  const isLive = connection === "connected";

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

        console.log("Telemetry websocket data:", data);

        if ("connection" in data) {
          if (data.connection === "connected") {
            updateConnection("connected");
          } else if (data.connection === "disconnected") {
            updateConnection("disconnected");
          } else if (data.connection === "connecting") {
            updateConnection("connecting");
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error for connection:", err);
      updateConnection("disconnected");
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      updateConnection("disconnected");
    };

    return () => socket.close();
  }, []);

  const handleConnect = async () => {
    try {
      setBusy("connect");
      updateConnection("connecting");

      await api.post("/connect");
    } catch (error) {
      console.error("Could not connect:", error);
      updateConnection("disconnected");
    } finally {
      setBusy(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      setBusy("disconnect");

      await api.post("/disconnect");
      updateConnection("disconnected");
    } catch (error) {
      console.error("Could not disconnect:", error);
    } finally {
      setBusy(null);
    }
  };

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
            {connection === "connecting"
              ? "Connecting..."
              : isLive
              ? "Vehicle link active"
              : "No active vehicle link"}
          </div>
        </div>
      </div>

      <div className="connection-actions">
        <button
          className="gcs-button gcs-button-primary"
          onClick={handleConnect}
          disabled={busy !== null || isLive}
        >
          {busy === "connect" ? "Connecting..." : "Connect"}
        </button>

        <button
          className="gcs-button gcs-button-danger"
          onClick={handleDisconnect}
          disabled={busy !== null || !isLive}
        >
          {busy === "disconnect" ? "Disconnecting..." : "Disconnect"}
        </button>
      </div>
    </div>
  );
};

export default Connection;