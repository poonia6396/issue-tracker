// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getUser } from "../api/api";
import { useUser } from "../contexts/UserContext";
import { Form, Button } from "react-bootstrap";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await loginUser(email, password);
      localStorage.setItem("token", token);

      const response = await getUser();
      setUser(response.data);
      // Store the token in localStorage or cookie if needed

      navigate("/dashboard"); // or any other route
    } catch (error) {
      console.error("Login failed", error);
      // Handle login error (e.g., show an error message)
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
