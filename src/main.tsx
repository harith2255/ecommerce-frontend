
import ReactDom from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import React from "react";


ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <BrowserRouter>
<AuthProvider>
<CartProvider>
  <App/>
</CartProvider>
</AuthProvider>
</BrowserRouter>
</React.StrictMode>
);
  