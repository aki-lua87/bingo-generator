import { useRef, useState } from "react";
import { BingoGrid } from "../components/BingoGrid";
import { buildShareUrl } from "../utils/encode";
import { buildShareText, exportElementAsImage, isMobileDevice, shareResultWithImage } from "../utils/image";
import { BingoData, MARK_COUNT } from "../types";

interface PlayPageProps {
  data: BingoData;
}

export function PlayPage({ data }: PlayPageProps) {
  const isResult = !!data.marks;
  const [marks, setMarks] = useState<boolean[]>(() => data.marks ?? Array(MARK_COUNT).fill(false));
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellTap = (gridIndex: number) => {
    setMarks((prev) => {
      const next = [...prev];
      next[gridIndex] = !next[gridIndex];
      return next;
    });
  };

  const handlePlayThis = () => {
    const url = buildShareUrl({ ...data, marks: undefined });
    window.location.hash = new URL(url).hash;
    window.location.reload();
  };

  const handleOpenThisInNewTab = () => {
    const url = buildShareUrl({ ...data, marks: undefined });
    window.open(url, "_blank", "noopener");
  };

  const handleExportImage = () => {
    if (gridRef.current) {
      void exportElementAsImage(gridRef.current, "bingo-result.png");
    }
  };

  const handleShareResult = async () => {
    const url = buildShareUrl({ ...data, marks });
    const message = `${data.title}で遊んだよ！`;

    if (isMobileDevice()) {
      if (gridRef.current) {
        const shared = await shareResultWithImage(gridRef.current, "bingo-result.png", url, message);
        if (shared) return;
      }
      await navigator.clipboard.writeText(buildShareText(message, url));
      setCopyMessage("コピーしました");
      return;
    }

    await navigator.clipboard.writeText(buildShareText(message, url));
    setCopyMessage("コピーしました");
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

      {isResult ? (
        <div className="actions">
          <button type="button" onClick={handlePlayThis}>
            このビンゴで遊ぶ
          </button>
          <button type="button" onClick={handleOpenThisInNewTab}>
            このビンゴを別タブで開く
          </button>
        </div>
      ) : (
        <div className="actions">
          <button type="button" onClick={handleExportImage}>
            画像として保存
          </button>
          <button type="button" onClick={handleShareResult}>
            結果を共有
          </button>
        </div>
      )}
      {copyMessage && <p className="copy-feedback">{copyMessage}</p>}
    </div>
  );
}
