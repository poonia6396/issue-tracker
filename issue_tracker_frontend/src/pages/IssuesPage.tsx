// src/pages/IssuesPage.tsx
import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import { getIssuesCreatedBy, getIssuesAssignedTo } from "../api/api";
import IssueContainer from "../components/IssueContainer";
import { useUser } from "../contexts/UserContext";
import { Issue } from "../interfaces/interfaces";

const IssuesPage: React.FC = () => {
  const { user } = useUser();
  const [key, setKey] = useState("createdBy");
  const [createdByIssues, setCreatedByIssues] = useState<Issue[]>([]);
  const [assignedToIssues, setAssignedToIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      if (user) {
        try {
          const createdByResponse = await getIssuesCreatedBy(Number(user.id));
          setCreatedByIssues(createdByResponse.data);
          const assignedToResponse = await getIssuesAssignedTo(Number(user.id));
          setAssignedToIssues(assignedToResponse.data);
        } catch (error) {
          console.error("Failed to fetch issues", error);
        }
      }
    };
    fetchIssues();
  }, [user]);

  return (
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
  );
};

export default IssuesPage;
