// AltitudeChart.tsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ReconnectingWebSocket from "reconnecting-websocket";

const Graph = () => {
  const [data, setData] = useState<
    {
      time: number;
      current: number;
      rc_throttle: number;
      auto_throttle: number;
    }[]
  >([]);
  useEffect(() => {
    const socket = new ReconnectingWebSocket("ws://localhost:8000/telemetry");

    socket.onmessage = (event) => {
      const parsed_data = JSON.parse(event.data);
      const newPoint = {
        time: Date.now(),
        current: parsed_data.current,
        rc_throttle: parsed_data.throttle_percent,
        auto_throttle: parsed_data.auto_throttle,
      };
      setData((prevData) => [...prevData.slice(-49), newPoint]);
    };
    return () => socket.close();
  }, []);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis
          dataKey="time"
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="current"
          stroke="#ff0101ff"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="rc_throttle"
          stroke="#0d00ffff"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="auto_throttle"
          stroke="#000000ff"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Graph;
