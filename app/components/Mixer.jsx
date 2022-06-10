import { useState, useEffect, useRef, useCallback } from "react";
import {
  loaded,
  Player,
  EQ3,
  Channel,
  Meter,
  Reverb,
  Chorus,
  Compressor,
  PitchShift,
  Chebyshev,
  FeedbackDelay,
  Transport as t,
  Destination,
  Volume,
} from "tone";
import Controls from "./Transport/Controls";
import Delay from "./FX/Delay";
import Reverber from "./FX/Reverb";
import Choruser from "./FX/Chorus";
import PitchShifter from "./FX/PitchShift";
import Compress from "./FX/Compressor";
import MasterVol from "./Channels/MasterVol";
import Bus1 from "./Channels/Bus1";
import ChannelStrip from "./Channels/ChannelStrips";
import Loader from "./Loader";
import Chebyshever from "./FX/Chebyshev";

function Mixer({ song }) {
  const tracks = song.tracks;
  const requestRef = useRef();
  const channels = useRef([]);
  const players = useRef([]);
  const choices = useRef([]);
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
  const [busOneFxTwoType, setBusOneFxTwoType] = useState(null);
  const [busOneFxTwoChoice, setBusOneFxTwoChoice] = useState(null);
  const handleSetBusOneFxTwoChoice = (value) => setBusOneFxTwoChoice(value);
  const [state, setState] = useState("stopped");
  const handleSetState = (value) => setState(value);
  const [busOneActive, setBusOneActive] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [busOneFxOneControls, setBusOneFxOneControls] = useState(null);
  const [busOneFxTwoControls, setBusOneFxTwoControls] = useState(null);

  // make sure song stops at end
  if (t.seconds > song.end) {
    t.seconds = song.end;
    t.stop();
    setState("stopped");
  }
  // make sure song doesn't rewind past start position
  if (t.seconds < 0) {
    t.seconds = song.start;
  }
  useEffect(() => {
    // create audio nodes
    masterMeter.current = new Meter();
    busOneMeter.current = new Meter();

    busOneChannel.current = new Volume().toDestination();

    for (let i = 0; i < tracks.length; i++) {
      channels.current.push(
        new Channel(tracks[i].volume, tracks[i].pan).connect(Destination)
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
    requestAnimationFrame(animateMeter);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // when busOneFxOneChoice is selected it initiates new FX
  choices.current = [busOneFxOneChoice, busOneFxTwoChoice];
  useEffect(() => {
    choices.current.forEach((choice, index) => {
      const i = index + 1;
      switch (choice) {
        case "fx1":
        case "fx2":
          break;
        case "reverb":
          i === 1 && setBusOneFxOneType(new Reverb({ wet: 1 }).toDestination());
          i === 2 && setBusOneFxTwoType(new Reverb({ wet: 1 }).toDestination());
          break;
        case "delay":
          i === 1 &&
            setBusOneFxOneType(
              new FeedbackDelay({
                wet: 1,
              }).toDestination()
            );
          i === 2 &&
            setBusOneFxTwoType(
              new FeedbackDelay({
                wet: 1,
              }).toDestination()
            );
          break;
        case "chorus":
          i === 1 &&
            setBusOneFxOneType(
              new Chorus({
                wet: 1,
              }).toDestination()
            );
          i === 2 &&
            setBusOneFxTwoType(
              new Chorus({
                wet: 1,
              }).toDestination()
            );
          break;
        case "chebyshev":
          i === 1 &&
            setBusOneFxOneType(
              new Chebyshev({
                wet: 1,
              }).toDestination()
            );
          i === 2 &&
            setBusOneFxTwoType(
              new Chebyshev({
                wet: 1,
              }).toDestination()
            );
          break;
        case "pitch-shift":
          i === 1 &&
            setBusOneFxOneType(
              new PitchShift({
                wet: 1,
              }).toDestination()
            );
          i === 2 &&
            setBusOneFxTwoType(
              new PitchShift({
                wet: 1,
              }).toDestination()
            );
          break;
        case "compressor":
          i === 1 &&
            setBusOneFxOneType(
              new Compressor({
                wet: 1,
              }).toDestination()
            );
          i == 2 &&
            setBusOneFxTwoType(
              new Compressor({
                wet: 1,
              }).toDestination()
            );
          break;
        default:
          break;
      }
    });
  }, [busOneFxOneChoice, busOneFxTwoChoice]);

  useEffect(() => {
    choices.current.forEach((choice, index) => {
      const i = index + 1;
      switch (choice) {
        case "fx1":
          setBusOneFxOneControls(null);
          break;
        case "fx2":
          setBusOneFxTwoControls(null);
        case "delay":
          i === 1 &&
            setBusOneFxOneControls(<Delay controls={busOneFxOneType} />);
          i === 2 &&
            setBusOneFxTwoControls(<Delay controls={busOneFxTwoType} />);
          break;
        case "reverb":
          i === 1 &&
            setBusOneFxOneControls(<Reverber controls={busOneFxOneType} />);
          i === 2 &&
            setBusOneFxTwoControls(<Reverber controls={busOneFxTwoType} />);
          break;
        case "chebyshev":
          i === 1 &&
            setBusOneFxOneControls(<Chebyshever controls={busOneFxOneType} />);
          i === 2 &&
            setBusOneFxTwoControls(<Chebyshever controls={busOneFxTwoType} />);
          break;
        case "pitch-shift":
          i === 1 &&
            setBusOneFxOneControls(<PitchShifter controls={busOneFxOneType} />);
          i === 2 &&
            setBusOneFxTwoControls(<PitchShifter controls={busOneFxTwoType} />);
          break;
        case "chorus":
          i === 1 &&
            setBusOneFxOneControls(<Choruser controls={busOneFxOneType} />);
          i === 2 &&
            setBusOneFxTwoControls(<Choruser controls={busOneFxTwoType} />);
          break;
        case "compressor":
          i === 1 &&
            setBusOneFxOneControls(<Compress controls={busOneFxOneType} />);
          i === 2 &&
            setBusOneFxTwoControls(<Compress controls={busOneFxTwoType} />);
          break;
        default:
          break;
      }
    });
  }, [busOneFxOneChoice, busOneFxOneType, busOneFxTwoChoice, busOneFxTwoType]);

  useEffect(() => {
    console.log(busOneFxOneChoice);
    if (busOneFxOneChoice === "fx1") busOneFxOneType.disconnect();
    if (busOneFxOneType === null || busOneChannel.current === null) return;
    busOneChannel.current.connect(busOneFxOneType);
    return () => busOneFxOneType.disconnect();
  }, [busOneFxOneType, busOneFxOneChoice]);

  useEffect(() => {
    if (busOneFxTwoChoice === "fx2") busOneFxTwoType.disconnect();
    if (busOneFxTwoType === null || busOneChannel.current === null) return;
    busOneChannel.current.connect(busOneFxTwoType);
    return () => busOneFxTwoType.disconnect();
  }, [busOneFxTwoType, busOneFxTwoChoice]);

  function toggleBusOne(e) {
    const id = parseInt(e.target.id[0], 10);
    channels.current.forEach((channel, i) => {
      if (id === i) {
        if (e.target.checked) {
          busOneActive[id] = true;
          setBusOneActive(busOneActive);
          channels.current[id].disconnect(Destination);
          channels.current[id].connect(busOneChannel.current);
        } else {
          busOneActive[id] = false;
          setBusOneActive(busOneActive);
          channels.current[id].disconnect(busOneChannel.current);
          channels.current[id].connect(Destination);
        }
      }
    });
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
      {busOneFxTwoControls}
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
              tracks={tracks}
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
          handleSetBusOneFxTwoChoice={handleSetBusOneFxTwoChoice}
          busOneMeter={busOneMeter.current}
        />
        <MasterVol
          state={state}
          masterMeter={masterMeter.current}
          // masterBusChannel={masterBusChannel.current}
        />
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
