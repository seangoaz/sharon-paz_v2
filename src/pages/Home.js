import React from "react";
import { useNavigate } from "react-router-dom";
import sharonPhoto from "../assets/images/sharonPhoto.png"; // Replace with your image path

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "right" }}>
      {/* Title */}
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        ברוכים הבאים למרכז "שרון פז" בקריית ביאליק
      </h1>

      {/* Content Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Static Image */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={sharonPhoto}
            alt="שרון פז"
            style={{
              width: "200px",
              height: "auto",
              borderRadius: "8px",
              border: "2px solid #ccc",
            }}
          />
          <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "#666" }}>שרון פז ז"ל</p>
        </div>

        {/* Text and Buttons */}
        <div style={{ maxWidth: "600px", lineHeight: "1.6", color: "#555" }}>
          <p>
            במרכז שרון פז בית הספר לתנועה ומחול ובית ספר לאומניות הלחימה ניתן ללמוד את מגוון
            מקצועות התנועה והמחול: מקום איכותי ומקצועי, המדריכים מקצועיים וקבוצות עבודה קטנות.
            בין המקצועות ללימוד: מחול, ג'אז, קלאסי, לירי, היפ הופ ועוד.
          </p>
          <p>
            מרכז שרון פז נפתח לזכרה של הרקדנית שרון פז ז"ל. המרכז מנציח את דרכה של שרון
            וממשיך את חזונה למען קידום הרקדנים הצעירים.
          </p>

          {/* Buttons */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => navigate("/studentlogin")}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 20px",
                fontSize: "1rem",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              התחברות תלמידים
            </button>
            <button
              onClick={() => navigate("/adminlogin")}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 20px",
                fontSize: "1rem",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              התחברות מנהלים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
