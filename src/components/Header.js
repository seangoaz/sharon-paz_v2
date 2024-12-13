import React from "react";
import { AppBar, Toolbar, Box, Typography, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import logo from "../assets/images/logo.png" ;
import { Link } from "react-router-dom";

function Header() {
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
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                052-274-0104
            </Typography>
          </Box>
        </Box>

        {/* Right Section: Logo */}
        <Box>
          <Link to="/">
            <img
            src={logo} // Adjust path to your logo file
            alt="Company Logo"
            style={{ height: "50px" }} // Adjust size as needed
            />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
