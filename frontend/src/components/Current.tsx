import React, { useEffect, useState } from "react";

const Current = () => {
  const [current, updateCurrent] = useState<number>(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/battery");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if ("current" in data) {
          updateCurrent(data.current);
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error for current:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close(); // cleanup on unmount
  }, []);

  return (
    <div>
      <strong>Current:</strong> {current.toFixed(2)} A
    </div>
  );
};

export default Current;
