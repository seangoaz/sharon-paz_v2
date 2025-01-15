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
      console.log(user.name)
      setFilteredClasses(filtered);
    }
  }, [user, classes]);

  const openPopup = (cls) => setSelectedClass(cls);
  const closePopup = () => setSelectedClass(null);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Register to a Class</h1>

      {/* Classes Catalog */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "0.5rem",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4 style={{ margin: "0.5rem 0" }}>{cls.name}</h4>
            {cls.imageUrl && (
              <img
                src={cls.imageUrl}
                alt={cls.name}
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
              />
            )}
            <button
              onClick={() => openPopup(cls)}
              style={{
                marginTop: "0.5rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.85rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              View Details
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
              maxWidth: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              textAlign: "left",
            }}
          >
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem" }}>{selectedClass.name}</h2>
            {selectedClass.imageUrl && (
              <img
                src={selectedClass.imageUrl}
                alt={selectedClass.name}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              />
            )}
            <p><strong>Day:</strong> {selectedClass.day}</p>
            <p><strong>Description:</strong> {selectedClass.description}</p>
            <p><strong>Equipment:</strong> {selectedClass.equipment}</p>
            <p><strong>Guide:</strong> {selectedClass.guide}</p>
            <p><strong>Location:</strong> {selectedClass.location}</p>
            <p><strong>Max Students:</strong> {selectedClass.maxStudents}</p>
            <p><strong>Price:</strong> ${selectedClass.price}</p>
            <p><strong>Time:</strong> {selectedClass.time}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              <button
                onClick={closePopup}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
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
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterToClass;
