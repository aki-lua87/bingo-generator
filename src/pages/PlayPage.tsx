import { useRef, useState } from "react";
import { BingoGrid } from "../components/BingoGrid";
import { buildShareUrl } from "../utils/encode";
import { exportElementAsImage, shareResultWithImage } from "../utils/image";
import { BingoData, CELL_COUNT } from "../types";

interface PlayPageProps {
  data: BingoData;
}

export function PlayPage({ data }: PlayPageProps) {
  const isResult = !!data.marks;
  const [marks, setMarks] = useState<boolean[]>(() => data.marks ?? Array(CELL_COUNT).fill(false));
  const [copied, setCopied] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellTap = (cellIndex: number) => {
    setMarks((prev) => {
      const next = [...prev];
      next[cellIndex] = !next[cellIndex];
      return next;
    });
  };

  const handleExportImage = () => {
    if (gridRef.current) {
      void exportElementAsImage(gridRef.current, "bingo-result.png");
    }
  };

  const handleShareResult = async () => {
    const url = buildShareUrl({ ...data, marks });

    if (gridRef.current) {
      const shared = await shareResultWithImage(gridRef.current, "bingo-result.png", url, data.title);
      if (shared) return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <div className="page">
      <BingoGrid
        ref={gridRef}
        title={data.title}
        cells={data.cells}
        centerText={data.centerText}
        colors={data.colors}
        mode={isResult ? "result" : "play"}
        marks={marks}
        onCellTap={handleCellTap}
      />

      {!isResult && (
        <div className="actions">
          <button type="button" onClick={handleExportImage}>
            画像として保存
          </button>
          <button type="button" onClick={handleShareResult}>
            結果を共有
          </button>
        </div>
      )}
      {copied && <p className="copy-feedback">コピーしました</p>}
    </div>
  );
}
