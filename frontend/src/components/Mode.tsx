import React, { useEffect, useState } from "react";
import api from "../api";

const Mode = () => {
  const [mode, updateMode] = useState("unknown");
  useEffect(() => {
    const fetchMode = async () => {
      const response = await api.get("/modeGet");
      const data = response.data.mode;
      console.log(data.mode);
      updateMode(data.mode);
    };
    fetchMode();
    console.log(mode);
  }, [mode]);

  return <div>Mode: {mode}</div>;
};

export default Mode;
