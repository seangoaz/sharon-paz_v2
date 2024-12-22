import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore";

const RegisterToClass = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      const classesCollection = collection(db, "classes");
      const classSnapshot = await getDocs(classesCollection);
      const classList = classSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(classList);
      setFilteredClasses(classList);
    };

    fetchClasses();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

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
    <div>
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
          <div key={cls.id} style={{ border: "1px solid #ccc", padding: "1rem" }}>
            <h3>{cls.name}</h3>
            <p><strong>Guide:</strong> {cls.guide}</p>
            <p><strong>Equipment:</strong> {cls.equipment}</p>
            <p><strong>Min Age:</strong> {cls.min_age}</p>
            <button onClick={() => console.log(`Selected class: ${cls.id}`)}>Register</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterToClass;
