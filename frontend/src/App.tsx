import { AppShell } from "@mantine/core";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <AppShell p="lg">
      <Outlet></Outlet>
    </AppShell>
  );
}

export default App;
