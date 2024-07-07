import React, { useState } from "react";
import { useNavigate, Link, ErrorResponse } from "react-router-dom";
import { loginUser, getUser } from "../api/api";
import { useUser } from "../contexts/UserContext";
import { useError } from '../contexts/ErrorContext';
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import styles from "./LoginPage.module.css";
import { AxiosError } from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useUser();
  const { error, setError } = useError();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const { access, refresh } = await loginUser(email, password);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);

      const response = await getUser();
      setUser(response.data);

      navigate('/dashboard'); // or any other route
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="login-container">
      {loading && (
        <div className={`${styles.overlay} ${loading ? styles["fade-in"] : styles.hidden}`}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {error && (
        <Alert variant="danger">
          {'An error occurred. Please try again.'}
        </Alert>
      )}
      <div className={`${styles.login}`}>
        
        <Form onSubmit={handleSubmit} className={`${styles.loginContainer}`}>
          {/* <div className={`${styles.heading}`}>Login</div> */}
          <h3>Login</h3>
          <Form.Group controlId="formBasicEmail">
            {/*<Form.Label>Email address</Form.Label>*/}
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              className={`${styles.loginFields}`}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            {/*<Form.Label>Password</Form.Label>*/}
            <Form.Control
              className={`${styles.loginFields}`}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className={`${styles.loginBtn}`}>
            Login
          </Button>
          <br />
          <div className={`${styles.loginFields}`}>Don't have an account? <Link to="/signup">Sign Up</Link></div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
