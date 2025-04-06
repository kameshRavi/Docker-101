import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Questionnaire from "./Questionnaire";

export default function App() {

  const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "/quiz";
  }

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup onSignup={setUser} />} />
          <Route path="/quiz" element={<Questionnaire />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
  );
}
