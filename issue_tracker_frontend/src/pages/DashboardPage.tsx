import React, { useEffect, useState } from "react";
import { getProjects } from "../api/api";
import ProjectList from "../components/ProjectList";
import { Link } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import { Project } from "../interfaces/interfaces";

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getProjects();
      setProjects(response.data);
    };
    fetchProjects();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <Link to="/create-project" className={styles.createLink}>
        Create Project
      </Link>
      <ProjectList projects={projects} />
    </div>
  );
};

export default DashboardPage;
