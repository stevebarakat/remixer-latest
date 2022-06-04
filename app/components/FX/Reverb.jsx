export default function Reverber({ controls }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="pre-delay">Pre Delay:</label>
        <input
          type="range"
          name="pre-delay"
          min={0}
          max={1}
          step={0.0001}
          onChange={(e) => {
            controls.preDelay = parseFloat(e.target.value);
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="decay">Decay:</label>
        <input
          type="range"
          name="decay"
          min={0.001}
          max={10}
          step={0.001}
          onChange={(e) => {
            // console.log(e.target.value);
            // console.log("controls.decay", controls);
            controls.decay = parseFloat(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
