import React, { useEffect, useState } from "react";
import api from "../api";

const Connection = () => {
  const [connection, setConnection] = useState("disconnected");

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const response = await api.get("/connection");
        if (response.data.mode == "connected") {
          setConnection("connected");
        } else {
          setConnection("disconnected");
        }
      } catch (error) {
        console.error("Failed to connect", error);
      }
    };
    fetchConnection();
    const interval = setInterval(fetchConnection, 3000);
    return () => clearInterval(interval);
  }, []);
  return <div>{connection}</div>;
};

export default Connection;
