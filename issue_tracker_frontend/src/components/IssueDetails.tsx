import React from "react";
import { Card } from "react-bootstrap";
import { Issue } from "../interfaces/interfaces";
import styles from "./IssueDetails.module.css";

interface IssueDetailsProps {
  issue: Issue;
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ issue }) => {
  return (
    <div className={styles.issueDetailsContainer}>
      <h1 className={styles.title}>{issue.title}</h1>
      <Card className={styles.issueCard}>
        <div className={styles.infoStrip}>
          {issue.created_by.email} created on{" "}
          {new Date(issue.created_at).toLocaleDateString()}
        </div>
        <Card.Body>
          <p className={styles.description}>{issue.description}</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default IssueDetails;
