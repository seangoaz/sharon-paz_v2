import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore";

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
    let result = classes;

    // Apply filters dynamically
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        result = result.filter((cls) => cls[key].toString().includes(value));
      }
    }
    setFilteredClasses(result);
  }, [filters, classes]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Register to a Class</h1>
      
      {/* Filters Section */}
      <div>
        <input
          placeholder="Search by name"
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
        <input
          placeholder="Search by equipment"
          onChange={(e) => handleFilterChange("equipment", e.target.value)}
        />
        <input
          placeholder="Search by guide"
          onChange={(e) => handleFilterChange("guide", e.target.value)}
        />
        <input
          type="number"
          placeholder="Minimum Age"
          onChange={(e) => handleFilterChange("min_age", e.target.value)}
        />
      </div>

      {/* Classes Catalog */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
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
    </div>
  );
};

export default RegisterToClass;
