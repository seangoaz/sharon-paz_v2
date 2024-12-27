import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";

function StudentCard({ user, onClose }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // עדכון השעה בזמן אמת
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // נקה את ה-interval
  }, []);

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
          <strong>שם:</strong> {user.firstName} {user.lastName}
        </p>
        <p style={{ textAlign: "right", margin: "10px 0" }}>
          <strong>מייל:</strong> {user.email}
        </p>
        <div style={{ margin: "20px 0" }}>
          <Barcode value={user.id} format="CODE128" width={2} height={50} />
        </div>
        <p style={{ textAlign: "right", margin: "10px 0" }}>
          <strong>מזהה:</strong> {user.id}
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
