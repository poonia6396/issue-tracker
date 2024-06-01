// src/pages/IssuesPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import { getIssuesCreatedBy, getIssuesAssignedTo } from "../api/api";
import IssueContainer from "../components/IssueContainer";

const IssuesPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [key, setKey] = useState("createdBy");
  const [createdByIssues, setCreatedByIssues] = useState([]);
  const [assignedToIssues, setAssignedToIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const createdByResponse = await getIssuesCreatedBy(Number(userId));
        setCreatedByIssues(createdByResponse.data);
        const assignedToResponse = await getIssuesAssignedTo(Number(userId));
        setAssignedToIssues(assignedToResponse.data);
      } catch (error) {
        console.error("Failed to fetch issues", error);
      }
    };
    fetchIssues();
  }, [userId]);

  return (
    <Container>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
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
  );
};

export default IssuesPage;
