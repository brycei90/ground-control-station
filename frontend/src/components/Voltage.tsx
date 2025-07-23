import React, { useEffect, useState } from "react";
import api from "../api";

export const Voltage = () => {
  const [Voltage, updateVoltage] = useState<GLfloat>(0);
  useEffect(() => {
    const fetchVoltage = async () => {
      try {
        const response = await api.get<GLfloat, GLfloat>("/voltage");
        updateVoltage(response);
      } catch (error) {
        console.error("error getting voltage", error);
      }
    };
    fetchVoltage();
  });

  return (
    <div>
      Voltage: {Voltage}V Per-Cell: {Voltage / 6}V
    </div>
  );
};

export default Voltage;
