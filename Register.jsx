import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Validation functions
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError("Password must be at least 8 characters long and include letters and numbers.");
      return;
    }

    // Clear previous messages
    setError("");
    setMessage("");

    try {
      const res = await axios.post("/api/auth/register", { email, password });
      setMessage(res.data.message || "Registered successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default Register;
