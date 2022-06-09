import { useState, useEffect } from "react";
import {
  loaded,
  Player,
  EQ3,
  Channel,
  Meter,
  Reverb,
  Volume,
  Add,
  Chorus,
  Compressor,
  PitchShift,
  Chebyshev,
  FeedbackDelay,
  Transport as t,
  Destination,
} from "tone";

export default function useSetFx({ setBusOneFxOneType }) {
  const [busOneFxOneChoice, setBusOneFxOneChoice] = useState(null);

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
      case "compressor":
        setBusOneFxOneType(
          new Compressor({
            compressor: 8,
            wet: 1,
          }).toDestination()
        );
        break;
      default:
        break;
    }
  }, [busOneFxOneChoice, setBusOneFxOneType]);
}
