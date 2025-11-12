import React, { useState, useEffect } from "react";
import API from "../api";
import { getAuth, clearAuth, updateLocalScore } from "../auth";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css"; // optional CSS file for hover effects

export default function UserDashboard() {
  const auth = getAuth();
  const { name, username } = auth;
  const [score, setScore] = useState(auth.score || 0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const navigate = useNavigate();

  // --- Quiz Questions ---
  const questions = [
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

  // --- Check cooldown ---
  useEffect(() => {
    const checkCooldown = async () => {
      try {
        const res = await API.get("/users");
        const currentUser = res.data.find(u => u.username === username);
        if (currentUser?.lastTestDate) {
          const diff = Date.now() - new Date(currentUser.lastTestDate).getTime();
          if (diff < 24 * 60 * 60 * 1000) setCooldown(true);
        }
      } catch (err) {
        const localLastTest = localStorage.getItem("lastTestTime");
        if (localLastTest) {
          const diff = Date.now() - parseInt(localLastTest);
          if (diff < 24 * 60 * 60 * 1000) setCooldown(true);
        }
      }
    };
    checkCooldown();
  }, [username]);

  // --- Logout ---
  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // --- Select Answer ---
  const handleAnswerSelect = (qIndex, option) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: option });
  };

  // --- Submit Quiz ---
  const handleSubmitQuiz = async () => {
    let newScore = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) newScore += 5;
    });

    setScore(newScore);
    setQuizSubmitted(true);
    setQuizStarted(false);
    localStorage.setItem("lastTestTime", Date.now());
    setCooldown(true);
    updateLocalScore(newScore);

    try {
      await API.post("/submit-quiz", { username, score: newScore });
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }

    alert(`✅ Quiz Submitted! You scored ${newScore} points.`);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome, {name}</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#d9534f",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Logout
        </button>
      </div>

      <p>Your Current Score: <b>{score}</b> points</p>

      {/* Start Quiz */}
      {!quizStarted && !quizSubmitted && (
        <div>
          <button
            onClick={() => setQuizStarted(true)}
            disabled={cooldown}
            style={{
              background: cooldown ? "gray" : "#0275d8",
              color: "white",
              border: "none",
              padding: "6px 15px",
              borderRadius: "4px",
              cursor: cooldown ? "not-allowed" : "pointer",
              fontSize: "13px",
            }}
          >
            {cooldown ? "Retest available after 24 hrs" : "Start Quiz"}
          </button>
        </div>
      )}

      {/* Quiz Questions */}
      {quizStarted && (
        <div style={{ marginTop: "20px" }}>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              <p style={{ fontWeight: "bold" }}>{i + 1}. {q.question}</p>
              {q.options.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAnswerSelect(i, option)}
                  style={{
                    margin: "5px 0",
                    padding: "10px",
                    borderRadius: "6px",
                    border: selectedAnswers[i] === option ? "2px solid #0275d8" : "1px solid #ccc",
                    background: selectedAnswers[i] === option ? "#d9edf7" : "#f9f9f9",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmitQuiz}
            style={{
              background: "#f0ad4e",
              color: "#333",
              border: "none",
              padding: "8px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "10px",
            }}
          >
            Submit Quiz
          </button>
        </div>
      )}

      {/* Result */}
      {quizSubmitted && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#5cb85c", fontWeight: "bold" }}>🎉 You scored <b>{score}</b> points.</p>
          <p style={{ color: "#0275d8" }}>Retest will unlock after 24 hours.</p>
        </div>
      )}
    </div>
  );
}
