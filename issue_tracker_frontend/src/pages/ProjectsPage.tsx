// src/pages/ProjectsPage.tsx
import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { getProjectsForUser } from "../api/api";
import { Project } from "../interfaces/interfaces";
import ProjectList from "../components/ProjectList";
import styles from "./IssueDetailsPage.module.css";

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true); 
        const response = await getProjectsForUser();
        setProjects(response.data);
        setLoading(false); 
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Container>
      {loading && (
        <div className={`${styles.overlay} ${loading ? styles["fade-in"] : styles.hidden}`}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <ProjectList projects={projects} />
    </Container>
  );
};

export default ProjectsPage;
