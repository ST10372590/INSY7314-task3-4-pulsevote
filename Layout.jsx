import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children, user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear JWT token
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>

      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
};

export default Layout;
