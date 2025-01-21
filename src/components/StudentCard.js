import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";

function StudentCard({ onClose }) {
  const [userData, setUserData] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // טוען את פרטי המשתמש המחובר מתוך localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUserData(loggedInUser); // שמירת נתוני המשתמש ב-state
    } else {
      console.error("No user data found. Please log in.");
    }
  }, []);

  // עדכון השעה בזמן אמת
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // נקה את ה-interval
  }, []);

  // אם אין נתוני משתמש, הצג הודעה מתאימה
  if (!userData) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#333" }}>
        <h3>טוען נתוני משתמש...</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "300px",
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>כרטיס תלמיד</h2>
        <p style={{ textAlign: "right", margin: "10px 0" }}>
          <strong>שם:</strong> {userData.firstName} {userData.lastName}
        </p>
        <p style={{ textAlign: "right", margin: "10px 0" }}>
          <strong style={{ float: "right", marginLeft: "5px" }}>מייל:</strong>
          <span style={{ direction: "rtl", display: "inline-block" }}>{userData.email}</span>
        </p>
        <div style={{ margin: "20px 0" }}>
          <Barcode value={userData.phoneNumber || "אין מספר טלפון"} format="CODE128" width={2} height={50} />
        </div>
        <p style={{ textAlign: "right", margin: "10px 0" }}>
          <strong>מספר טלפון:</strong> {userData.phoneNumber || "לא סופק"}
        </p>
        <p style={{ textAlign: "right", margin: "10px 0" }}>
          <strong>שעה:</strong> {time}
        </p>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          סגור
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
