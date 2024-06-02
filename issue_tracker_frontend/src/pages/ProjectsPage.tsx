// src/pages/ProjectsPage.tsx
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { getProjectsForUser } from "../api/api";
import { Project } from "../interfaces/interfaces";
import ProjectList from "../components/ProjectList";

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjectsForUser();
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Container>
      <ProjectList projects={projects} />
    </Container>
  );
};

export default ProjectsPage;
