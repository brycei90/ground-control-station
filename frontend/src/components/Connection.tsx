import React, { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const Connection = () => {
  const [connection, updateConnection] = useState("disconnected");

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
        
        if ("connection" in data) {
          if(data.connection === "connected"){
            //not making it in to here
            updateConnection("Connected");
          }
        }
        else{
          updateConnection("Disconnected")
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error for connection:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close(); // cleanup on unmount
  }, []);
  return <div>{connection}</div>;
};

export default Connection;
