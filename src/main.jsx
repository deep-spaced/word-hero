import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WordHero from "./WordHero.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WordHero />
  </StrictMode>
);
