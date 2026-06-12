import { useRef, useState } from "react";
import { BingoGrid } from "../components/BingoGrid";
import { ColorPicker } from "../components/ColorPicker";
import { buildShareUrl } from "../utils/encode";
import { exportElementAsImage, shareResultWithImage } from "../utils/image";
import { BingoColors, CELL_COUNT, DEFAULT_CENTER_TEXT, DEFAULT_COLORS, DEFAULT_TITLE } from "../types";

export function CreatePage() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [cells, setCells] = useState<string[]>(() => Array(CELL_COUNT).fill(""));
  const [centerText, setCenterText] = useState(DEFAULT_CENTER_TEXT);
  const [colors, setColors] = useState<BingoColors>({ ...DEFAULT_COLORS });
  const [copied, setCopied] = useState(false);
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

    if (gridRef.current) {
      const shared = await shareResultWithImage(gridRef.current, "bingo.png", url, title);
      if (shared) return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
  };

  const handleExportImage = () => {
    if (gridRef.current) {
      void exportElementAsImage(gridRef.current, "bingo.png");
    }
  };

  return (
    <div className="page">
      <h1>実績ビンゴをつくる</h1>
      <p>各マスに実績を入力してください(中央はワイルドカードです)。</p>

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
        <button type="button" onClick={handleExportImage}>
          画像として保存
        </button>
      </div>
      {copied && <p className="copy-feedback">コピーしました</p>}
    </div>
  );
}
