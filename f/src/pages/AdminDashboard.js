import React, { useEffect, useState } from "react";
import API from "../api";
import { clearAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Sample quiz questions with answers
  const quizQuestions = [
    { question: "Which protocol finds MAC from IP?", answer: "ARP" },
    { question: "Which OSI layer handles routing?", answer: "Network" },
    { question: "Default HTTP port?", answer: "80" },
    { question: "Device at Layer 2?", answer: "Switch" },
    { question: "Command for IP info (Windows)?", answer: "ipconfig" },
    { question: "DHCP stands for?", answer: "Dynamic Host Configuration Protocol" },
    { question: "Private IP address?", answer: "192.168.1.1" },
    { question: "Command to test connectivity?", answer: "ping" },
    { question: "IPv6 has how many bits?", answer: "128" },
    { question: "Which layer ensures delivery?", answer: "Transport" },
  ];

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>👑 Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#d9534f",
            color: "white",
            border: "none",
            padding: "5px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Logout
        </button>
      </div>

      <h3>Registered Users</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginBottom: "30px" }}>
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3">No users yet</td>
            </tr>
          ) : (
            users.map((user, i) => (
              <tr key={i}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.score}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>Quiz Questions & Answers</h3>
      <div>
        {quizQuestions.map((q, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p style={{ fontWeight: "bold" }}>
              {idx + 1}. {q.question}
            </p>
            <p style={{ color: "#0275d8", fontWeight: "bold" }}>Answer: {q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
