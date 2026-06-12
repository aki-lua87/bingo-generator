import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import {
  BingoData,
  CELL_COUNT,
  DEFAULT_CENTER_TEXT,
  DEFAULT_COLORS,
  DEFAULT_TITLE,
  MAX_CELL_LENGTH,
  MAX_TITLE_LENGTH,
} from "../types";

const HEX_COLOR_RE = /^[0-9a-fA-F]{6}$/;

interface EncodedPayload {
  c: string[];
  t?: string; // title
  w?: string; // center(wild) text
  bg?: string;
  border?: string;
  text?: string;
  mark?: string;
  mk?: string; // marks ("0"/"1" を24文字、結果共有時のみ)
}

export function encodeBingoData(data: BingoData): string {
  const payload: EncodedPayload = {
    c: data.cells.map((c) => c.slice(0, MAX_CELL_LENGTH)),
  };
  if (data.title !== DEFAULT_TITLE) payload.t = data.title.slice(0, MAX_TITLE_LENGTH);
  if (data.centerText !== DEFAULT_CENTER_TEXT) payload.w = data.centerText.slice(0, MAX_CELL_LENGTH);
  if (data.colors.bg !== DEFAULT_COLORS.bg) payload.bg = data.colors.bg;
  if (data.colors.border !== DEFAULT_COLORS.border) payload.border = data.colors.border;
  if (data.colors.text !== DEFAULT_COLORS.text) payload.text = data.colors.text;
  if (data.colors.mark !== DEFAULT_COLORS.mark) payload.mark = data.colors.mark;
  if (data.marks) payload.mk = data.marks.map((m) => (m ? "1" : "0")).join("");

  return compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeBingoData(encoded: string): BingoData | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const payload = JSON.parse(json) as EncodedPayload;
    if (!Array.isArray(payload.c) || payload.c.length !== CELL_COUNT) return null;
    if (!payload.c.every((cell) => typeof cell === "string")) return null;

    const colors = {
      bg: payload.bg ?? DEFAULT_COLORS.bg,
      border: payload.border ?? DEFAULT_COLORS.border,
      text: payload.text ?? DEFAULT_COLORS.text,
      mark: payload.mark ?? DEFAULT_COLORS.mark,
    };
    if (![colors.bg, colors.border, colors.text, colors.mark].every((c) => HEX_COLOR_RE.test(c))) return null;

    let marks: boolean[] | undefined;
    if (typeof payload.mk === "string") {
      if (payload.mk.length !== CELL_COUNT || !/^[01]+$/.test(payload.mk)) return null;
      marks = payload.mk.split("").map((c) => c === "1");
    }

    return {
      title: payload.t ?? DEFAULT_TITLE,
      cells: payload.c,
      centerText: payload.w ?? DEFAULT_CENTER_TEXT,
      colors,
      marks,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(data: BingoData): string {
  const encoded = encodeBingoData(data);
  const url = new URL(window.location.href);
  url.hash = `d=${encoded}`;
  return url.toString();
}

export function readBingoDataFromHash(): BingoData | null | "empty" {
  const hash = window.location.hash;
  if (!hash || hash === "#") return "empty";

  const match = hash.match(/^#d=(.+)$/);
  if (!match) return "empty";

  return decodeBingoData(match[1]);
}
