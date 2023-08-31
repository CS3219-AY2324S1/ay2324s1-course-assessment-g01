import { AppShell, Header, Text } from "@mantine/core";
import "./App.css";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <AppShell
      p="lg"
      header={
        <Header p="xs" height={60}>
          <Text size={24} component={Link} to="/">Home</Text>
        </Header>
      }
    >
      <Outlet></Outlet>
    </AppShell>
  );
}

export default App;
