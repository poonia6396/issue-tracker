// src/components/IssueContainer.tsx
import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Issue {
  id: number;
  title: string;
  description: string;
}

interface IssueContainerProps {
  issue: Issue;
}

const IssueContainer: React.FC<IssueContainerProps> = ({ issue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/issues/${issue.id}`);
  };

  return (
    <Card
      style={{ marginBottom: "10px", cursor: "pointer" }}
      onClick={handleClick}
    >
      <Card.Body>
        <Card.Title>{issue.title}</Card.Title>
        <Card.Text>{issue.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default IssueContainer;
