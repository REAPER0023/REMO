import { SettingsProvider } from "./context/SettingsContext";
import { StudyProvider } from "./context/StudyContext";

import "./App.css";

import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

function App() {
  return (
    <SettingsProvider>
      <StudyProvider>
        <Routes>

          <Route element={<MainLayout />}>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/chat"
              element={<Chat />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Routes>
      </StudyProvider>
    </SettingsProvider>
  );
}

export default App;