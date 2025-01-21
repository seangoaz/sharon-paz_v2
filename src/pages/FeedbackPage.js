import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

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
  const [apiFeedbackRating, setApiFeedbackRating] = useState(null); // AI rating

  // Fetch user details
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUserData(loggedInUser);
    } else {
      console.error("No user data found. Please log in.");
    }
  }, []);

  // Fetch user's courses
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

  // Load existing feedback
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
        setExistingFeedbackId(feedbackDoc.id);
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

  // Update selected course
  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    if (courseId) {
      loadExistingFeedback(courseId);
    }
  };

  // Save or update feedback
  const handleSubmitFeedback = async () => {
    if (!selectedCourse) {
      alert("אנא בחר חוג!");
      return;
    }

    try {
      const userRef = doc(db, "users", userData.id);
      const courseRef = doc(db, "classes", selectedCourse);

      if (existingFeedbackId) {
        const feedbackRef = doc(db, "feedback", existingFeedbackId);
        await updateDoc(feedbackRef, {
          ratings,
          comments,
          timestamp: serverTimestamp(),
        });
        alert("המשוב עודכן בהצלחה!");
      } else {
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

  // Call API for feedback analysis
  const calculateApiRating = async () => {
    if (!comments.trim()) {
      alert("אנא הזן הערה כללית!");
      return;
    }

    try {
      const apiBase = "https://test-40.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview";
      const apiKey = "9uvLozP2T9SxLzpKQuTYuDzEO8NO9WkaV4Ta0whPFqrOhxRcanRRJQQJ99AJACYeBjFXJ3w3AAABACOGvil6";
      const systemPrompt =
        "You are an AI that receives a user feedback. Return ONLY a number from 1 to 10 that represents how good or positive the feedback is, without any additional text or explanation.";

      const response = await fetch(apiBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: comments },
          ],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const rating = parseInt(data.choices[0].message.content, 10);
        setApiFeedbackRating(rating);
        setRatings((prev) => ({ ...prev, overallSatisfaction: rating }));
      } else {
        console.error(`Error calculating AI rating: ${data.error.message || "No response"}`);
      }
    } catch (error) {
      console.error("Error calculating AI rating:", error.message);
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

      <label style={styles.formLabel}>
        הערה כללית:
        <button onClick={calculateApiRating} style={styles.apiButton}>
          חשב דירוג
        </button>
      </label>
      <textarea
        placeholder="הזן הערה כללית (לא חובה)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        style={styles.formTextarea}
      ></textarea>

      {apiFeedbackRating !== null && (
        <div style={styles.apiRatingContainer}>
          <h3>הדירוג שחושב באמצעות בינה מלאכותית</h3>
          <p style={styles.apiRatingValue}>{apiFeedbackRating}</p>
        </div>
      )}

      <div style={styles.formActions}>
        <button onClick={handleSubmitFeedback} style={styles.submitButton}>
          שלח משוב
        </button>
      </div>
    </div>
  );
}

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
  apiButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    fontSize: "0.9rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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
  },
  apiRatingContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "5px",
    textAlign: "center",
  },
  apiRatingValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#28a745", // Green color for positive feedback
  },
  formActions: {
    textAlign: "center",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
};

export default FeedbackPage;