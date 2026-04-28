import "./App.css";
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
import BattRemaining from "./components/BatteryRemaining";
import Satellites from "./components/satellite";
import AirType from "./components/AirType";
import Messages from "./components/Messages";

function App() {
  return (
    <div className="gcs-shell">
      <div className="gcs-background-glow" />

      <header className="gcs-topbar">
        <div>
          <p className="gcs-kicker">Custom Ground Control Station</p>
          <h1>Flight Operations</h1>
        </div>

        <div className="gcs-nav">
          <Header />
        </div>
      </header>

      <main className="gcs-layout">
        <section className="gcs-card gcs-map-card">
          <div className="gcs-card-header">
            <div>
              <p className="gcs-kicker">Navigation</p>
              <h2>Live Map</h2>
            </div>
          </div>
          <DynamicMap />
        </section>

        <section className="gcs-card gcs-chart-card">
          <div className="gcs-card-header">
            <div>
              <p className="gcs-kicker">Telemetry Stream</p>
              <h2>Current / Throttle</h2>
            </div>
          </div>
          <Graph />
        </section>

        <aside className="gcs-card gcs-status-card">
          <div className="gcs-card-header">
            <div>
              <p className="gcs-kicker">Vehicle Link</p>
              <h2>Status</h2>
            </div>
          </div>

          <Connection />

          <div className="gcs-metric-grid">
            <div className="gcs-metric">
              <Satellites />
            </div>
            <div className="gcs-metric">
              <Mode />
            </div>
            <div className="gcs-metric">
              <Voltage />
            </div>
            <div className="gcs-metric">
              <Current />
            </div>
            <div className="gcs-metric">
              <Altitude />
            </div>
            <div className="gcs-metric">
              <BattRemaining />
            </div>
          </div>

          <div className="gcs-control-panel">
            <Arm />
            <SetMode />
            <AirType />
          </div>
        </aside>

        <section className="gcs-card gcs-messages-card">
          <div className="gcs-card-header">
            <div>
              <p className="gcs-kicker">System</p>
              <h2>Messages</h2>
            </div>
          </div>
          <Messages />
        </section>
      </main>
    </div>
  );
}

export default App;