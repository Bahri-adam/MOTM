import React, { useState } from "react";
import "./App.css";

function App() {
  const [bedrooms, setBedrooms] = useState(1);
  const [squareFootage, setSquareFootage] = useState(0);
  const [yearsLived, setYearsLived] = useState(1);
  const [belongings, setBelongings] = useState("average");
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bedrooms,
        squareFootage,
        yearsLived,
        belongings,
      }),
    });

    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="App">
      <h1>Moving Box Estimation</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Number of Bedrooms:
          <input
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(Number(e.target.value))}
            min="1"
            required
          />
        </label>
        <label>
          Square Footage:
          <input
            type="number"
            value={squareFootage}
            onChange={(e) => setSquareFootage(Number(e.target.value))}
            min="0"
            required
          />
        </label>
        <label>
          Years Lived:
          <input
            type="number"
            value={yearsLived}
            onChange={(e) => setYearsLived(Number(e.target.value))}
            min="1"
            required
          />
        </label>
        <label>
          Amount of Belongings:
          <select
            value={belongings}
            onChange={(e) => setBelongings(e.target.value)}
          >
            <option value="little">Little</option>
            <option value="average">Average</option>
            <option value="lot">A Lot</option>
          </select>
        </label>
        <button type="submit">Calculate</button>
      </form>

      {results && (
        <div className="results">
          <h2>Estimation Results</h2>
          <p>Total Boxes: {results.totalBoxes}</p>
          <p>Total Cost: ${results.totalCost.toFixed(2)}</p>
          <h3>Box Breakdown:</h3>
          <ul>
            {Object.entries(results.boxes).map(([type, count]) => (
              <li key={type}>
                {type}: {count}
              </li>
            ))}
          </ul>
          <h3>Additional Items:</h3>
          <ul>
            {Object.entries(results.additionalItems).map(([item, count]) => (
              <li key={item}>
                {item}: {count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
