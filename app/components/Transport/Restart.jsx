import { FaStepBackward } from "react-icons/fa";
import { Transport as t } from "tone";

function Restart({ song }) {
  function restart() {
    t.position = song.start;
  }

  return (
    <button className="button" onClick={restart}>
      <FaStepBackward />
    </button>
  );
}

export default Restart;
