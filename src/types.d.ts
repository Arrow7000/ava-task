export type Coords = { rowIndex: number; colIndex: number };

/**
 * (nested) map of all neighbours of a coloured cell.
 * List is empty if cell is not coloured.
 */
export interface AdjacentCellMap {
  [rowIndex: number]: { [colIndex: number]: Coords[] };
}
