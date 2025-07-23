import React, { useEffect, useState } from "react";
import api from "../api";

export const Altitude = () => {
  const [Altitude, updateAltitude] = useState<GLfloat>(0);
  useEffect(() => {
    const fetchAltitude = async () => {
      try {
        const response = await api.get<GLfloat, GLfloat>("/Altitude");
        updateAltitude(response);
      } catch (error) {
        console.error("error getting Altitude", error);
      }
    };
    fetchAltitude();
  });

  return <div>Alt: {Altitude}m</div>;
};

export default Altitude;
