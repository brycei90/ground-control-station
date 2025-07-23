import React from "react";
import api from "../api";
import Dropdown from "react-bootstrap/Dropdown";

const SetAuto = () => {
  const clickHandler = async (id: string) => {
    try {
      await api.post("/mode", { mode: id });
    } catch (error) {
      console.error("could not post mode", error);
    }
  };
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Set Mode
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            clickHandler("auto");
          }}
        >
          Auto
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            clickHandler("stabilize");
          }}
        >
          Angle
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            clickHandler("RTL");
          }}
        >
          RTL
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            clickHandler("loiter");
          }}
        >
          Loiter
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            clickHandler("autotune");
          }}
        >
          AutoTune
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SetAuto;
