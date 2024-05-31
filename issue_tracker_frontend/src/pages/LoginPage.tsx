import React from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import LoginForm from "../components/LoginForm";
import styles from "./LoginPage.module.css";

const LoginPage: React.FC = () => {
  const history = useNavigate();

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      debugger;
      const response = await loginUser(credentials);
      localStorage.setItem("token", response.data.token);
      history("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
