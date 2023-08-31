import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuestionPage from "./pages/QuestionPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/question/:id" element={<QuestionPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
