import React, { useState } from "react";
import toast from "react-hot-toast"
function Login({ setScreen, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/login', {
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

        toast.success("Login successful!");

        setScreen("upload");

      } else {
        toast(data.message);
      }

    } catch (err) {
      console.log(err);
      toast.error("Login failed");
    }
  };

  return (
    <div className="upload-card">
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

      <button className="upload-button" onClick={handleLogin} >
        Login
      </button>
    </div>
  );
}

export default Login;