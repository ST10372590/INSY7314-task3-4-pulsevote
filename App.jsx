import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LogoutPage from "./pages/LogoutPage";

function App() {
  const [user, setUser] = useState(null);

  // Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally decode JWT to get user info here
      setUser({ email: "user@example.com" }); 
    }
  }, []);

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<LogoutPage setUser={setUser} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
