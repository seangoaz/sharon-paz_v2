import React from "react";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogoClick = () => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));

    // Check if userData exists and navigate accordingly
    if (userData && userData.role) {
      if (userData.role === "student") {
        navigate("/studenthomepage"); // Navigate to student page
      } else if (userData.role === "admin") {
        navigate("/adminhomepage"); // Navigate to admin page
      } else {
        navigate("/"); // Default to homepage for unknown roles
      }
    } else {
      navigate("/"); // Navigate to homepage if not logged in
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#6a1b9a" }}> {/* Purple header */}
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Section: Address and Phone */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationOnIcon />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              דרך עכו 170, קריית ביאליק
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PhoneIcon />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
              component="a"
              href="tel:0522740104" // Link to dial the number
              style={{
                textDecoration: "none", // Remove underline
                color: "inherit", // Inherit color from parent
                cursor: "pointer", // Pointer cursor
              }}
            >
              052-274-0104
            </Typography>
          </Box>
        </Box>

        {/* Right Section: Logo */}
        <Box>
          <img
            src={logo} // Adjust path to your logo file
            alt="Company Logo"
            style={{ height: "50px", cursor: "pointer" }} // Adjust size as needed
            onClick={handleLogoClick} // Call the function to handle navigation
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
