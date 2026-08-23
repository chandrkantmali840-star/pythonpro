import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppContext";
import App from "./App";
import "./index.css";

const origin = window.location.origin;
document
  .querySelector<HTMLLinkElement>("#canonical-url")
  ?.setAttribute("href", `${origin}/`);
document
  .querySelector<HTMLMetaElement>('meta[property="og:url"]')
  ?.setAttribute("content", `${origin}/`);
for (const selector of [
  'meta[property="og:image"]',
  'meta[name="twitter:image"]',
])
  document
    .querySelector<HTMLMetaElement>(selector)
    ?.setAttribute("content", `${origin}/assets/pythonpro-og.png`);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
