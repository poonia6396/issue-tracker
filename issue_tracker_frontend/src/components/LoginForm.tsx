import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./LoginForm.module.css";

interface Props {
  onLogin: (credentials: { email: string; password: string }) => void;
}

const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        name="email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="Username"
        className={styles.input}
      />
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Password"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
