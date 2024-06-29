import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createIssue } from "../api/api";
import { Spinner } from "react-bootstrap";
import CreateIssueForm from "../components/CreateIssueForm";
import styles from "./CreateIssuePage.module.css";

const CreateIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [loading, setLoading ] = useState(true);
  
  const handleCreateIssue = async (issue: {
    title: string;
    description: string;
    assigned_to_id: number | null;
    labels: { name: string }[];
  }) => {
    try {
      setLoading(true);
      await createIssue(issue, Number(projectId));
      setLoading(false);
      navigate(`/project/${projectId}/issues`);
    } catch (error) {
      console.error("Failed to create issue", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Issue</h1>
      <CreateIssueForm
        onSubmit={handleCreateIssue}
        projectId={Number(projectId)}
      />
    </div>
  );
};

export default CreateIssuePage;
