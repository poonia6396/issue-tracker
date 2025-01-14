// src/pages/IssuesPage.tsx
import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container, Row, Col, Spinner } from "react-bootstrap";
import { getIssuesCreatedBy, getIssuesAssignedTo } from "../api/api";
import IssueContainer from "../components/IssueContainer";
import { Issue } from "../interfaces/interfaces";
import styles from "./IssueDetailsPage.module.css";

const IssuesPage: React.FC = () => {
  const [key, setKey] = useState("createdBy");
  const [createdByIssues, setCreatedByIssues] = useState<Issue[]>([]);
  const [assignedToIssues, setAssignedToIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true); 
        const createdByResponse = await getIssuesCreatedBy();
        setCreatedByIssues(createdByResponse.data);
        const assignedToResponse = await getIssuesAssignedTo();
        setAssignedToIssues(assignedToResponse.data);
        setLoading(false); 
      } catch (error) {
        console.error("Failed to fetch issues", error);
      }
    };
    fetchIssues();
  }, []);

  return (
    <div className="login-container">
      {loading && (
        <div className={`${styles.overlay} ${loading ? styles["fade-in"] : styles.hidden}`}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    <Container>
      <Tabs
        activeKey={key as string}
        onSelect={(k) => setKey(k as string)}
        className="mb-3"
      >
        <Tab eventKey="createdBy" title="Created by">
          <Row>
            {createdByIssues.map((issue) => (
              <Col key={issue.id} sm={12}>
                <IssueContainer issue={issue} />
              </Col>
            ))}
          </Row>
        </Tab>
        <Tab eventKey="assignedTo" title="Assigned to">
          <Row>
            {assignedToIssues.map((issue) => (
              <Col key={issue.id} sm={12}>
                <IssueContainer issue={issue} />
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
    </div>
  );
};

export default IssuesPage;
