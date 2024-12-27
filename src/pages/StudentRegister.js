import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // לשימוש בניווט
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import emailjs from "@emailjs/browser";

function StudentRegister() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "",
    gender: "",
    address: "",
  });

  const navigate = useNavigate(); // הפונקציה לניווט

  const sendWelcomeEmail = async (email) => {
    console.log("Service ID:", process.env.REACT_APP_EMAILJS_SERVICE_ID);
    console.log("Template ID:", process.env.REACT_APP_EMAILJS_TEMPLATE_ID);
    console.log("Public Key:", process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        { user_email: email },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      console.log("Welcome email sent successfully!");
    } catch (error) {
      console.error("Failed to send welcome email:", error.text || error.message || error);
    }
  };

  const handleRegister = async () => {
    console.log("Starting registration process for email:", formData.email);

    // Validation
    if (!formData.firstName || !/^[א-ת\s]+$/.test(formData.firstName)) {
      alert("שם פרטי חייב להיות בעברית.");
      return;
    }
    if (!formData.lastName || !/^[א-ת\s]+$/.test(formData.lastName)) {
      alert("שם משפחה חייב להיות בעברית.");
      return;
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      alert("מספר טלפון חייב להיות בן 10 ספרות.");
      return;
    }
    if (!formData.birthDate) {
      alert("יש להזין תאריך לידה.");
      return;
    }
    if (!formData.gender) {
      alert("יש לבחור מגדר.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("This email is already registered.");
        console.log("Email already exists in the database:", formData.email);
        return;
      }

      // הוספת המשתמש למסד הנתונים
      await addDoc(usersRef, { ...formData, role: "student" });
      console.log("User registered successfully:", formData.email);

      // שליחת מייל ברוכים הבאים
      await sendWelcomeEmail(formData.email);

      alert("Student registered successfully!");

      // איפוס השדות
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        birthDate: "",
        gender: "",
        address: "",
      });

      // מעבר למסך ההתחברות
      navigate("/studentlogin");
    } catch (error) {
      console.error("Error registering student:", error.message);
      alert("Error: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "right" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>הרשמת תלמידים</h2>
      <label>שם פרטי</label>
      <input
        type="text"
        name="firstName"
        placeholder="שם פרטי"
        value={formData.firstName}
        onChange={handleChange}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%", textAlign: "right" }}
      />
      <label>שם משפחה</label>
      <input
        type="text"
        name="lastName"
        placeholder="שם משפחה"
        value={formData.lastName}
        onChange={handleChange}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%", textAlign: "right" }}
      />
      <label>מייל</label>
      <input
        type="email"
        name="email"
        placeholder="מייל"
        value={formData.email}
        onChange={handleChange}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%", textAlign: "right" }}
      />
      <label>סיסמה</label>
      <input
        type="password"
        name="password"
        placeholder="סיסמה"
        value={formData.password}
        onChange={handleChange}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%", textAlign: "right" }}
      />
      <label>מספר טלפון</label>
      <input
        type="text"
        name="phoneNumber"
        placeholder="מספר טלפון"
        value={formData.phoneNumber}
        onChange={handleChange}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%", textAlign: "right" }}
      />
      <label>תאריך לידה</label>
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
      />
      <label>מגדר</label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
      >
        <option value="">בחר מגדר</option>
        <option value="Male">זכר</option>
        <option value="Female">נקבה</option>
        <option value="Other">אחר</option>
      </select>
      <label>כתובת</label>
      <input
        type="text"
        name="address"
        placeholder="כתובת"
        value={formData.address}
        onChange={handleChange}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%", textAlign: "right" }}
      />
      <button
        onClick={handleRegister}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        הרשמה
      </button>
    </div>
  );
}

export default StudentRegister;
