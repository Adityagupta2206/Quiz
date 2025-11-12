import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuth } from "../auth";

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  if (!state) return <p>No results found.</p>;

  const { questions, selectedAnswers, newScore } = state;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Quiz Results</h2>
      <p>Your Score: <b>{newScore}</b></p>

      {questions.map((q, i) => {
        const isCorrect = selectedAnswers[i] === q.answer;
        return (
          <div key={i} style={{
            background: isCorrect ? "#d4edda" : "#f8d7da",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px"
          }}>
            <p><b>{i + 1}. {q.question}</b></p>
            <p>Your Answer: <b>{selectedAnswers[i] || "Not Answered"}</b></p>
            <p>Correct Answer: <b>{q.answer}</b></p>
          </div>
        );
      })}

      <button
        onClick={handleLogout}
        style={{
          background: "#d9534f",
          color: "white",
          border: "none",
          padding: "8px 15px",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "15px",
        }}
      >
        Logout
      </button>
    </div>
  );
}
