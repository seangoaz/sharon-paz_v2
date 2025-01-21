import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";

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
  const [existingFeedbackId, setExistingFeedbackId] = useState(null);

  // טוען את פרטי המשתמש המחובר
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUserData(loggedInUser);
    } else {
      console.error("No user data found. Please log in.");
    }
  }, []);

  // טוען את החוגים של המשתמש
  useEffect(() => {
    const fetchCourses = async () => {
      if (userData) {
        try {
          const userRef = doc(db, "users", userData.id);
          const q = query(
            collection(db, "classes"),
            where("students", "array-contains", userRef)
          );
          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            console.warn("No courses found for this user.");
            alert("לא נמצאו חוגים עבור המשתמש.");
            return;
          }

          const coursesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCourses(coursesList);
        } catch (error) {
          console.error("Error fetching courses:", error.message);
        }
      }
    };

    fetchCourses();
  }, [userData]);

  // טוען משוב קיים אם יש
  const loadExistingFeedback = async (courseId) => {
    try {
      const userRef = doc(db, "users", userData.id);
      const q = query(
        collection(db, "feedback"),
        where("user_id", "==", userRef),
        where("course_id", "==", doc(db, "classes", courseId))
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const feedbackDoc = snapshot.docs[0];
        const feedbackData = feedbackDoc.data();

        setRatings(feedbackData.ratings);
        setComments(feedbackData.comments);
        setExistingFeedbackId(feedbackDoc.id); // שמירת ID למשוב לעריכה
      } else {
        setRatings({
          contentQuality: 0,
          instructorQuality: 0,
          overallSatisfaction: 0,
        });
        setComments("");
        setExistingFeedbackId(null);
      }
    } catch (error) {
      console.error("Error loading existing feedback:", error.message);
    }
  };

  // מעדכן חוג נבחר
  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    if (courseId) {
      loadExistingFeedback(courseId);
    }
  };

  // שמירת/עדכון משוב
  const handleSubmitFeedback = async () => {
    if (!selectedCourse) {
      alert("אנא בחר קורס!");
      return;
    }

    try {
      const userRef = doc(db, "users", userData.id);
      const courseRef = doc(db, "classes", selectedCourse);

      if (existingFeedbackId) {
        // עדכון משוב קיים
        const feedbackRef = doc(db, "feedback", existingFeedbackId);
        await updateDoc(feedbackRef, {
          ratings,
          comments,
          timestamp: serverTimestamp(),
        });
        alert("המשוב עודכן בהצלחה!");
      } else {
        // יצירת משוב חדש
        await addDoc(collection(db, "feedback"), {
          user_id: userRef,
          course_id: courseRef,
          ratings,
          comments,
          timestamp: serverTimestamp(),
        });
        alert("המשוב נשמר בהצלחה!");
      }

      setSelectedCourse("");
      setRatings({ contentQuality: 0, instructorQuality: 0, overallSatisfaction: 0 });
      setComments("");
      setExistingFeedbackId(null);
    } catch (error) {
      console.error("Error saving feedback:", error.message);
      alert("שגיאה בשמירת המשוב.");
    }
  };

  return (
    <div style={styles.feedbackContainer}>
      <h1>הזנת משוב על חוג</h1>
      {userData && (
        <p style={styles.welcomeMessage}>ברוך הבא, {userData.firstName}!</p>
      )}

      <label style={styles.formLabel}>בחר חוג:</label>
      <select
        value={selectedCourse}
        onChange={(e) => handleCourseChange(e.target.value)}
        style={styles.formSelect}
      >
        <option value="">בחר חוג</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      <div style={styles.ratingSection}>
        <h3>איכות התוכן</h3>
        <StarRating
          value={ratings.contentQuality}
          onChange={(value) => setRatings((prev) => ({ ...prev, contentQuality: value }))}
        />
        <h3>איכות המדריך</h3>
        <StarRating
          value={ratings.instructorQuality}
          onChange={(value) => setRatings((prev) => ({ ...prev, instructorQuality: value }))}
        />
        <h3>שביעות רצון כללית</h3>
        <StarRating
          value={ratings.overallSatisfaction}
          onChange={(value) => setRatings((prev) => ({ ...prev, overallSatisfaction: value }))}
        />
      </div>

      <label style={styles.formLabel}>הערה כללית:</label>
      <textarea
        placeholder="הזן הערה כללית (לא חובה)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        style={styles.formTextarea}
      ></textarea>

      <div style={styles.formActions}>
        <button onClick={handleSubmitFeedback} style={styles.submitButton}>
          שלח משוב
        </button>
      </div>
    </div>
  );
}

// רכיב דירוג כוכבים
const StarRating = ({ value, onChange }) => {
  return (
    <div style={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            ...styles.star,
            color: star <= value ? "#FFD700" : "#CCC",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const styles = {
  feedbackContainer: {
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "right",
    fontFamily: "Arial, sans-serif",
  },
  welcomeMessage: {
    direction: "rtl",
    marginBottom: "20px",
    fontSize: "1.2rem",
  },
  formLabel: {
    display: "block",
    margin: "10px 0",
    fontWeight: "bold",
  },
  formSelect: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "20px",
  },
  formTextarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "20px",
  },
  ratingSection: {
    marginBottom: "20px",
  },
  starRating: {
    display: "flex",
    justifyContent: "flex-start",
  },
  star: {
    fontSize: "2rem",
    cursor: "pointer",
    margin: "0 5px",
  },
  formActions: {
    textAlign: "center",
  },
  submitButton: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default FeedbackPage;
