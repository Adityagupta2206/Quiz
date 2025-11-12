import React, { useEffect, useState } from "react";
import API from "../api";
import { clearAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Sample quiz questions with answers
  const quizQuestions = [
    { question: "What is the loopback IPv4 address?", options: ["0.0.0.0", "255.255.255.0", "127.0.0.1", "192.168.1.1"], answer: "127.0.0.1" },
    { question: "Which IPv4 address is a private address?", options: ["8.8.8.8", "10.1.1.1", "172.32.0.1", "192.169.1.1"], answer: "10.1.1.1" },
    { question: "What is the purpose of VTP?", options: ["To prioritize voice traffic", "To encrypt trunk links", "To synchronize VLAN databases", "To tunnel VPN traffic"], answer: "To synchronize VLAN databases" },
    { question: "What is the correct order of the OSI model layers?", options: ["Physical, Data Link, Network, Transport, Session, Presentation, Application", "Application, Presentation, Session, Transport, Network, Data Link, Physical", "Physical, Network, Data Link, Transport, Session, Presentation, Application", "Physical, Data Link, Transport, Network, Session, Presentation, Application"], answer: "Application, Presentation, Session, Transport, Network, Data Link, Physical" },
    { question: "What is a socket?", options: ["IP + MAC", "Subnet + Gateway", "IP + Port", "MAC + Port"], answer: "IP + Port" },
    { question: "Which IPv4 address is APIPA-assigned?", options: ["10.0.0.1", "172.16.0.1", "169.254.1.1", "192.168.1.5"], answer: "169.254.1.1" },
    { question: "What is the IEEE standard for Ethernet?", options: ["802.1Q", "802.11", "802.1X", "802.3"], answer: "802.3" },
    { question: "Which layer encapsulates segments into packets?", options: ["Physical", "Network", "Data Link", "Transport"], answer: "Network" },
    { question: "What is the purpose of an IP helper address?", options: ["To resolve ARP requests", "To forward DHCP broadcasts", "To load balance DNS", "To tunnel VPN traffic"], answer: "To forward DHCP broadcasts" },
    { question: "What does a switch do when it receives a frame with an unknown destination MAC address?", options: ["Sends an ICMP error message", "Drops the frame", "Floods the frame to all ports except the ingress port", "Forwards the frame to the default gateway"], answer: "Floods the frame to all ports except the ingress port" },
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
