import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuestionPage from "./pages/QuestionPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import CreateQuestionPage from "./pages/CreateQuestionPage.tsx";
import UserContextProvider from "./contexts/UserContext.tsx";
import ProtectedRoute from "./routing/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginRegisterPage.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={{ colorScheme: "dark" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <BrowserRouter>
          <UserContextProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute />}>
                <Route element={<App />}>
                  <Route path="/questions" element={<LandingPage />} />
                  <Route path="/question/:id" element={<QuestionPage />} />
                  <Route path="/create" element={<CreateQuestionPage />} />
                </Route>
              </Route>
            </Routes>
          </UserContextProvider>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
