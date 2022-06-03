import { useState, useEffect, useRef, useCallback } from "react";
import {
  loaded,
  Player,
  EQ3,
  Channel,
  Meter,
  Reverb,
  Gain,
  Volume,
  Add,
  Chorus,
  Distortion,
  PitchShift,
  Chebyshev,
  FeedbackDelay,
  Transport as t,
} from "tone";
import Controls from "./Controls";
import Delay from "./FX/Delay";
import Reverber from "./FX/Reverb";
import Choruser from "./FX/Chorus";
import MasterVol from "./MasterVol";
import Bus1 from "./Bus1";
import Bus2 from "./Bus2";
import ChannelStrip from "./ChannelStrip";
import Loader from "./Loader";
import Chebyshever from "./FX/Chebyshev";

function Mixer({ song }) {
  const tracks = song.tracks;
  const requestRef = useRef();
  const channels = useRef([]);
  const players = useRef([]);
  const eqs = useRef([]);
  const meters = useRef([]);
  const masterMeter = useRef(null);
  const busOneMeter = useRef(null);
  const busOneChannel = useRef(null);
  const [meterVals, setMeterVals] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [busOneFxOneType, setBusOneFxOneType] = useState(null);
  const [busOneFxOneChoice, setBusOneFxOneChoice] = useState(null);
  const handleSetBusOneFxOneChoice = (value) => setBusOneFxOneChoice(value);
  const [state, setState] = useState("stopped");
  const handleSetState = (value) => setState(value);
  const [busOneActive, setBusOneActive] = useState(false);
  const [temp, setTemp] = useState([false, false, false, false]);
  const [busOneFxOneControls, setBusOneFxOneControls] = useState(null);

  // t.set({ bpm: 92 });
  // make sure song stops at end
  if (t.seconds > song.end) {
    t.position = song.end;
    t.stop();
    setState("stopped");
  }
  // make sure song doesn't rewind past start position
  if (t.seconds < 0) {
    t.position = song.start;
    t.seconds = song.start;
  }
  useEffect(() => {
    // create audio nodes
    masterMeter.current = new Meter();
    busOneMeter.current = new Meter();

    for (let i = 0; i < tracks.length; i++) {
      channels.current.push(
        new Channel(tracks[i].volume, tracks[i].pan).toDestination()
      );
      players.current.push(new Player(tracks[i].path));
      eqs.current.push(new EQ3());
      meters.current.push(new Meter());
    }

    // connect everything
    players.current.forEach((player, i) =>
      player
        .chain(eqs.current[i], channels.current[i], meters.current[i])
        .sync()
        .start()
    );

    return () => {
      t.stop();
      players.current.forEach((player, i) => {
        player.disconnect();
        meters.current[i].disconnect();
        eqs.current[i].disconnect();
        channels.current[i].disconnect();
        busOneMeter.current.disconnect();
        masterMeter.current.disconnect();
      });
      players.current = [];
      meters.current = [];
      eqs.current = [];
      channels.current = [];
    };
  }, [tracks]);

  useEffect(() => {
    loaded().then(() => setIsLoaded(true));
  }, [setIsLoaded]);

  // loop recursively to amimateMeters
  const animateMeter = useCallback(() => {
    meters.current.forEach((meter, i) => {
      meterVals[i] = meter.getValue() + 85;
      setMeterVals(() => [...meterVals]);
    });
    requestRef.current = requestAnimationFrame(animateMeter);
  }, [meterVals]);

  // triggers animateMeter
  useEffect(() => {
    if (state !== "started")
      setTimeout(() => cancelAnimationFrame(requestRef.current), 1000);
    requestAnimationFrame(animateMeter);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // when busOneFxOneChoice is selected it initiates new FX
  useEffect(() => {
    switch (busOneFxOneChoice) {
      case "FX1":
        setBusOneFxOneType(null);
        break;
      case "reverb":
        setBusOneFxOneType(new Reverb({ wet: 1 }).toDestination());
        break;
      case "delay":
        setBusOneFxOneType(
          new FeedbackDelay({
            wet: 1,
          }).toDestination()
        );
        break;
      case "chorus":
        setBusOneFxOneType(
          new Chorus({
            frequency: 4,
            delayTime: 2.5,
            depth: 0.5,
            wet: 1,
          }).toDestination()
        );
        break;
      case "chebyshev":
        setBusOneFxOneType(
          new Chebyshev({
            wet: 1,
            order: 1,
          }).toDestination()
        );
        break;
      case "pitch-shift":
        setBusOneFxOneType(
          new PitchShift({
            pitch: 24,
            wet: 1,
          }).toDestination()
        );
        break;
      case "distortion":
        setBusOneFxOneType(
          new Distortion({
            distortion: 8,
            wet: 1,
          }).toDestination()
        );
        break;
      default:
        break;
    }
  }, [busOneFxOneChoice]);

  useEffect(() => {
    switch (busOneFxOneChoice) {
      case "delay":
        setBusOneFxOneControls(<Delay controls={busOneFxOneType} />);
        break;
      case "reverb":
        setBusOneFxOneControls(<Reverber controls={busOneFxOneType} />);
        break;
      case "chebyshev":
        setBusOneFxOneControls(<Chebyshever controls={busOneFxOneType} />);
        break;
      case "chorus":
        setBusOneFxOneControls(<Choruser controls={busOneFxOneType} />);
        break;
      default:
        break;
    }
  }, [busOneFxOneChoice, busOneFxOneType]);

  useEffect(() => {
    if (busOneFxOneChoice === "FX1") busOneFxOneType.disconnect();
    if (busOneFxOneType === null || busOneChannel.current === null) return;
    busOneChannel.current.connect(busOneFxOneType);
    return () => busOneFxOneType.disconnect();
  }, [busOneFxOneType, busOneFxOneChoice]);

  function toggleBusOne(e) {
    const id = parseInt(e.target.id.toString()[0], 10);
    for (let i = 0; i < tracks.length; i++) {
      temp[id] = e.target.checked;
      setTemp(temp);
      setBusOneActive(temp.find((item) => item === true));
      if (i === id) {
        if (e.target.checked) {
          busOneChannel.current = new Volume({ volume: -32 }).toDestination();
          channels.current[i].connect(busOneChannel.current);
        } else {
          busOneChannel.current.disconnect();
        }
      }
    }
  }

  // wait for the buffers to load
  return isLoaded === false ? (
    <div className="loader-wrap">
      <div className="logo-wrap">
        <img src="/remix.svg" alt="remix" width="500" />
      </div>
      <span>
        Loading: {song.artist} - {song.name}{" "}
      </span>
      <Loader />
    </div>
  ) : (
    <div className="console">
      <div className="header-wrap">
        <div className="logo-wrap">
          <img src="/remix.svg" alt="remix" width="600" />
          <p style={{ fontWeight: "bold" }}>version 0.0.0.0.1</p>
        </div>
        <div className="song-info">
          <p>Artist: {song.artist}</p>
          <p>Song:{song.name}</p>
          <p>Year:{song.year}</p>
          <p>Studio:{song.studio}</p>
          <p>Location:{song.location}</p>
        </div>
      </div>
      {busOneFxOneControls}
      <div className="mixer">
        {tracks.map((track, i) => {
          return (
            <ChannelStrip
              key={track.path}
              index={i}
              meterVal={meterVals[i]}
              channel={channels.current[i]}
              eq={eqs.current[i]}
              track={track}
              state={state}
              toggleBusOne={toggleBusOne}
            />
          );
        })}
        <Bus1
          state={state}
          busOneActive={busOneActive}
          busOneChannel={busOneChannel.current}
          handleSetBusOneFxOneChoice={handleSetBusOneFxOneChoice}
          busOneMeter={busOneMeter.current}
        />
        <MasterVol state={state} masterMeter={masterMeter.current} />
      </div>
      <div className="controls-wrap">
        <div className="controls-well">
          <Controls song={song} state={state} handleSetState={handleSetState} />
        </div>
      </div>
    </div>
  );
}

export default Mixer;
