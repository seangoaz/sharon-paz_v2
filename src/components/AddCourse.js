import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Adjust path as needed
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

function AdminHomepage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    time: "",
    equipment: "",
    guide: "",
    maxStudents: "",
    minAge: "",
    day: "", // Reset the day field
    imageUrl: "",  // New field for image URL
  });

  const [courseList, setCourseList] = useState([]); // State to hold the course data
  const [selectedCourse, setSelectedCourse] = useState(null); // To hold the selected course details for display
  const [showForm, setShowForm] = useState(false); // State to toggle the form visibility

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const courses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Include document ID for delete operation
      }));
      setCourseList(courses); // Set the full course data in the state
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle adding a course
  const handleAddCourse = async () => {
    // Convert the Google Drive image URL to the correct format
    const formattedImageUrl = formData.imageUrl
      ? formData.imageUrl.replace(
          "https://drive.google.com/file/d/",
          "https://drive.google.com/uc?export=view&id="
        )
      : "";

    // Validate the form data
    const missingFields = Object.keys(formData).filter((key) => !formData[key]);
    if (missingFields.length > 0) {
      alert(`Please fill in all fields: ${missingFields.join(", ")}`);
      return;
    }

    // Add course to Firebase Firestore with formatted image URL
    try {
      await addDoc(collection(db, "classes"), {
        ...formData,
        imageUrl: formattedImageUrl, // Ensure the image URL is saved correctly
      });
      alert("Course added successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        location: "",
        price: "",
        time: "",
        equipment: "",
        guide: "",
        maxStudents: "",
        minAge: "",
        day: "", // Reset the day field
        imageUrl: "",  // Reset image URL
      });

      // Fetch the updated course list
      fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error.message);
      alert("Error: " + error.message);
    }
  };

  // Function to delete a course from Firestore
  const handleDeleteCourse = async (id) => {
    try {
      await deleteDoc(doc(db, "classes", id));
      setCourseList(courseList.filter((course) => course.id !== id));
      setSelectedCourse(null);
      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error.message);
      alert("Error: " + error.message);
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>קורסים קיימים</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {courseList.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            style={{
              backgroundColor: "#f4f4f4",
              padding: "20px",
              borderRadius: "8px",
              border: "2px solid #ccc",
              textAlign: "center",
              width: "250px",
              boxSizing: "border-box",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "5px",
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                }}
              />
            )}
            <h4>{course.name}</h4>
            <p>{course.day}</p>
            <p>{course.time}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCourse(course.id);
              }}
              style={{
                padding: "5px 10px",
                marginTop: "10px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              מחק קורס
            </button>
          </div>
        ))}
      </div>

      {/* Button to toggle visibility of the form */}
      <button
        onClick={() => setShowForm(!showForm)}
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
        {showForm ? "הסתר את הטופס" : "הוסף קורס חדש"}
      </button>

      {/* Show the form to add a course if showForm is true */}
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddCourse();
          }}
          style={{ marginTop: "30px" }}
        >
          <input
            type="text"
            name="name"
            placeholder="שם החוג"
            value={formData.name}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <textarea
            name="description"
            placeholder="תקציר"
            value={formData.description}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="text"
            name="day"
            placeholder="יום בשבוע"
            value={formData.day}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="text"
            name="location"
            placeholder="מיקום"
            value={formData.location}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="text"
            name="price"
            placeholder="מחיר"
            value={formData.price}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="text"
            name="time"
            placeholder="שעה"
            value={formData.time}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="text"
            name="equipment"
            placeholder="ציוד"
            value={formData.equipment}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="text"
            name="guide"
            placeholder="מדריך"
            value={formData.guide}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="text"
            name="maxStudents"
            placeholder="מספר מקסימלי של סטודנטים"
            value={formData.maxStudents}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="number"
            name="minAge"
            placeholder="גיל מינימלי"
            value={formData.minAge}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="הכנס כתובת תמונה"
            value={formData.imageUrl}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px auto", padding: "10px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            הוסף קורס
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminHomepage;