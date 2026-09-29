import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Apply saved admin theme before first render so Login / session screens
// don't flash dark while the rest of the admin is in day mode.
try {
  document.documentElement.setAttribute(
    "data-admin-theme",
    localStorage.getItem("admin-theme") || "dark"
  );
} catch {
  document.documentElement.setAttribute("data-admin-theme", "dark");
}
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);