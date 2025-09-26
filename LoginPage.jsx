import React from "react";
import Login from "../components/Login";

const LoginPage = ({ setUser }) => {
  return (
    <div>
      <h1>Login Page</h1>
      <Login setUser={setUser} />
    </div>
  );
};

export default LoginPage;
