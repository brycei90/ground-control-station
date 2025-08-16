import { useState } from "react";
import api from "../api";

const Takeoff = () => {
  const [click, setClick] = useState(0);
  if (click >= 1) {
    api.get("/takeoff");
  }
  const handleClick = () => {
    setClick((prev) => (prev += 1));
  };
  return (
    <button type="button" className="btn btn-success" onClick={handleClick}>
      Take Off
    </button>
  );
};

export default Takeoff;
