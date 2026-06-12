import { useMemo } from "react";
import { CreatePage } from "./pages/CreatePage";
import { PlayPage } from "./pages/PlayPage";
import { ErrorView } from "./pages/ErrorView";
import { readBingoDataFromHash } from "./utils/encode";

export function App() {
  const parsed = useMemo(() => readBingoDataFromHash(), []);

  if (parsed === "empty") return <CreatePage />;
  if (parsed === null) return <ErrorView />;
  return <PlayPage data={parsed} />;
}
