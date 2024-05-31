import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import styles from "./ProjectDetailsPage.module.css";
import AddMembersModal from "../components/AddMembersModal";

interface Project {
  id: number;
  name: string;
  members: { id: number; email: string }[];
}

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(
          `/projects/projects/${projectId}/`
        );
        setProject(response.data);
      } catch (error) {
        console.error("Failed to fetch project", error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleAddMembers = async (memberIds: number[]) => {
    try {
      await axiosInstance.patch(`/projects/projects/${projectId}/`, {
        members: memberIds,
      });
      const response = await axiosInstance.get(
        `/projects/projects/${projectId}/`
      );
      setProject(response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add members", error);
    }
  };

  return (
    <div className={styles.container}>
      {project && (
        <>
          <h1 className={styles.title}>{project.name}</h1>
          <h2>Members</h2>
          <ul>
            {project.members.map((member) => (
              <li key={member.id}>{member.email}</li>
            ))}
          </ul>
          <button
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            Add Members
          </button>
          {isModalOpen && (
            <AddMembersModal
              onClose={() => setIsModalOpen(false)}
              onAddMembers={handleAddMembers}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
