import React, { useEffect, useState } from "react";

const Voltage = () => {
  const [voltage, updateVoltage] = useState<number>(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/battery");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if ("voltage" in data) {
          updateVoltage(data.voltage);
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
      <strong>voltage:</strong> {voltage.toFixed(2)} V, per Cell: {voltage / 6}V
    </div>
  );
};

export default Voltage;
