import React, { useState } from "react";
import API from "../api"; // Make sure this points to your API config file
import { useNavigate } from "react-router-dom";

export default function Signup() {
  // State for form inputs
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to handle signup request
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send signup request to backend
      const res = await API.post("/signup", { name, username, password });

      // If successful, show popup and redirect to login
      alert("✅ Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      // Handle errors if signup fails
      alert(err.response?.data?.message || "Signup failed. Try again!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup}>
        {/* Name Field */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Username Field */}
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password Field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button type="submit">Sign Up</button>
      </form>

      {/* Redirect to Login link */}
      <p>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Login
        </span>
      </p>
    </div>
  );
}
