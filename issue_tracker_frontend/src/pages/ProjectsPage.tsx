// src/pages/ProjectsPage.tsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useUser } from "../contexts/UserContext";
import { getProjectsForUser } from "../api/api";
import { Project } from "../interfaces/interfaces";

const ProjectsPage: React.FC = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const response = await getProjectsForUser(user.id);
          setProjects(response.data);
        } catch (error) {
          console.error("Failed to fetch projects", error);
        }
      }
    };
    fetchProjects();
  }, [user]);

  return (
    <Container>
      <Row>
        {projects.map((project) => (
          <Col key={project.id} sm={12} md={6} lg={4}>
            <Card style={{ marginBottom: "10px" }}>
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProjectsPage;
