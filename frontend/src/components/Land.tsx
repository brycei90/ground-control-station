import api from "../api";

const Land = () => {
  api.get("/land");

  return (
    <button type="button" className="btn btn-success" onClick={Land}>
      Land
    </button>
  );
};

export default Land;
