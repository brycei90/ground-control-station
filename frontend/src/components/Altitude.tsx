import React, { useEffect, useState, useRef } from "react";

export const Altitude = () => {
  const [Altitude, updateAltitude] = useState<number>(0);
  const socket = useRef<WebSocket | null>(null);
  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      socket.current = new WebSocket("ws://localhost:8000/altitude");

      socket.current.onopen = () => {
        console.log("websocket connected to altitude");
      };
    };

    socket.current.onmessage = (event) => {
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
      socket?.close(); //force reconnect on error
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      retryTimeout = setTimeout(Connect, 2000);
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
