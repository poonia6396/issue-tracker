import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge } from "react-bootstrap";
import { Project } from "../interfaces/interfaces";

interface Props {
  projects: Project[];
}

const ProjectList: React.FC<Props> = ({ projects }) => {
  return (
    <div className="row g-4">
      {projects.map((project) => (
        <div key={project.id} className="col-sm-6 col-md-4 col-lg-3">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title>{project.name}</Card.Title>
                <Badge bg="primary">{project.issues.length} open</Badge>
              </div>
              <Card.Text className="text-muted">
                {project.description}
              </Card.Text>
              <div className="d-flex justify-content-between">
                <Link
                  to={`/project/${project.id}`}
                  className="btn btn-outline-primary"
                >
                  View Project Details
                </Link>
                <Link
                  to={`/project/${project.id}/issues`}
                  className="btn btn-outline-secondary"
                >
                  View Issues
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
