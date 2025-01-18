import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const PaymentRecording = () => {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({
    idNumber: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    company: "Visa",
  });

  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "idNumber":
        if (!/^\d+$/.test(value) || value.length < 6) {
          error = "ID Number must be at least 6 digits.";
        }
        break;
      case "cardNumber":
        if (!/^\d{16}$/.test(value)) {
          error = "Card Number must be exactly 16 digits.";
        }
        break;
      case "cardHolder":
        if (value.trim() === "") {
          error = "Card Holder Name cannot be empty.";
        }
        break;
      case "expiryDate":
        const today = new Date();
        const expiry = new Date(value);
        if (expiry <= today) {
          error = "Expiry Date must be in the future.";
        }
        break;
      case "cvv":
        if (!/^\d{3,4}$/.test(value)) {
          error = "CVV must be 3 or 4 digits.";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === ""; // Return true if no error
  };

  const validateForm = () => {
    let isValid = true;
    for (const [key, value] of Object.entries(paymentDetails)) {
      if (!validateField(key, value)) {
        isValid = false;
      }
    }
    setFormValid(isValid);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();
    if (!isFormValid) {
      console.log("Form is not valid");
      return;
    }

    try {
      // Save payment details to Firestore
      const paymentMethodsCollection = collection(db, "paymentMethods");
      await addDoc(paymentMethodsCollection, paymentDetails);
      console.log("Payment method saved successfully!");

      // Show confirmation modal
      setShowModal(true);

      // Redirect to the student homepage after 5 seconds
      setTimeout(() => {
        navigate("/studenthomepage");
      }, 5000);
    } catch (error) {
      console.error("Error saving payment method:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>פרטי תשלום</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          {
            label: "ת.ז. בעל הכרטיס",
            name: "idNumber",
            type: "text",
            placeholder: "Enter ID Number",
          },
          {
            label: "מספר כרטיס",
            name: "cardNumber",
            type: "text",
            placeholder: "Enter Card Number",
          },
          {
            label: "שם בעל הכרטיס",
            name: "cardHolder",
            type: "text",
            placeholder: "Enter Cardholder Name",
          },
          {
            label: "תוקף",
            name: "expiryDate",
            type: "month",
            placeholder: "Enter Expiry Date",
          },
          {
            label: "CVV",
            name: "cvv",
            type: "password",
            placeholder: "Enter CVV",
          },
        ].map((field) => (
          <div key={field.name} style={styles.formGroup}>
            <label style={styles.label}>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={paymentDetails[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              style={styles.input}
            />
            {errors[field.name] && <p style={styles.error}>{errors[field.name]}</p>}
          </div>
        ))}
        <div style={styles.formGroup}>
          <label style={styles.label}>חברת אשראי</label>
          <select
            name="company"
            value={paymentDetails.company}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="American Express">American Express</option>
          </select>
        </div>
        <button
          type="button"
          style={styles.submitButton}
          onClick={handleSubmit}
        >
          אישור תשלום והרשמה
        </button>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>הסליקה בוצעה בהצלחה!</h3>
            <p>אנו מעבירים אותך לדף הבית של התלמיד...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "16px",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    transition: "border 0.3s",
  },
  inputHover: {
    border: "1px solid #007bff",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  submitButton: {
    padding: "12px",
    fontSize: "18px",
    backgroundColor: "#A3E4D7",
    color: "#2C3E50",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  modal: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default PaymentRecording;
