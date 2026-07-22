import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { AppBootstrap } from "./components/auth/AppBootstrap";
import { RequireAuth, RequireAuthOnly, RedirectIfAuthed } from "./components/auth/RouteGuards";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Onboarding } from "./pages/Onboarding";
import { Home } from "./pages/Home";
import { Customers } from "./pages/Customers";
import { Communications } from "./pages/Communications";
import { Marketing } from "./pages/Marketing";
import { Tasks } from "./pages/Tasks";
import { Files } from "./pages/Files";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <AppBootstrap>
      <BrowserRouter>
        <Routes>
          <Route element={<RedirectIfAuthed />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          <Route element={<RequireAuthOnly />}>
            <Route path="onboarding" element={<Onboarding />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route index element={<Home />} />
              <Route path="customers" element={<Customers />} />
              <Route path="communications" element={<Communications />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="files" element={<Files />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppBootstrap>
  );
}

export default App;
