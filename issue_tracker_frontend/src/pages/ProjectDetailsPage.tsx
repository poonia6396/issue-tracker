import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
} from "../api/api";
import AddMembersModal from "../components/AddMembersModal";
import styles from "./ProjectDetailsPage.module.css";

interface Member {
  id: number;
  user: number;
  project: number;
  role: string;
  user_email: string;
  project_name: string;
}

interface Project {
  id: number;
  name: string;
  members: Member[];
}

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectResponse = await getProject(Number(projectId));
        const membersResponse = await getProjectMembers(Number(projectId));
        setProject({ ...projectResponse.data, members: membersResponse.data });
      } catch (error) {
        console.error("Failed to fetch project", error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleAddMembers = async (email: string, role: string) => {
    try {
      await addProjectMember(Number(projectId), { email, role });
      const membersResponse = await getProjectMembers(Number(projectId));
      setProject(
        (prevProject) =>
          prevProject && { ...prevProject, members: membersResponse.data }
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add member", error);
    }
  };

  const handleRemoveMember = async (email: string) => {
    try {
      await removeProjectMember(Number(projectId), { email: email });
      const membersResponse = await getProjectMembers(Number(projectId));
      setProject(
        (prevProject) =>
          prevProject && { ...prevProject, members: membersResponse.data }
      );
    } catch (error) {
      console.error("Failed to remove member", error);
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
              <li key={member.id}>
                {member.user_email} - {member.role}
                <button
                  onClick={() => handleRemoveMember(member.user_email)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </li>
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
              onAddMember={handleAddMembers}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
