import { useState } from "react";

function SetMode() {
  const [mode, setMode] = useState("");

  const handleModeChange = async (selectedMode: string) => {
    setMode(selectedMode);

    try {
      const response = await fetch(`http://localhost:8000/set_mode/${selectedMode}`, {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Failed to set mode");
      }
    } catch (error) {
      console.error("Error setting mode:", error);
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4 shadow-lg shadow-cyan-950/30">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Flight Mode
      </label>

      <select
        value={mode}
        onChange={(event) => handleModeChange(event.target.value)}
        className="w-full rounded-xl border border-cyan-400/30 bg-slate-950 px-4 py-3 text-sm font-semibold text-cyan-100 outline-none transition hover:border-cyan-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
      >
        <option value="" disabled>
          Select mode
        </option>
        <option value="STABILIZE">STABILIZE</option>
        <option value="ALT_HOLD">ALT_HOLD</option>
        <option value="LOITER">LOITER</option>
        <option value="AUTO">AUTO</option>
        <option value="GUIDED">GUIDED</option>
        <option value="RTL">RTL</option>
        <option value="LAND">LAND</option>
      </select>
    </div>
  );
}

export default SetMode;