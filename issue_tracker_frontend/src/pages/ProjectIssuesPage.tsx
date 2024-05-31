import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIssuesForProject } from "../api/api";
import axiosInstance from "../api/axiosInstance";
import styles from "./ProjectIssuesPage.module.css";

interface Issue {
  id: number;
  title: string;
  description: string;
}

const ProjectIssuesPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectIssues = async () => {
      try {
        const issuesResponse = await getIssuesForProject(Number(projectId));
        setIssues(issuesResponse.data);

        // Assuming you have an endpoint to fetch a single project's details
        const projectResponse = await axiosInstance.get(
          `/projects/projects/${projectId}/`
        );
        setProjectName(projectResponse.data.name);
      } catch (error) {
        console.error("Failed to fetch issues", error);
      }
    };

    fetchProjectIssues();
  }, [projectId]);

  const handleCreateIssue = () => {
    navigate(`/project/${projectId}/issues/create`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Issues for {projectName}</h1>
      <button className={styles.createIssueButton} onClick={handleCreateIssue}>
        Create Issue
      </button>
      <ul className={styles.issueList}>
        {issues.map((issue) => (
          <li key={issue.id} className={styles.issueItem}>
            <h2>{issue.title}</h2>
            <p>{issue.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectIssuesPage;
