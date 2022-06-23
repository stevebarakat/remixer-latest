import { useState } from "react";
import { Destination } from "tone";
import VuMeter from "./VuMeter";
import { dBToPercent } from "~/utils/scale";
import useMeter from "../useMeter";

function MasterVol({ state }) {
  const [masterVol, setMasterVol] = useState(0);

  function changeMasterVolume(e) {
    const value = parseInt(e.target.value, 10);
    const v = Math.log(value + 101) / Math.log(113);
    const sv = dBToPercent(v);
    setMasterVol(Math.round(sv));
    Destination.set({ volume: sv });
  }

  const masterMeterVal = useMeter([Destination]);

  return (
    <div
      className="fader-wrap"
      style={{
        padding: "12px 0 0 0",
        margin: "0 0 0 16px",
      }}
    >
      <div className="window js-window">
        <input
          disabled
          type="text"
          className="level-val"
          value={masterVol + " db"}
        />
      </div>
      <div className="levels-wrap">
        <VuMeter meterValue={masterMeterVal} height={450} width={12.5} />
      </div>
      <div className="master-vol-wrap">
        <input
          className="master-volume"
          type="range"
          min={-100}
          max={12}
          defaultValue={-32}
          step="0.1"
          onChange={changeMasterVolume}
        />
      </div>
      <div className="track-labels">
        <span className="track-name">Master</span>
      </div>
    </div>
  );
}

export default MasterVol;
