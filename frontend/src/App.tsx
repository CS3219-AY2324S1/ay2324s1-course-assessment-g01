import { AppShell } from "@mantine/core";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <AppShell>
      <Outlet></Outlet>
    </AppShell>
  );
}

export default App;
