//import { useState } from "react";
import type React from "react";
import Graph from "./components/Graph";
import Header from "./components/Header";
import DynamicMap from "./components/dynamic_map";
import Current from "./components/Current";
import Voltage from "./components/Voltage";
import Altitude from "./components/Altitude";
import { Arm } from "./components/Arm";
import Connection from "./components/Connection";
import Mode from "./components/Mode";
import SetMode from "./components/setMode";

function App() {
  return (
    <div className="bg-light text-dark min-vh-100 p-2">
      <div className="container p-1">
        <Header />
      </div>
      <div className="d-flex p-2">
        <DynamicMap />
        <Graph />
      </div>
      <div style={{ maxWidth: "40%" }} className="p-2">
        <ul className="list-group list-group-horizontal p-1 gap-1">
          <li className="list-group-item flex-fill">
            <Connection />
          </li>
          <li className="list-group-item flex-fill">2</li>
          <li className="list-group-item flex-fill">3</li>
        </ul>
        <ul className="list-group list-group-horizontal p-1 gap-1">
          <li className="list-group-item flex-fill">
            <Voltage />
          </li>
          <li className="list-group-item flex-fill">
            <Altitude />
          </li>
          <li className="list-group-item flex-fill">
            <Current />
          </li>
        </ul>
        <ul className="list-group list-group-horizontal w-30">
          <li className="list-group-item flex-fill">
            <Mode />
          </li>
          <li className="list-group-item flex-fill">2</li>
          <li className="list-group-item flex-fill">3</li>
        </ul>
        <ul className="list-group list-group-horizontal gap-4">
          <Arm />
          <SetMode />
          <li className="list-group-item flex-fill">A third item</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
