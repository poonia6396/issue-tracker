import React, { useState, ChangeEvent, FormEvent } from "react";
import { createProject } from "../api/api";
import { useNavigate } from "react-router-dom";
import styles from "./CreateProjectPage.module.css";

const CreateProjectPage: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const history = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createProject({ name: projectName });
      history("/dashboard");
    } catch (error) {
      console.error("Create project failed", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Project</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          value={projectName}
          onChange={handleChange}
          placeholder="Project Name"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProjectPage;
