import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Ensure you have AuthContext setup
import styles from "./CustomNavbar.module.css"; // Import the CSS module
import { IconButton } from '@mui/material';
import { PowerSettingsNew } from '@mui/icons-material';

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.setItem('access_token', '');
    localStorage.setItem('refresh_token', '');
    navigate("/login")
  }
  const access_token = localStorage.getItem('access_token');
  if (access_token == null || access_token == '' ) {
    return (
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Navbar.Brand onClick={handleHomeClick} className={`${styles.navContainer}`}>
          Issue Tracker
        </Navbar.Brand>
      </Navbar>
    );
  } 
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Navbar.Brand onClick={handleHomeClick} className={`${styles.navContainer}`}>
        Issue Tracker
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav className="me-auto">
          <Nav.Link onClick={handleHomeClick}>Home</Nav.Link>
          {
            <Nav.Link onClick={() => navigate("/projects")}>
              Projects
            </Nav.Link>
          }
          {<Nav.Link onClick={() => navigate("/issues")}>Issues</Nav.Link>}
        </Nav>
      <Navbar.Collapse className="justify-content-end">
        <IconButton onClick={logout} edge="end"><PowerSettingsNew sx={{ color: 'white', fontSize: 'larger', marginRight: '30px' }} /></IconButton>
      </Navbar.Collapse>
    </Navbar>

  );
};

export default NavigationBar;
