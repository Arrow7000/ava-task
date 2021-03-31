import { range } from "lodash";
import { Coords } from "./types";

export const makeMatrix = <T>(
  size: number,
  fill: (r: number, c: number) => T
) => range(size).map((_, r) => range(size).map((__, c) => fill(r, c)));

export const makeMatrixDict = <T>(
  size: number,
  fill: (r: number, c: number) => T
) => {
  const obj: { [r: number]: { [c: number]: T } } = {};

  let i = 0,
    j = 0;

  while (i < size) {
    obj[i] = {};
    while (j < size) {
      obj[i][j] = fill(i, j);
      j++;
    }
    j = 0;
    i++;
  }

  return obj;
};

export const getCellNeighbours = (
  cell: Coords,
  matrixSize: number
): Coords[] => {
  const cells: Coords[] = [];

  const { rowIndex, colIndex } = cell;

  if (rowIndex > 0) {
    cells.push({ rowIndex: rowIndex - 1, colIndex });
  }
  if (rowIndex < matrixSize - 1) {
    cells.push({ rowIndex: rowIndex + 1, colIndex });
  }

  if (colIndex > 0) {
    cells.push({ colIndex: colIndex - 1, rowIndex });
  }
  if (colIndex < matrixSize - 1) {
    cells.push({ colIndex: colIndex + 1, rowIndex });
  }

  return cells;
};
