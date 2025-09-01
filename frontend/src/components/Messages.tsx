import React, { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

export const Messages = () => {
  const [message, updateMessage] = useState<Array<string>>([]);

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
        if ("message" in data) {
          if (message.length > 1 && message[message.length] !== data.message) {
            updateMessage((prev) => [data.message, ...prev]);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error for Messages:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };
  }, [message]);

  return (
    <>
      <div className="w-64 max-h-64 overflow-y-auto border rounded p-2">
        <h3 className="panel-title"></h3>Messages
        <ul className="list-group">
          {message.map((m, idx) => {
            return (
              <li key={idx} className="list-group-item">
                {m}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Messages;
