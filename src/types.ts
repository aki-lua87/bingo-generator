export const GRID_SIZE = 5;
export const CENTER_INDEX = 12;
export const CELL_COUNT = GRID_SIZE * GRID_SIZE - 1; // 24 (中央のワイルドカードを除く)
export const MARK_COUNT = GRID_SIZE * GRID_SIZE; // 25 (中央のワイルドカードを含む)
export const MAX_CELL_LENGTH = 30;
export const MAX_TITLE_LENGTH = 30;

export const DEFAULT_COLORS = {
  bg: "ffffff",
  border: "000000",
  text: "000000",
  mark: "ff0000",
} as const;

export const DEFAULT_TITLE = "実績ビンゴ";
export const DEFAULT_CENTER_TEXT = "Free";

export interface BingoColors {
  bg: string;
  border: string;
  text: string;
  mark: string;
}

export interface BingoData {
  title: string;
  cells: string[]; // length 24
  centerText: string;
  colors: BingoColors;
  marks?: boolean[]; // length 25 (グリッド位置順、中央を含む), プレイ結果共有時のみ使用
}

/** グリッド上の位置(0-24)からcells配列のインデックスを返す。中央(12)はnull */
export function gridIndexToCellIndex(gridIndex: number): number | null {
  if (gridIndex === CENTER_INDEX) return null;
  return gridIndex < CENTER_INDEX ? gridIndex : gridIndex - 1;
}

/** マスのテキスト長に応じて動的にフォントサイズを決める */
export function dynamicFontSize(text: string): string {
  const len = text.length;
  if (len <= 6) return "clamp(10px, 3.2vw, 18px)";
  if (len <= 12) return "clamp(9px, 2.6vw, 15px)";
  if (len <= 20) return "clamp(8px, 2vw, 12px)";
  return "clamp(7px, 1.6vw, 10px)";
}
