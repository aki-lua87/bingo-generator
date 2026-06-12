import { forwardRef, useEffect, useRef } from "react";
import { BingoColors, GRID_SIZE, MAX_CELL_LENGTH, MAX_TITLE_LENGTH, dynamicFontSize, gridIndexToCellIndex } from "../types";
import "./BingoGrid.css";

interface BingoGridProps {
  title: string;
  cells: string[]; // length 24
  centerText: string;
  colors: BingoColors;
  mode: "edit" | "play" | "result";
  marks?: boolean[]; // length 25 (グリッド位置順、中央を含む), play/resultモードのみ使用
  onTitleChange?: (value: string) => void;
  onCenterTextChange?: (value: string) => void;
  onCellChange?: (cellIndex: number, value: string) => void;
  onCellTap?: (gridIndex: number) => void;
}

// テキストの高さに合わせて自動でリサイズし、セル内で縦中央に表示されるようにする
function AutoResizeTextarea({
  value,
  style,
  maxLength,
  onChange,
}: {
  value: string;
  style: React.CSSProperties;
  maxLength: number;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, style.fontSize]);

  return (
    <textarea
      ref={ref}
      className="bingo-cell-input"
      style={style}
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export const BingoGrid = forwardRef<HTMLDivElement, BingoGridProps>(
  ({ title, cells, centerText, colors, mode, marks, onTitleChange, onCenterTextChange, onCellChange, onCellTap }, ref) => {
    const gridPositions = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

    return (
      <div
        ref={ref}
        className="bingo-board"
        style={{ backgroundColor: `#${colors.bg}`, color: `#${colors.text}` }}
      >
        {mode === "edit" ? (
          <input
            className="bingo-title-input"
            style={{ color: `#${colors.text}` }}
            value={title}
            maxLength={MAX_TITLE_LENGTH}
            onChange={(e) => onTitleChange?.(e.target.value)}
          />
        ) : (
          <h1 className="bingo-title">{title}</h1>
        )}

        <div className="bingo-grid" style={{ borderColor: `#${colors.border}` }}>
          {gridPositions.map((gridIndex) => {
            const cellIndex = gridIndexToCellIndex(gridIndex);

            const marked = marks?.[gridIndex] ?? false;

            if (cellIndex === null) {
              if (mode === "edit") {
                return (
                  <div key={gridIndex} className="bingo-cell bingo-cell-wild" style={{ borderColor: `#${colors.border}` }}>
                    <AutoResizeTextarea
                      value={centerText}
                      maxLength={MAX_CELL_LENGTH}
                      onChange={(v) => onCenterTextChange?.(v)}
                      style={{ color: `#${colors.text}`, fontSize: dynamicFontSize(centerText) }}
                    />
                  </div>
                );
              }
              return (
                <div
                  key={gridIndex}
                  className={mode === "play" ? "bingo-cell bingo-cell-wild bingo-cell-play" : "bingo-cell bingo-cell-wild"}
                  style={{ borderColor: `#${colors.border}` }}
                  onClick={mode === "play" ? () => onCellTap?.(gridIndex) : undefined}
                >
                  <span className="bingo-cell-text" style={{ fontSize: dynamicFontSize(centerText) }}>
                    {centerText}
                  </span>
                  {marked && (
                    <span
                      className="bingo-cell-mark"
                      style={{ borderColor: `#${colors.mark}`, backgroundColor: `#${colors.mark}` }}
                    />
                  )}
                </div>
              );
            }

            const value = cells[cellIndex] ?? "";

            if (mode === "edit") {
              return (
                <div key={gridIndex} className="bingo-cell" style={{ borderColor: `#${colors.border}` }}>
                  <AutoResizeTextarea
                    value={value}
                    maxLength={MAX_CELL_LENGTH}
                    onChange={(v) => onCellChange?.(cellIndex, v)}
                    style={{ color: `#${colors.text}`, fontSize: dynamicFontSize(value) }}
                  />
                </div>
              );
            }

            return (
              <div
                key={gridIndex}
                className={mode === "play" ? "bingo-cell bingo-cell-play" : "bingo-cell"}
                style={{ borderColor: `#${colors.border}` }}
                onClick={mode === "play" ? () => onCellTap?.(gridIndex) : undefined}
              >
                <span className="bingo-cell-text" style={{ fontSize: dynamicFontSize(value) }}>
                  {value}
                </span>
                {marked && <span className="bingo-cell-mark" style={{ borderColor: `#${colors.mark}` }} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

BingoGrid.displayName = "BingoGrid";
