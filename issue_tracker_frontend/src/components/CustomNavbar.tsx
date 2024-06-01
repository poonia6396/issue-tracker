import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Ensure you have AuthContext setup

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand onClick={handleHomeClick} style={{ cursor: "pointer" }}>
          Issue Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={handleHomeClick}>Home</Nav.Link>
            {
              <Nav.Link onClick={() => navigate("/projects")}>
                Projects
              </Nav.Link>
            }
            {<Nav.Link onClick={() => navigate("/issues")}>Issues</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
