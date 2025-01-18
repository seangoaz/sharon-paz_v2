import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FeedbackIcon from "@mui/icons-material/Feedback";
import EventNoteIcon from "@mui/icons-material/EventNote";
import StudentCard from "../components/StudentCard";

function StudentHomePage() {
  const [showCard, setShowCard] = useState(false);

  const handleShowCard = () => setShowCard(true);
  const handleCloseCard = () => setShowCard(false);

  return (
    <Box
      sx={{
        textAlign: "center",
        marginTop: "20px",
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        backgroundColor: "#f7f9fc",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: "bold",
          color: "#2C3E50",
          marginBottom: "20px",
        }}
      >
ברוכים הבאים למרכז שרון פז
      </Typography>

      {/* Buttons Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* רישום לחוג */}
        <Button
          component={Link}
          to="/register"
          variant="contained"
          startIcon={<EventNoteIcon />}
          sx={{
            backgroundColor: "#A3D5FF",
            color: "#2C3E50",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#87C3F8",
            },
          }}
        >
          רישום לחוג
        </Button>

        {/* הזנת משוב */}
        <Button
          component={Link}
          to="/feedbackpage"
          variant="contained"
          startIcon={<FeedbackIcon />}
          sx={{
            backgroundColor: "#FFCBA3",
            color: "#2C3E50",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#FFB98A",
            },
          }}
        >
          הזן משוב על קורס
        </Button>

        {/* כפתור להצגת כרטיס תלמיד */}
        <Button
          variant="contained"
          startIcon={<CreditCardIcon />}
          onClick={handleShowCard}
          sx={{
            backgroundColor: "#A3E4D7",
            color: "#2C3E50",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#8FDCCC",
            },
          }}
        >
          כרטיס תלמיד
        </Button>
      </Box>

      {/* כרטיס תלמיד */}
      {showCard && (
        <StudentCard
          user={{ id: "12345", email: "student@example.com" }} // נתוני משתמש לדוגמה
          onClose={handleCloseCard}
        />
      )}
    </Box>
  );
}

export default StudentHomePage;
