import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const RegisterToClass = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to track search input

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        console.error("No user found in localStorage");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", loggedInUser.id));
      if (userDoc.exists()) {
        setUser({ id: loggedInUser.id, ...userDoc.data() });
      } else {
        console.error("User not found in database");
      }
    };

    const fetchClasses = async () => {
      const classesCollection = collection(db, "classes");
      const classSnapshot = await getDocs(classesCollection);
      const classList = classSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(classList);
    };

    fetchUserData();
    fetchClasses();
  }, []);

  useEffect(() => {
    if (user) {
      const filtered = classes.filter((cls) => cls.minAge <= user.age);
      setFilteredClasses(filtered);
    }
  }, [user, classes]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = classes.filter((cls) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(classes);
    }
  }, [searchQuery, classes]);

  const openPopup = (cls) => setSelectedClass(cls);
  const closePopup = () => setSelectedClass(null);

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>בחר חוג</h1>

      {/* Search Input */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <input
          type="text"
          placeholder="חפש לפי שם החוג"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "80%",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
            marginBottom: "1rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Classes Catalog */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "0.5rem",
              backgroundColor: "#f9f9f9",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
            }}
          >
            <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#333" }}>{cls.name}</h4>
            
            {cls.imageUrl && (
              <img
                src={cls.imageUrl}
                alt={cls.name}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                  maxHeight: "120px",
                }}
              />
            )}
            <button
              onClick={() => openPopup(cls)}
              style={{
                padding: "0.4rem 0.8rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "background-color 0.3s ease",
              }}
            >
              פרטי החוג
            </button>
          </div>
        ))}
      </div>

      {/* Popup for Class Details */}
      {selectedClass && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "350px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              textAlign: "left",
            }}
          >
            <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>{selectedClass.name}</h2>
            {selectedClass.imageUrl && (
              <img
                src={selectedClass.imageUrl}
                alt={selectedClass.name}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              />
            )}
            <p><strong>תיאור:</strong> {selectedClass.description}</p>
            <p><strong>ציוד:</strong> {selectedClass.equipment}</p>
            <p><strong>מדריך:</strong> {selectedClass.guide}</p>
            <p><strong>מיקום:</strong> {selectedClass.location}</p>
            <p><strong>מחיר:</strong> ש"ח {selectedClass.price}</p>
            <p><strong>יום:</strong> {selectedClass.day}</p>
            <p><strong>שעה:</strong> {selectedClass.time}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              <button
                onClick={closePopup}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                סגור
              </button>
              <button
                onClick={() => {
                  navigate(`/RegisterToCourseNext/${selectedClass.id}`);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                הירשם
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterToClass;
