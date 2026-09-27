import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import Home from "./app/page";
import "./app/globals.css";

const container = document.getElementById("root")!;
const initialView = window.location.pathname.replace(/\/+$/, "") === "/work" ? "work" : "home";
const app = (
  <StrictMode>
    <Home initialView={initialView} />
  </StrictMode>
);

// Production HTML is prerendered (see vite.vercel.config.ts): hydrate it.
// The dev server serves an empty #root, so render from scratch there.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
