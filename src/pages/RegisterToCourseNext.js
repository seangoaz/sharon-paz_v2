import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

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
  }, [selectedClass]);

  const handleApprovalChange = (e) => setIsApproved(e.target.checked);
  const handleDetailsChange = (e) => setDetails(e.target.value);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isApproved) {
      alert("עליך לאשר תחילה את תקנון המרכז");
      return;
    }
    setShowPopup(true);
  };

  async function addStudentToClass(classId) {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      const userRef = doc(db, "users", user.id);
      const classRef = doc(db, "classes", classId);

      await updateDoc(classRef, {
        students: arrayUnion(userRef),
      });

      console.log(`Student ${user.email} added to class ${classId}.`);
    } catch (error) {
      console.error("Error adding student to class:", error);
    }
  }

  const closePopup = () => {
    setShowPopup(false);
    addStudentToClass(selectedClass);
  };

  const closeApprovalPopup = () => setShowApprovalPopup(false);

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>הרשמה לחוג {courseName}</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={isApproved}
              onChange={handleApprovalChange}
            />
אני מאשר את תקנון המרכז
          </label>
          <button
            type="button"
            onClick={() => setShowApprovalPopup(true)}
            style={styles.infoButton}
          >
            ?
          </button>
        </div>

        <div style={styles.formGroup}>
          <label>
            <textarea
              value={details}
              onChange={handleDetailsChange}
              placeholder="הערות, אלרגיות, או מידע העלול להשפיע על השתתפות התלמיד בחוג"
              style={styles.textArea}
            />
          </label>
        </div>

        <button
          onClick={() => addStudentToClass(selectedClass)}
          type="submit"
          style={styles.submitButton}
        >
          שלח
        </button>
      </form>

      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>אישור הרשמה</h2>
            <p style={styles.modalText}>
              נרשמת לחוג  <strong>{courseName}</strong>.
            </p>
            <p style={styles.modalText}>פרטים: {details || "אין"}</p>
            <button
              onClick={() => navigate("/payment-record")}
              style={styles.closeButton}
            >
              סגור
            </button>
          </div>
        </div>
      )}

      {showApprovalPopup && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>תקנון המרכז</h2>
            <p style={styles.modalText}>
            התקנון המובא כאן נועד להסדיר את תנאי השימוש באתר ואת כללי הרישום לחוגים. הורים המבקשים לרשום את ילדיהם לחוגים באתר נדרשים לקרוא את התקנון ולאשר אותו כתנאי לשימוש באתר.

1. כללי
1.1. התקנון מנוסח בלשון זכר לצורכי נוחות בלבד, אך הוא פונה לכל המגדרים.
1.2. השימוש באתר מותנה באישור התקנון. רישום לחוג מהווה הסכמה מלאה לתנאים המפורטים להלן.
1.3. האתר שומר לעצמו את הזכות לעדכן את התקנון מעת לעת, וכל שינוי ייכנס לתוקף עם פרסומו באתר.

2. רישום לחוגים
2.1. הרישום לחוגים באתר מתבצע על בסיס מקום פנוי בלבד.
2.2. על ההורים למלא פרטים מדויקים ועדכניים לגבי הילד הנרשם. אי מסירת פרטים נכונים עשויה למנוע את השתתפות הילד בחוג.
2.3. אישור ההרשמה יישלח בדוא"ל להורה לאחר השלמת התשלום (אם קיים).

3. תשלומים וביטולים
3.1. התשלום עבור החוגים יתבצע באמצעות האתר, בכפוף להנחיות המפורטות בו.
3.2. במקרה של ביטול הרשמה, יחולו תנאי הביטול הבאים:

ביטול עד שבועיים לפני תחילת החוג: החזר מלא.

ביטול בין שבועיים לשבוע לפני תחילת החוג: החזר של 50%.

ביטול בשבוע שלפני תחילת החוג או לאחר תחילתו: לא יינתן החזר כספי.
3.3. במידה וחוג מבוטל על ידי המפעילים, יינתן החזר כספי מלא.

4. אחריות וביטחון הילד
4.1. המפעילים מתחייבים לפעול בהתאם לנהלי הבטיחות והביטחון המקובלים.
4.2. ההורים מצהירים כי הילד בריא וכשיר להשתתף בחוג. במקרה של מגבלה רפואית, על ההורים להודיע על כך מראש למפעילי החוג.
4.3. האחריות על הגעת הילד לחוג ושובו לביתו מוטלת על ההורים בלבד.

5. התנהגות וכללי משמעת
5.1. המשתתפים מחויבים לשמור על כללי ההתנהגות והמשמעת כפי שייקבעו על ידי המדריכים.
5.2. במקרה של הפרות סדר חמורות, שומר לעצמו המפעיל את הזכות להפסיק את השתתפותו של הילד בחוג ללא החזר כספי.

6. פרטיות ושימוש במידע
6.1. פרטי המשתמשים יישמרו בהתאם לחוק הגנת הפרטיות, ולא יועברו לצדדים שלישיים ללא אישור מראש.
6.2. האתר עשוי להשתמש בפרטי הקשר שנמסרו לצורך עדכונים, תזכורות ומידע נוסף הקשור לחוגים.
            </p>
            <button onClick={closeApprovalPopup} style={styles.closeButton}>
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Roboto', Arial, sans-serif",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    textAlign: "left",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "5px",
    width: "100%",
  },
  infoButton: {
    backgroundColor: "#A3D5FF",
    color: "#2C3E50",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    alignSelf: "flex-end",
    fontSize: "14px",
  },
  textArea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
    direction: "rtl",
  },
  submitButton: {
    backgroundColor: "#A3E4D7",
    color: "#2C3E50",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    padding: "12px 20px",
    fontSize: "18px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
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
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    textAlign: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  modalText: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#555",
    marginBottom: "15px",
    textAlign: "justify",
    direction: "rtl",
  },
  closeButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  "@media (max-width: 768px)": {
    pageContainer: {
      padding: "15px",
    },
    title: {
      fontSize: "20px",
    },
    modal: {
      maxWidth: "95%",
      padding: "15px",
    },
    submitButton: {
      fontSize: "16px",
      padding: "10px 15px",
    },
    closeButton: {
      fontSize: "14px",
      padding: "8px 12px",
    },
  },
};

export default RegisterClassPage;
