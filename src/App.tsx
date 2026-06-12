import { useMemo } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CreatePage } from "./pages/CreatePage";
import { PlayPage } from "./pages/PlayPage";
import { ErrorView } from "./pages/ErrorView";
import { readBingoDataFromHash } from "./utils/encode";

export function App() {
  const parsed = useMemo(() => readBingoDataFromHash(), []);

  let content;
  if (parsed === "empty") content = <CreatePage />;
  else if (parsed === null) content = <ErrorView />;
  else content = <PlayPage data={parsed} />;

  return (
    <>
      <Header />
      {content}
      <Footer />
    </>
  );
}
