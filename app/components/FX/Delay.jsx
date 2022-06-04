function Delay({ controls }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="delay-time">Delay Time:</label>
        <input
          type="range"
          name="delay-time"
          min={0}
          max={1}
          step={0.0001}
          onChange={(e) => {
            controls.delayTime.value = parseFloat(e.target.value);
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="delay-feedback">Delay Feedback:</label>
        <input
          type="range"
          name="delay-feedback"
          min={0}
          max={1}
          step={0.0001}
          onChange={(e) => {
            controls.feedback.value = parseFloat(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default Delay;
