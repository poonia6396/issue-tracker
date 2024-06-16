// src/components/IssueContainer.tsx
import React from "react";
import { Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { Issue } from "../interfaces/interfaces";

interface IssueContainerProps {
  issue: Issue;
}

const IssueContainer: React.FC<IssueContainerProps> = ({ issue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/issue/${issue.id}`);
  };

  const getStatusVariant = (status: string) => {
    if (!status) {
      return "primary";
    }
    switch (status.toLowerCase()) {
      case "open":
        return "success";
      case "in-progress":
        return "warning";
      case "closed":
        return "secondary";
      default:
        return "primary";
    }
  };

  const getPriorityVariant = (priority: string) => {
    if (!priority) {
      return "primary";
    }
    switch (priority.toLowerCase()) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <Card
      className="mb-3 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">{issue.title}</Card.Title>
          <Badge bg={getPriorityVariant(issue.priority)}>
            {issue.priority}
          </Badge>
        </div>
        <Card.Text className="text-muted mb-2">{issue.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <Badge bg={getStatusVariant(issue.status)}>{issue.status}</Badge>
          <FaExclamationCircle className="text-muted" />
        </div>
      </Card.Body>
    </Card>
  );
};

export default IssueContainer;
