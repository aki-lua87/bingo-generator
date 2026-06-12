import "./Footer.css";

export function Footer() {
  const handleGoToCreate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = "";
    window.location.reload();
  };

  return (
    <footer className="app-footer">
      <a href="./" onClick={handleGoToCreate}>
        ビンゴを作る
      </a>
      <a href="https://github.com/aki-lua87/bingo-generator" target="_blank" rel="noopener noreferrer">
        Github
      </a>
    </footer>
  );
}
