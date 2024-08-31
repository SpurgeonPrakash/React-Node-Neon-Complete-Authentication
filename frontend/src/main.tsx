import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";
import ThemeProvider from "./providers/ThemeProvider/ThemeProvider.tsx";
import ToastProvider from "./providers/Toast/ToastProvider.tsx";
import TanstackQueryProvider from "./providers/TanStackQueryProvider/TanStackQueryProvider.tsx";
import StoreProvider from "./providers/Redux/StoreProvider.tsx";
import AuthProvider from "./providers/Auth/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TanstackQueryProvider>
        <StoreProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </StoreProvider>
      </TanstackQueryProvider>
    </BrowserRouter>
  </StrictMode>
);
