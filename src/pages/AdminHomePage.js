import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { db } from "../firebaseConfig"; // Adjust the path to your firebase config
import {
  collection,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function AdminHome() {
  const [courseList, setCourseList] = useState([]); // State to hold the courses
  const [selectedCourse, setSelectedCourse] = useState(null); // State for selected course for details
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
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
    imageUrl: "",
  });

  // Fetch courses from Firestore when the component mounts
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const courses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Add the document ID for deletion
      }));
      setCourseList(courses); // Set the fetched courses in the state
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  // Function to delete a course from Firestore
  const handleDeleteCourse = async (id) => {
    try {
      // Delete the course from Firebase Firestore
      await deleteDoc(doc(db, "classes", id));

      // Remove the course from the local state to update the UI
      setCourseList(courseList.filter((course) => course.id !== id));

      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error.message);
      alert("Error: " + error.message);
    }
  };

  // Function to handle opening the modal with the selected course details
  const handleCourseClick = (course) => {
    setSelectedCourse(course); // Set the selected course to show its details
    setFormData({
      name: course.name,
      description: course.description,
      location: course.location,
      price: course.price,
      time: course.time,
      equipment: course.equipment,
      guide: course.guide,
      maxStudents: course.maxStudents,
      minAge: course.minAge,
      imageUrl: course.imageUrl,
    }); // Set the form data with the selected course values
    setShowModal(true); // Show the modal
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedCourse(null); // Reset selected course
  };

  // Handle input changes in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function fetchAndDisplayClassUsers(classId) {
    try {
      // Reference to the class document
      const classRef = doc(db, "classes", classId);
      const classDoc = await getDoc(classRef);

      if (classDoc.exists()) {
        // Get the list of user references from the class object
        const userRefs = classDoc.data().students; // Array of DocumentReferences
        console.log(userRefs);
        console.log(classDoc.data());

        // Fetch each user's document to get the username
        const usernames = await Promise.all(
          userRefs.map(async (userRef) => {
            const userDoc = await getDoc(userRef);
            return userDoc.exists() ? userDoc.data().email : null;
          })
        );

        // Filter out any null values (if some users were not found)
        const validUsernames = usernames.filter(
          (username) => username !== null
        );

        // Display usernames in an alert if valid usernames are found
        if (validUsernames.length > 0) {
          alert(`Users in the class:\n${validUsernames.join(", ")}`);
        } else {
          // Notify if no valid users are found
          alert("No users found in this class.");

          // Show a toast notification for an empty list
          showToast("The class has no valid users at the moment.");
        }
      } else {
        console.log("Class document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching class users:", error);
    }
  }

  // Simplified toast notification style with proper fading
  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = "#f44336"; // Red background for error
    toast.style.color = "white";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "16px";
    toast.style.fontWeight = "bold";
    toast.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
    toast.style.zIndex = "1000";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease-in-out";

    document.body.appendChild(toast);

    // Fade in the toast
    setTimeout(() => {
      toast.style.opacity = "1";
    }, 100);

    // Remove the toast after 4 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500); // Remove after fade-out completes
    }, 4000);
  }

  // Handle course update
  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    try {
      const courseRef = doc(db, "classes", selectedCourse.id);
      await updateDoc(courseRef, formData); // Update the course in Firestore

      // Update the local state with the updated course
      setCourseList((prevCourses) =>
        prevCourses.map((course) =>
          course.id === selectedCourse.id ? { ...course, ...formData } : course
        )
      );

      alert("החוג עודכן בהצלחה!");
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error("Error updating course:", error.message);
      alert("Error: " + error.message);
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>מסך מנהלים </h1>

      {/* Link to Add Course page */}
      <Link
        to="/add-course"
        style={{
          textDecoration: "none",
          color: "#007BFF",
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginBottom: "20px",
          display: "block",
        }}
      >
        הוסף חוג חדש
      </Link>

      <div>
        <h2>חוגים קיימים</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {courseList.length > 0 ? (
            courseList.map((course) => (
              <div
                key={course.id}
                style={{
                  backgroundColor: "#f4f4f4",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "2px solid #ccc",
                  textAlign: "center",
                  width: "250px",
                  boxSizing: "border-box",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => handleCourseClick(course)} // Open modal with course details
              >
                {/* Check if imageUrl exists and display it */}
                {course.imageUrl ? (
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
                ) : (
                  <p>No image available</p> // Fallback in case imageUrl is empty
                )}
                <button
                  onClick={() => fetchAndDisplayClassUsers(course.id)}
                  style={{
                    padding: "5px 10px",
                    margin: "10px 0",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  הצג תלמידים
                </button>
                <h4>{course.name}</h4>
                <p>{course.day}</p> {/* Displaying the day */}
                <p>{course.time}</p> {/* Displaying the time */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from opening the modal
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
                  מחק חוג
                </button>
              </div>
            ))
          ) : (
            <>
              <p>אין חוג זמין</p>
              {/* Show toast notification for empty list */}
              {showToast("לא קיימים חוגים כרגע")}
            </>
          )}
        </div>
      </div>
      {/* Modal for editing course details */}
      {showModal && selectedCourse && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "500px",
              maxWidth: "100%",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {/* Course Image */}
            {formData.imageUrl ? (
              <img
                src={formData.imageUrl}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                }}
                alt="Course"
              />
            ) : (
              <p>No image available</p>
            )}

            <form onSubmit={handleUpdateCourse}>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="name" style={{ display: "block" }}>
                  שם החוג:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="description" style={{ display: "block" }}>
                  תקציר:
                </label>
                  <button  style={{ marginLeft: "10px" }}>
                  <AutoAwesomeIcon style={{ marginRight: "5px" }} />
                  </button>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                    resize: "vertical", // Allow vertical resize for text area
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="location" style={{ display: "block" }}>
                  מיקום:
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="price" style={{ display: "block" }}>
                  מחיר:
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="time" style={{ display: "block" }}>
                  שעה:
                </label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="equipment" style={{ display: "block" }}>
                  ציוד נדרש:
                </label>
                <input
                  type="text"
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="guide" style={{ display: "block" }}>
                  מדריך:
                </label>
                <input
                  type="text"
                  id="guide"
                  name="guide"
                  value={formData.guide}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="maxStudents" style={{ display: "block" }}>
                  מספר תלמידים מקסימלי:
                </label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="minAge" style={{ display: "block" }}>
                  גיל מינימלי:
                </label>
                <input
                  type="number"
                  id="minAge"
                  name="minAge"
                  value={formData.minAge}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    boxSizing: "border-box", // Prevents input fields from exceeding container
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
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
                עדכן
              </button>
            </form>

            {/* Close Modal Button */}
            <button
              onClick={handleCloseModal}
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
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHome;
