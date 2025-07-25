import React, { useEffect, useState } from "react";
import api from "../api";

interface ModeResponse {
  mode: string;
}
const Mode = () => {
  const [mode, updateMode] = useState<string>("...");
  useEffect(() => {
    const fetchMode = async () => {
      const response = await api.get<ModeResponse>("/modeGet");
      updateMode(response.data.mode);
    };
    fetchMode();
    console.log(mode);
  }, []);

  return <div>Mode: {mode}</div>;
};

export default Mode;
