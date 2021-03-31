import React, { useState } from "react";
import { makeMatrix, getCellNeighbours, makeMatrixDict } from "./helpers";
import "./styles.css";
import { AdjacentCellMap, Coords } from "./types";

const size = 35;

const getNeighbourMap = (matrix: number[][]): AdjacentCellMap => {
  const adjCellMap: AdjacentCellMap = makeMatrixDict(size, () => []);

  const activeCoords = makeMatrix(size, (rowIndex, colIndex) => ({
    rowIndex,
    colIndex,
  }))
    .flat()
    .filter(({ rowIndex, colIndex }) => matrix[rowIndex]?.[colIndex] === 1);

  const recordCellNeighboursInMap = (activeCoords: Coords) => {
    const markedCoords = makeMatrix(size, () => ({ marked: false }));
    adjCellMap[activeCoords.rowIndex][activeCoords.colIndex].push(activeCoords);

    const markCellNeighbours = (cell: Coords) => {
      const unmarkedNeighbours = getCellNeighbours(cell, size).filter(
        (neighbour) =>
          markedCoords[neighbour.rowIndex][neighbour.colIndex].marked === false
      );

      unmarkedNeighbours.forEach((neighbour) => {
        markedCoords[neighbour.rowIndex][neighbour.colIndex].marked = true;

        // is cell coloured
        if (matrix[neighbour.rowIndex][neighbour.colIndex] === 1) {
          adjCellMap[activeCoords.rowIndex][activeCoords.colIndex].push(
            neighbour
          );

          markCellNeighbours(neighbour);
        }
      });
    };

    markCellNeighbours(activeCoords);
  };

  activeCoords.forEach(recordCellNeighboursInMap);

  return adjCellMap;
};

const matrix = makeMatrix(size, () => Math.round(Math.random()));

const neighbourMap = getNeighbourMap(matrix);

export default function App() {
  const [activeCoord, setActiveCoord] = useState<Coords | null>(null);

  return (
    <div className="App">
      <table>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {row.map((num, j) => {
                const isContiguous =
                  activeCoord &&
                  neighbourMap[activeCoord.rowIndex]?.[
                    activeCoord.colIndex
                  ]?.filter(
                    ({ rowIndex, colIndex }) => rowIndex === i && colIndex === j
                  ).length > 0;

                return (
                  <td
                    onClick={() => {
                      setActiveCoord({ rowIndex: i, colIndex: j });
                    }}
                    key={j}
                    className={`${num === 1 ? "active" : ""} ${
                      isContiguous ? "is-contiguous" : ""
                    }`}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
