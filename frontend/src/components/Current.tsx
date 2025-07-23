import React, { useEffect, useState } from "react";
import api from "../api";

export const Current = () => {
  const [Current, updateCurrent] = useState<GLfloat>(0);
  useEffect(() => {
    const fetchVoltage = async () => {
      try {
        const response = await api.get<GLfloat, GLfloat>("/current");
        updateCurrent(response);
      } catch (error) {
        console.error("error getting voltage", error);
      }
    };
    fetchVoltage();
  });

  return <div>Current: {Current}A</div>;
};

export default Current;
