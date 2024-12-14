import React, { useState } from "react";

const RegisterClassPage = ({ selectedClass }) => {
  const [isApproved, setIsApproved] = useState(false);
  const [details, setDetails] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleApprovalChange = (e) => {
    setIsApproved(e.target.checked);
  };

  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isApproved) {
      alert("You must approve the parent checkbox before proceeding.");
      return;
    }

    setShowPopup(true); // Show confirmation pop-up
  };

  const closePopup = () => {
    setShowPopup(false);
    // Here, you'd handle the actual registration logic
    console.log("Class Registered:", {
      classId: selectedClass.id,
      details,
    });
  };

  return (
    <div>
      <h1>Register for {selectedClass.name}</h1>
      <form onSubmit={handleSubmit}>
        {/* Checkbox for Parent Approval */}
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

        {/* Textarea for Additional Details */}
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

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>

      {/* Confirmation Pop-Up */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Confirmation</h2>
          <p>
            You have successfully registered for the class: <strong>{selectedClass.name}</strong>.
          </p>
          <p>Details provided: {details || "No additional details."}</p>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
    </div>
  );
};

export default RegisterClassPage;
