import { range, unionBy } from "lodash";

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

const projectCoords = ({ rowIndex, colIndex }: Coords) =>
  `${rowIndex}-${colIndex}`;

export const getNeighbourMap = (matrix: number[][]): AdjacentCellMap => {
  const size = matrix.length; // assuming square matrix

  const adjCellMap: AdjacentCellMap = makeMatrixDict(size, () => []);

  const activeCoords = makeMatrix(size, (rowIndex, colIndex) => ({
    rowIndex,
    colIndex,
  }))
    .flat()
    .filter(({ rowIndex, colIndex }) => matrix[rowIndex]?.[colIndex] === 1);

  const recordCellNeighboursInMap = (activeCoords: Coords) => {
    const markedCoords = makeMatrix(size, () => ({ marked: false }));

    // Add cell to be mapped to itself (otherwise soltary cells will show as 0)
    adjCellMap[activeCoords.rowIndex][activeCoords.colIndex] = unionBy(
      adjCellMap[activeCoords.rowIndex][activeCoords.colIndex],
      [activeCoords],
      projectCoords
    );

    const markCellNeighbours = (cell: Coords) => {
      const unmarkedNeighbours = getCellNeighbours(cell, size).filter(
        (neighbour) =>
          markedCoords[neighbour.rowIndex][neighbour.colIndex].marked === false
      );

      unmarkedNeighbours.forEach((neighbour) => {
        markedCoords[neighbour.rowIndex][neighbour.colIndex].marked = true;

        // Is cell coloured
        if (matrix[neighbour.rowIndex][neighbour.colIndex] === 1) {
          adjCellMap[activeCoords.rowIndex][activeCoords.colIndex] = unionBy(
            adjCellMap[activeCoords.rowIndex][activeCoords.colIndex],
            [neighbour],
            projectCoords
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

export const isActiveCell = (cellValue: 0 | 1) => cellValue === 1;
