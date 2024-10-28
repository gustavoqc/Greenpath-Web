import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Ensure BrowserRouter is imported
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.css";
import App from "./App";
import { ProvedorLoja } from "./Loja";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProvedorLoja>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ProvedorLoja>
    </BrowserRouter>
  </React.StrictMode>
);
