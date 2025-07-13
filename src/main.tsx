import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@/providers/global.provider.tsx";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers />
  </StrictMode>
);
