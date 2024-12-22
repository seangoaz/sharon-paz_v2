import React from "react";
import { Link } from "react-router-dom";

function StudentHomePage() {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>מסך תלמיד</h1>
      <Link
        to="/register"
        style={{
          textDecoration: "none",
          color: "#007BFF",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        רישום לחוג
      </Link>
      <br />
      <Link
        to="/feedbackpage"
        style={{
          textDecoration: "none",
          color: "#FF5733",
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginTop: "20px",
          display: "inline-block",
        }}
      >
        הזן משוב על קורס
      </Link>
    </div>
  );
}

export default StudentHomePage;
