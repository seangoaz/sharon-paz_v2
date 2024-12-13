import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function StudentRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await addDoc(collection(db, "users"), {
        email,
        password,
        role: "student",
      });
      alert("Student registered successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error registering student:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Student Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default StudentRegister;
