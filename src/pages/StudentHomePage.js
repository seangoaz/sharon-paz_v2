import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StudentCard from "../components/StudentCard"; // ייבוא רכיב כרטיס התלמיד

function StudentHomePage() {
  const [showCard, setShowCard] = useState(false);

  const handleShowCard = () => setShowCard(true);
  const handleCloseCard = () => setShowCard(false);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>מסך תלמיד</h1>

      {/* קישור לרישום לחוג */}
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

      {/* קישור להזנת משוב */}
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
      <br />

      {/* כפתור להצגת כרטיס התלמיד */}
      <Button
        variant="contained"
        startIcon={<CreditCardIcon />}
        onClick={handleShowCard}
        sx={{
          backgroundColor: "#4CAF50",
          color: "#fff",
          marginTop: "20px",
          fontWeight: "bold",
        }}
      >
        כרטיס תלמיד
      </Button>

      {/* כרטיס תלמיד */}
      {showCard && (
        <StudentCard
          user={{ id: "12345", email: "student@example.com" }} // נתוני משתמש לדוגמה
          onClose={handleCloseCard}
        />
      )}
    </div>
  );
}

export default StudentHomePage;
