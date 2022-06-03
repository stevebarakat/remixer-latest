function Delay({ controls }) {
  // console.log("controls", controls);
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
            // console.log(e.target.value);
            // console.log("controls.delayTime", controls.delayTime.value);
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
            // console.log(e.target.value);
            // console.log("controls.delayTime", controls.delayTime.value);
            controls.feedback.value = parseFloat(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default Delay;
