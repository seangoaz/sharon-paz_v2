import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";

const RegisterClassPage = () => {
  const { selectedClass } = useParams();
  const [isApproved, setIsApproved] = useState(false);
  const [details, setDetails] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [courseName, setCourseName] = useState("Unknown Course");

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        if (selectedClass) {
          const classDoc = await getDoc(doc(db, "classes", selectedClass));
          if (classDoc.exists()) {
            setCourseName(classDoc.data().name);
          } else {
            console.error("Class not found");
          }
        }
      } catch (error) {
        console.error("Error fetching class:", error);
      }
    };

    fetchCourseName();
  }, [selectedClass]); // Added dependency array to prevent infinite re-renders

  const handleApprovalChange = (e) => setIsApproved(e.target.checked);
  const handleDetailsChange = (e) => setDetails(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isApproved) {
      alert("You must approve the parent checkbox before proceeding.");
      return;
    }
    setShowPopup(true);
  };

  const registerStudentToClass = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        console.error("No logged-in user found");
        return;
      }

      addDoc(collection(db, "classes_users"), {
        classId: selectedClass,
        studentId: loggedInUser.id,
        details,
      });

      console.log("Class registered successfully!");
      console.log("Student name", loggedInUser.firstName)
    } catch (error) {
      console.error("Error registering student to class:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    registerStudentToClass();
  };

  const closeApprovalPopup = () => setShowApprovalPopup(false);

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>Register for {courseName}</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Checkbox for Parent Approval */}
        <div style={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={isApproved}
              onChange={handleApprovalChange}
            />
            I approve as the parent or legal guardian.
          </label>
          <button
            type="button"
            onClick={() => setShowApprovalPopup(true)}
            style={styles.infoButton}
          >
            ?
          </button>
        </div>

        {/* Textarea for Additional Details */}
        <div style={styles.formGroup}>
          <label>
            Specific Details We Should Know:
            <textarea
              value={details}
              onChange={handleDetailsChange}
              placeholder="Any allergies, medical conditions, or other important information."
              style={styles.textArea}
            />
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>

      {/* Confirmation Modal */}
      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Confirmation</h2>
            <p>
              You registered for <strong>{courseName}</strong>.
            </p>
            <p>Details: {details || "None provided."}</p>
            <button onClick={closePopup} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Approval Info Modal */}
      {showApprovalPopup && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Parent Approval</h2>
            <p>
              By checking this box, you confirm that you are the parent or legal
              guardian of the child and agree to the terms and conditions of the
              class registration.
            </p>
            <button onClick={closeApprovalPopup} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Basic styling
const styles = {
  pageContainer: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoButton: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  textArea: {
    width: "100%",
    height: "80px",
    marginTop: "5px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "16px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  closeButton: {
    marginTop: "15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 15px",
    cursor: "pointer",
  },
};

export default RegisterClassPage;
