# Bingo Generator

オリジナルの実績ビンゴを作成して、URLで共有できるWebアプリです。

## 特徴

- 5x5のビンゴカードを自由に作成（中央はワイルドカード）
- タイトル・各マスの文言・中央マスの文言を編集可能
- 背景色・枠線色・文字色・マーク色をカスタマイズ
- 作成したビンゴをURLで共有（データはURLハッシュにエンコードされ、サーバー不要）
- ビンゴをタップして実績をマークし、結果を画像として保存・共有
- スマホでは画像付きでネイティブ共有（Web Share API）に対応

## 使い方

1. 「ビンゴをつくる」ページでタイトル・マス・色を設定
2. 「ビンゴを共有」または「ビンゴを表示する」でビンゴを公開
3. 公開されたビンゴでマスをタップして実績を記録
4. 「結果を共有」で達成状況を画像付きで共有

## 開発

```bash
npm install
npm run dev
```

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

## 技術構成

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [lz-string](https://github.com/pieroxy/lz-string) — ビンゴデータをURLハッシュに圧縮エンコード
- [html-to-image](https://github.com/bubkoo/html-to-image) — ビンゴカードを画像として書き出し

## デプロイ

`main` ブランチへのpushで GitHub Actions ([deploy.yml](.github/workflows/deploy.yml)) が実行され、GitHub Pages に自動デプロイされます。
