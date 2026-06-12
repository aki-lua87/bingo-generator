import { BingoColors } from "../types";

interface ColorPickerProps {
  colors: BingoColors;
  onChange: (colors: BingoColors) => void;
}

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
  return (
    <div className="color-picker">
      <label>
        背景色
        <input
          type="color"
          value={`#${colors.bg}`}
          onChange={(e) => onChange({ ...colors, bg: e.target.value.slice(1) })}
        />
      </label>
      <label>
        枠線の色
        <input
          type="color"
          value={`#${colors.border}`}
          onChange={(e) => onChange({ ...colors, border: e.target.value.slice(1) })}
        />
      </label>
      <label>
        文字の色
        <input
          type="color"
          value={`#${colors.text}`}
          onChange={(e) => onChange({ ...colors, text: e.target.value.slice(1) })}
        />
      </label>
      <label>
        〇の色
        <input
          type="color"
          value={`#${colors.mark}`}
          onChange={(e) => onChange({ ...colors, mark: e.target.value.slice(1) })}
        />
      </label>
    </div>
  );
}
