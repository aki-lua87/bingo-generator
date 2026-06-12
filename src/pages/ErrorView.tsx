export function ErrorView() {
  const handleBackToTop = () => {
    window.location.hash = "";
    window.location.reload();
  };

  return (
    <div className="page">
      <h1>不正なパラメータです</h1>
      <p>URLが正しくない、または壊れています。</p>
      <button type="button" onClick={handleBackToTop}>
        トップへ戻る
      </button>
    </div>
  );
}
