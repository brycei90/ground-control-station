import { useEffect, useState } from "react";
import api from "../api";

const AirType = () => {
  const [click, setClick] = useState(0);
  const [airType, setAirType] = useState("take off");
  useEffect(() => {
    if (click >= 1) {
      if (airType === "land") {
        api.post("airType", { mode: "land" });
        setAirType("take off");
      } else {
        api.post("airType", { mode: "take off" });
        setAirType("land");
      }
    }
  }, [click]);
  const handleClick = () => {
    setClick((prev) => (prev += 1));
  };

  return (
    <button type="button" className="btn btn-success" onClick={handleClick}>
      {airType}
    </button>
  );
};

export default AirType;
