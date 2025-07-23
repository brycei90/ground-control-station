import React, { useEffect, useState } from "react";
import api from "../api";

const Mode = () => {
  const [mode, updateMode] = useState<string>("...");
  useEffect(() => {
    const fetchMode = async () => {
      const response = await api.get<string, string>("/mode");
      updateMode(response);
    };
    fetchMode();
  }, [mode]);

  return <div>Mode: {mode}</div>;
};

export default Mode;
