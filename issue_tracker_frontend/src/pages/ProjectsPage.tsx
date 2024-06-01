// src/pages/ProjectsPage.tsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getProjectsForUser } from "../api/api";

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState([]);

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
