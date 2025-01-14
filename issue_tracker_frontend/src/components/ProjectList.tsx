import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Button } from "react-bootstrap";
import { Project } from "../interfaces/interfaces";

interface Props {
  projects: Project[];
}

const ProjectList: React.FC<Props> = ({ projects }) => {
  const navigate = useNavigate();

  const handleCardClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="row g-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="col-sm-6 col-md-4 col-lg-3"
          onClick={() => handleCardClick(project.id)}
          style={{ cursor: "pointer" }}
        >
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title>{project.name}</Card.Title>
                <Badge bg="primary">
                  {
                    project.issues.filter((issue) => issue.status === "Open")
                      .length
                  }{" "}
                  open
                </Badge>
              </div>
              <Card.Text className="text-muted">
                {project.description}
              </Card.Text>
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  className="text-white"
                  style={{
                    backgroundColor: "#03932c",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/project/${project.id}/issues`);
                  }}
                >
                  View Issues
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
