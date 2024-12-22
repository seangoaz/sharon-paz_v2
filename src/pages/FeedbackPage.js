import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";

function FeedbackPage() {
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [ratings, setRatings] = useState({
    contentQuality: 0,
    instructorQuality: 0,
    overallSatisfaction: 0,
  });
  const [comments, setComments] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUserData(loggedInUser);
    } else {
      console.error("No user data found. Please log in.");
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (userData) {
        try {
          const userRef = doc(db, "users", userData.id);
          const q = query(
            collection(db, "classes_users"),
            where("users", "==", userRef)
          );
          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            console.warn("No courses found for this user.");
            return;
          }

          const coursesList = [];
          for (const doc of snapshot.docs) {
            const courseRef = doc.data().class;
            const courseDoc = await getDoc(courseRef);
            if (courseDoc.exists()) {
              coursesList.push({ id: courseDoc.id, ...courseDoc.data() });
            }
          }
          setCourses(coursesList);
        } catch (error) {
          console.error("Error fetching courses:", error.message);
        }
      }
    };

    fetchCourses();
  }, [userData]);

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmitFeedback = async () => {
    if (!selectedCourse) {
      alert("אנא בחר קורס!");
      return;
    }

    try {
      const userRef = doc(db, "users", userData.id);
      const courseRef = doc(db, "classes", selectedCourse);

      await addDoc(collection(db, "feedback"), {
        user_id: userRef,
        course_id: courseRef,
        ratings,
        comments,
        timestamp: serverTimestamp(),
      });

      alert("המשוב נשמר בהצלחה!");
      setSelectedCourse("");
      setRatings({ contentQuality: 0, instructorQuality: 0, overallSatisfaction: 0 });
      setComments("");
    } catch (error) {
      console.error("Error saving feedback:", error.message);
      alert("שגיאה בשמירת המשוב.");
    }
  };

  return (
    <div style={{ textAlign: "right", margin: "20px" }}>
      <h1>הזנת משוב על קורס</h1>
      {userData && <p>ברוך הבא, {userData.email}!</p>}

      {/* Drop-down לבחירת קורס */}
      <label style={{ display: "block", margin: "10px 0", fontWeight: "bold" }}>בחר קורס:</label>
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          fontSize: "1rem",
        }}
      >
        <option value="">בחר קורס</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.description}
          </option>
        ))}
      </select>

      {/* קטגוריות דירוג */}
      <div>
        <h3>איכות התוכן</h3>
        <StarRating
          value={ratings.contentQuality}
          onChange={(value) => handleRatingChange("contentQuality", value)}
        />
        <h3>איכות המדריך</h3>
        <StarRating
          value={ratings.instructorQuality}
          onChange={(value) => handleRatingChange("instructorQuality", value)}
        />
        <h3>שביעות רצון כללית</h3>
        <StarRating
          value={ratings.overallSatisfaction}
          onChange={(value) => handleRatingChange("overallSatisfaction", value)}
        />
      </div>

      {/* הערה כללית */}
      <label style={{ display: "block", margin: "10px 0", fontWeight: "bold" }}>הערה כללית:</label>
      <textarea
        placeholder="הזן הערה כללית (לא חובה)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        style={{
          width: "100%",
          height: "100px",
          marginTop: "10px",
          textAlign: "right",
          fontSize: "1rem",
          padding: "10px",
          direction: "rtl",
        }}
      ></textarea>

      {/* כפתור שליחה */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handleSubmitFeedback}
          style={{
            padding: "10px 20px",
            fontSize: "1.2rem",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          שלח משוב
        </button>
      </div>
    </div>
  );
}

// רכיב דירוג כוכבים
const StarRating = ({ value, onChange }) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            fontSize: "2rem",
            cursor: "pointer",
            color: star <= value ? "#FFD700" : "#CCC",
            margin: "0 5px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default FeedbackPage;
