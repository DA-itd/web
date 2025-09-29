import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/react-app/index.css";
import App from "@/react-app/App.tsx";

// Handle GitHub Pages redirect from 404.html
if (sessionStorage.redirect) {
  history.replaceState(null, '', sessionStorage.redirect);
  delete sessionStorage.redirect;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
