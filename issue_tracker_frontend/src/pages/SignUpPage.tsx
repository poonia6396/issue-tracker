// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../api/api";
import { Form, Button } from "react-bootstrap";
import styles from "./SignUpPage.module.css";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ email, password, name });
      navigate("/login");
    } catch (error) {
      console.error("Sign up failed", error);
      // Handle sign up error (e.g., show an error message)
    }
  };

  return (
    <div className={`${styles.signup}`}>
      <Form onSubmit={handleSubmit} className={`${styles.signupContainer}`}>
        <h3>Sign Up</h3>
        <Form.Group controlId="formBasicName">
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            className={`${styles.signupFields}`}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            className={`${styles.signupFields}`}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            className={`${styles.signupFields}`}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className={`${styles.signupFields}`}>
          Sign Up
        </Button>
        <br />
        <div className={`${styles.signupFields}`}>Have an account? <Link to="/login">Login</Link></div>
      </Form>
    </div>
  );
};

export default SignUpPage;
