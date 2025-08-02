import api from "../api";

const Takeoff = () => {
  api.get("/takeoff");

  return (
    <button type="button" className="btn btn-success" onClick={Takeoff}>
      Take Off
    </button>
  );
};

export default Takeoff;
