import React, { useState } from "react";
import { db } from "../firebaseConfig"; // Adjust path as needed
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom"; // Import Link

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Query Firestore to find a user matching the email and password
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      // Check if the query returned a match
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ id: userId, ...user })
        );

        // Redirect based on user role
        if (user.role.trim() === "student") {
          alert("ברוך הבא תלמיד!");
          navigate("/studenthomepage");
        }  else {
          alert("Role is undefined. Please contact support.");
        }
      } else {
        // No match found in Firestore
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>התחברות תלמידים</h2>
      <input
        type="email"
        placeholder="מייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "10px" }}
      />
      <input
        type="password"
        placeholder="סיסמא"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "10px" }}
      />
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          marginTop: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        התחבר
      </button>

      {/* Small Title and Link */}
      <p style={{ marginTop: "20px", fontSize: "1rem" }}>
        אין לך חשבון?{" "}
        <Link
          to="/student-register"
          style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}
        >
          להרשמה
        </Link>
      </p>
    </div>
  );
}

export default Login;
