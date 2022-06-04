import { FaForward } from "react-icons/fa";
import { Transport as t } from "tone";

function FastFwd({ startTime, startPosition, endPosition, currentTime }) {
  function ff() {
    if (t.seconds > endPosition - 10) {
      t.seconds = endPosition;
      t.position = endPosition;
    } else {
      t.set({ seconds: t.seconds + 10 });
    }
    console.log(t.seconds);
  }

  return (
    <button className="button" onClick={ff}>
      <FaForward />
    </button>
  );
}

export default FastFwd;
