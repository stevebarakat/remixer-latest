import { useState, useEffect, useRef, useCallback } from "react";
import useKeyPress from "~/hooks/useKeyPress";
import VuMeter from "./VuMeter";
import { dBToPercent } from "~/utils/scale";

function Bus1({
  state,
  busOneChannel,
  handleSetBusOneFxOneChoice,
  busOneActive,
  busOneMeter,
}) {
  const requestRef = useRef();
  const [masterMeterVal, setMasterMeterVal] = useState(-12);
  const [masterVol, setMasterVol] = useState(0);
  const [busOneFxOneOpen, setBusOneFxOneOpen] = useState(false);
  const busOneActiveBool = busOneActive.some((bus) => bus === true);

  if (busOneChannel !== null) {
    busOneChannel.connect(busOneMeter);
  }

  const MetaPress = useKeyPress("Meta");

  function changeMasterVolume(e) {
    if (!busOneActiveBool) return;
    const value = parseInt(e.target.value, 10);
    const v = Math.log(value + 101) / Math.log(113);
    const sv = dBToPercent(v);
    setMasterVol(Math.round(sv));
    busOneChannel.set({ volume: sv });
  }

  const animateMeter = useCallback(() => {
    setMasterMeterVal(busOneMeter.getValue() + 85);
    requestRef.current = requestAnimationFrame(animateMeter);
  }, [busOneMeter]);

  useEffect(() => {
    if (state !== "started")
      setTimeout(() => cancelAnimationFrame(requestRef.current), 1000);
    requestAnimationFrame(animateMeter);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div>
      <dialog open={busOneFxOneOpen}>
        <div>
          <button onClick={() => setBusOneFxOneOpen(false)}>X</button>
          <div>
            <input type="range" />
          </div>
        </div>
      </dialog>
      {busOneActiveBool === true ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              onClick={(e) => {
                MetaPress
                  ? setBusOneFxOneOpen(true)
                  : setBusOneFxOneOpen(false);
              }}
              onChange={(e) => handleSetBusOneFxOneChoice(e.target.value)}
              className="effect-select"
            >
              <option value="fx1">FX1</option>
              <option value="reverb">Reverb</option>
              <option value="delay">Delay</option>
              <option value="chorus">Chorus</option>
              <option value="chebyshev">Chebyshev</option>
              <option value="pitch-shift">PitchShift</option>
              <option value="compressor">Compressor</option>
            </select>
          </div>
        </>
      ) : null}

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
          <span className="track-name">Bus 1</span>
        </div>
      </div>
    </div>
  );
}

export default Bus1;
