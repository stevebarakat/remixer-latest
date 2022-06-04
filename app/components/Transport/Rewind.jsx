import { FaBackward } from "react-icons/fa";
import { Transport as t } from "tone";

function Rewind({ song }) {
  function rew() {
    if (t.seconds < song.start) {
      t.seconds = song.start;
    } else {
      t.set({ seconds: t.seconds - 10 });
    }
  }

  return (
    <button className="button" onClick={rew}>
      <FaBackward />
    </button>
  );
}

export default Rewind;
