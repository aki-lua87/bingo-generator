import { useRef, useState } from "react";
import { BingoGrid } from "../components/BingoGrid";
import { ColorPicker } from "../components/ColorPicker";
import { buildShareUrl } from "../utils/encode";
import { buildShareText, exportElementAsImage, isMobileDevice, shareResultWithImage } from "../utils/image";
import { BingoColors, CELL_COUNT, DEFAULT_CENTER_TEXT, DEFAULT_COLORS, DEFAULT_TITLE } from "../types";

export function CreatePage() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [cells, setCells] = useState<string[]>(() => Array(CELL_COUNT).fill(""));
  const [centerText, setCenterText] = useState(DEFAULT_CENTER_TEXT);
  const [colors, setColors] = useState<BingoColors>({ ...DEFAULT_COLORS });
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellChange = (cellIndex: number, value: string) => {
    setCells((prev) => {
      const next = [...prev];
      next[cellIndex] = value;
      return next;
    });
  };

  const handleShareLink = async () => {
    const url = buildShareUrl({ title, cells, centerText, colors });
    const message = `${title}で遊んでみよう！`;

    if (isMobileDevice()) {
      if (gridRef.current) {
        const shared = await shareResultWithImage(gridRef.current, "bingo.png", url, message);
        if (shared) return;
      }
      await navigator.clipboard.writeText(buildShareText(message, url));
      setCopyMessage("コピーしました");
      return;
    }

    await navigator.clipboard.writeText(buildShareText(message, url));
    setCopyMessage("コピーしました");
  };

  const handleExportImage = () => {
    if (gridRef.current) {
      void exportElementAsImage(gridRef.current, "bingo.png");
    }
  };

  const handleOpenBingo = () => {
    const url = buildShareUrl({ title, cells, centerText, colors });
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="page">
      <h1>ビンゴをつくる</h1>
      <BingoGrid
        ref={gridRef}
        title={title}
        cells={cells}
        centerText={centerText}
        colors={colors}
        mode="edit"
        onTitleChange={setTitle}
        onCenterTextChange={setCenterText}
        onCellChange={handleCellChange}
      />

      <ColorPicker colors={colors} onChange={setColors} />

      <div className="actions">
        <button type="button" onClick={handleShareLink}>
          ビンゴを共有
        </button>
        <button type="button" onClick={handleOpenBingo}>
          ビンゴを表示する
        </button>
        <button type="button" onClick={handleExportImage}>
          画像として保存
        </button>
      </div>
      {copyMessage && <p className="copy-feedback">{copyMessage}</p>}
    </div>
  );
}
