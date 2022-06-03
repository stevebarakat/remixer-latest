export default function PitchShifter({ controls }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="pitch">Pitch:</label>
        <input
          type="range"
          name="pitch"
          min={-60}
          max={60}
          step={1}
          onChange={(e) => {
            controls.pitch = parseFloat(e.target.value);
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="delay-time">Delay Time:</label>
        <input
          type="range"
          name="delay-time"
          min={0}
          max={1}
          step={0.00001}
          onChange={(e) => {
            controls.delayTime.value = parseFloat(e.target.value);
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="size">Size:</label>
        <input
          type="range"
          name="size"
          min={0.03}
          max={0.1}
          step={0.00001}
          onChange={(e) => {
            controls.windowSize = parseFloat(e.target.value);
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="feedback">Feedback:</label>
        <input
          type="range"
          name="feedback"
          min={0}
          max={1}
          step={0.00001}
          onChange={(e) => {
            controls.feedback.value = parseFloat(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
