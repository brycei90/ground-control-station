import React, { useEffect, useState } from "react";
import api from "../api";

const Connection = () => {
  const [connection, setConnection] = useState("disconnected");

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const response = await api.get("/connection_status");
        console.log(response);
        setConnection("Connected");
      } catch (error) {
        console.error("Failed to connect", error);
      }
    };
    fetchConnection();
  }, [connection]);
  return <div>{connection}</div>;
};

export default Connection;
