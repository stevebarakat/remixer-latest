import { Transport as t } from "tone";
import Restart from "./Restart";
import Rewind from "./Rewind";
import FastFwd from "./FastFwd";
import Play from "./Play";
import { formatMilliseconds } from "~/utils/formatTime";

function Controls({ song, state, handleSetState }) {
  return (
    <>
      <div className="buttons-wrap">
        <Restart song={song} />
        <Rewind song={song} />
        <Play song={song} state={state} handleSetState={handleSetState} />
        <FastFwd song={song} />
      </div>
      <div className="clock">
        <div className="ghost">88:88:88</div>
        {formatMilliseconds(t.seconds)}
      </div>
    </>
  );
}

export default Controls;
