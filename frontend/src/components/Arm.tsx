import React, { useEffect, useState } from "react";
import api from "../api";

export const Arm = () => {
  const [arm, setArm] = useState("Arm");
  const [click, setClick] = useState(0);

  useEffect(() => {
    const arm_drone = async () => {
      try {
        if (arm === "Arm") {
          await api.post("/arm", { mode: "arm" });
          setArm("Disarm");
        } else {
          await api.post("/arm", { mode: "disarm" });
          setArm("Arm");
        }
      } catch (error) {
        console.error("Error arming", error);
      }
    };
    arm_drone();
  }, [click]);

  const handleClick = () => {
    setClick((prev) => (prev += 1));
  };
  return (
    <button className="btn btn-warning" onClick={handleClick}>
      {arm}
    </button>
  );
};
