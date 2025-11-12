// auth.js

// Save user authentication data
export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("username", data.username);
  localStorage.setItem("name", data.name);
  if (data.score !== undefined) {
    localStorage.setItem("score", data.score);
  }
};

// Get saved auth data
export const getAuth = () => {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username"),
    name: localStorage.getItem("name"),
    score: parseInt(localStorage.getItem("score")) || 0,
  };
};

// Update score in localStorage when quiz is completed
export const updateLocalScore = (newScore) => {
  localStorage.setItem("score", newScore);
};

// Clear all user data (logout)
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("name");
  localStorage.removeItem("score");
};
