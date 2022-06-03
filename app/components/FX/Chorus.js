export default function Choruser({ controls }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="frequency">Frequency:</label>
        <input
          type="range"
          name="frequency"
          min={20}
          max={20000}
          step={10}
          onChange={(e) => {
            controls.frequency.value = parseFloat(e.target.value);
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="delay-time">Delay Time:</label>
        <input
          type="range"
          name="delay-time"
          min={0.001}
          max={10}
          step={0.001}
          onChange={(e) => {
            controls.delayTime = parseFloat(e.target.value);
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="depth">Depth:</label>
        <input
          type="range"
          name="depth"
          min={0}
          max={1}
          step={0.00001}
          onChange={(e) => {
            controls.depth = parseFloat(e.target.value);
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
