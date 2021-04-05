import React, { useEffect, useMemo, useState } from "react";
import { makeMatrix, getNeighbourMap, isActiveCell } from "./helpers";
import "./styles.css";

export default function App() {
  const [clickedCoord, setClickedCoord] = useState<Coords | null>(null);
  const [hoveredCoord, setHoveredCoord] = useState<Coords | null>(null);

  const [activeColour, setActiveColour] = useState<string | null>(null);
  const [hoverColour, setHoverColour] = useState<string | null>(null);

  const [size, setSize] = useState(10);

  const matrix = useMemo(
    () => makeMatrix(size, () => Math.round(Math.random())),
    [size]
  );

  const neighbourMap = useMemo(() => getNeighbourMap(matrix), [matrix]);

  const root = document.documentElement;

  useEffect(() => {
    if (activeColour) {
      root.style.setProperty("--active-colour", activeColour);
    }
  }, [activeColour]);

  useEffect(() => {
    if (hoverColour) {
      root.style.setProperty("--hover-colour", hoverColour);
    }
  }, [hoverColour]);

  return (
    <div className="App">
      <input
        className="slider"
        min={5}
        max={25}
        step={1}
        type="range"
        value={size}
        onChange={(e) => setSize(+e.target.value)}
      />
      <div className="colour-pickers">
        <input
          className="colour-picker"
          type="color"
          onChange={(e) => setActiveColour(e.target.value)}
        />
        <label className="colour-picker-label">Active colour</label>
        <input
          className="colour-picker"
          type="color"
          onChange={(e) => setHoverColour(e.target.value)}
        />
        <label className="colour-picker-label">Hover colour</label>
      </div>
      <div className="table">
        {matrix.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => {
              const isClickedCoord =
                clickedCoord &&
                clickedCoord.rowIndex === i &&
                clickedCoord.colIndex === j;

              const isActive = isActiveCell(cell as 0 | 1);

              const hoverNeighbours =
                hoveredCoord &&
                neighbourMap[hoveredCoord.rowIndex]?.[hoveredCoord.colIndex];

              const isContiguous = hoverNeighbours
                ? hoverNeighbours.filter(
                    ({ rowIndex, colIndex }) => rowIndex === i && colIndex === j
                  ).length > 0
                : false;

              const clickNeighbours =
                clickedCoord &&
                neighbourMap[clickedCoord.rowIndex]?.[clickedCoord.colIndex];

              return (
                <div
                  onMouseEnter={() =>
                    setHoveredCoord({ rowIndex: i, colIndex: j })
                  }
                  onClick={() => setClickedCoord({ rowIndex: i, colIndex: j })}
                  key={j}
                  className={`cell ${isActive ? "active" : ""} ${
                    hoveredCoord && isActive && isContiguous
                      ? "is-contiguous"
                      : ""
                  }`}
                >
                  {isClickedCoord && isActive && clickNeighbours
                    ? clickNeighbours.length
                    : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
