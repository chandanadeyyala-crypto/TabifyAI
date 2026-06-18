import React, { useState } from "react";
import toast from "react-hot-toast"
function Signup({ setScreen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/signup", {
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
        toast.success("Account created successfully!");
        setScreen("login");
      } else {
        toast(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Signup failed");
    }
  };

  return (
    <div className="upload-card">
      <h2>Create Account</h2>

      <input type="email" placeholder="Email" value={email} onChange={(e) => 
        setEmail(e.target.value)}/>

      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <button className="upload-button" onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}

export default Signup;