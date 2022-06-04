import { FaForward } from "react-icons/fa";
import { Transport as t } from "tone";

function FastFwd({ song }) {
  function ff() {
    if (t.seconds > song.end - 10) {
      t.seconds = song.end;
    } else {
      t.set({ seconds: t.seconds + 10 });
    }
  }

  return (
    <button className="button" onClick={ff}>
      <FaForward />
    </button>
  );
}

export default FastFwd;
