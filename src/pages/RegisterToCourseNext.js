import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore";

const RegisterClassPage = () => {
    let { selectedClass } = useParams();
    console.log(selectedClass);
    
    const [isApproved, setIsApproved] = useState(false);
    console.log(isApproved);
    const [details, setDetails] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    //const {id} = useNavigate();
  
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
  
    const closePopup = () => setShowPopup(false);
  
    return (
      <div>
        <h1>Register for {selectedClass.name}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <input
                type="checkbox"
                checked={isApproved}
                onChange={handleApprovalChange}
              />
              I approve as the parent or legal guardian.
            </label>
          </div>
          <div>
            <label>
              Specific Details We Should Know:
              <textarea
                value={details}
                onChange={handleDetailsChange}
                placeholder="Any allergies, medical conditions, or other important information."
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
        {showPopup && (
          <div style={{ position: "fixed", top: "50%", left: "50%" }}>
            <h2>Confirmation</h2>
            <p>You registered for {selectedClass.name}.</p>
            <p>Details: {details || "None provided."}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        )}
      </div>
    );
  };

export default RegisterClassPage;
