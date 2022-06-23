import { useEffect, useCallback, useRef, useState } from "react";
import { Meter } from "tone";

function useMeter(channels) {
  const [meterVals, setMeterVals] = useState([]);
  const meters = useRef([]);

  const requestRef = useRef();
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
    channels.forEach((channel, i) => {
      meters.current[i] = new Meter();
      channel.connect(meters.current[i]);
    });

    requestAnimationFrame(animateMeter);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return meterVals;
}

export default useMeter;
