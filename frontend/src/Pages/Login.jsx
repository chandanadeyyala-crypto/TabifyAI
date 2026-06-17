import React, { useState } from "react";

function Login({ setScreen, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (data.status === "success") {

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", email);

        setIsLoggedIn(true);

        alert("Login successful!");

        setScreen("upload");

      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div className="upload-card">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="upload-button"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}

export default Login;