import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Soldiers from "./pages/Soldiers";
import Upload from "./pages/Upload";
import Alerts from "./pages/Alerts";
import Chat from "./pages/Chat";
import Unauthorized from "./pages/Unauthorized";
import SoldierProfile from "./pages/SoldierProfile";

import MedicPanel from "./pages/MedicPanel";
import MedicAddSoldier from "./pages/MedicAddSoldier";
import MedicAddHealth from "./pages/MedicAddHealth";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ===== Public Routes ===== */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ===== Protected Routes ===== */}
          <Route element={<Layout />}>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "COMMANDER", "MEDIC"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Soldiers List */}
            <Route
              path="/soldiers"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "COMMANDER"]}>
                  <Soldiers />
                </ProtectedRoute>
              }
            />

            {/* Digital Twin */}
            <Route
              path="/soldiers/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "COMMANDER", "MEDIC"]}>
                  <SoldierProfile />
                </ProtectedRoute>
              }
            />

            {/* Upload */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Upload />
                </ProtectedRoute>
              }
            />

            {/* Alerts */}
            <Route
              path="/alerts"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "COMMANDER", "MEDIC"]}>
                  <Alerts />
                </ProtectedRoute>
              }
            />

            {/* Chat */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "COMMANDER", "MEDIC"]}>
                  <Chat />
                </ProtectedRoute>
              }
            />

            {/* 👨‍⚕️ Medic Panel */}
            <Route
              path="/medic"
              element={
                <ProtectedRoute allowedRoles={["MEDIC"]}>
                  <MedicPanel />
                </ProtectedRoute>
              }
            />

            {/* 👨‍⚕️ Medic - Add Soldier */}
            <Route
              path="/medic/add-soldier"
              element={
                <ProtectedRoute allowedRoles={["MEDIC"]}>
                  <MedicAddSoldier />
                </ProtectedRoute>
              }
            />

            {/* 👨‍⚕️ Medic - Add Health */}
            <Route
              path="/medic/add-health"
              element={
                <ProtectedRoute allowedRoles={["MEDIC"]}>
                  <MedicAddHealth />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
