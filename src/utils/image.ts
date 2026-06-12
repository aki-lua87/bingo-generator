import { toPng } from "html-to-image";

/** 共有テキスト(メッセージ+URL)を組み立てる。Web Share APIのtext/urlとクリップボードコピーで共通利用する */
export function buildShareText(message: string, url: string): string {
  return `${message}\n${url}`;
}

async function elementToPngFile(element: HTMLElement, fileName: string): Promise<File> {
  const dataUrl = await toPng(element, { pixelRatio: 2 });
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], fileName, { type: "image/png" });
}

export async function exportElementAsImage(element: HTMLElement, fileName: string): Promise<void> {
  if (navigator.canShare && navigator.share) {
    try {
      const file = await elementToPngFile(element, fileName);
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }
    } catch {
      // フォールバックしてダウンロードする
    }
  }

  const dataUrl = await toPng(element, { pixelRatio: 2 });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

/** Web Share APIで画像とURLを共有する。共有した(またはユーザーがキャンセルした)場合はtrueを返す */
export async function shareResultWithImage(
  element: HTMLElement,
  fileName: string,
  url: string,
  message: string
): Promise<boolean> {
  if (!navigator.canShare || !navigator.share) return false;

  try {
    const file = await elementToPngFile(element, fileName);
    const shareDataWithImage = { files: [file], url, text: message };
    if (navigator.canShare(shareDataWithImage)) {
      await navigator.share(shareDataWithImage);
      return true;
    }

    // 画像付き共有に対応していない場合は、URL+テキストのみで共有する
    const shareDataTextOnly = { url, text: message };
    if (navigator.canShare(shareDataTextOnly)) {
      await navigator.share(shareDataTextOnly);
      return true;
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return true;
  }

  return false;
}
