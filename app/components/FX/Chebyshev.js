export default function Chebyshever({ controls }) {
  // console.log("controls", controls);
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="order">Order:</label>
        <input
          type="range"
          name="order"
          min={1}
          max={100}
          step={1}
          onChange={(e) => {
            controls.order = parseFloat(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
