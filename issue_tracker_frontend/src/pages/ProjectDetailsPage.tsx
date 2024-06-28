import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProject,
  getProjectMemberships,
  addProjectMember,
  removeProjectMember,
  updateProject,
  getIssuesForProject,
} from "../api/api";
import { Project, Label, User } from "../interfaces/interfaces";
import AddMembersModal from "../components/AddMembersModal";
import {
  Badge,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { FaUserPlus, FaUserMinus, FaEdit } from "react-icons/fa";
import styles from "./ProjectDetailsPage.module.css";
import { useUser } from "../contexts/UserContext";

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true); 
        const projectResponse = await getProject(Number(projectId));
        const membersResponse = await getProjectMemberships(Number(projectId));
        setProject({
          ...projectResponse.data,
          memberships: membersResponse.data,
        });
        setEditedTitle(projectResponse.data.name);
        setEditedDescription(projectResponse.data.description);
        setLoading(false); 
      } catch (error) {
        console.error("Failed to fetch project", error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleEdit = async () => {
    try {
      await updateProject(Number(projectId), {
        name: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project", error);
    }
  };

  const handleAddMembers = async (email: string, role: string) => {
    try {
      setLoading(true); 
      await addProjectMember(Number(projectId), { email, role });
      const membersResponse = await getProjectMemberships(Number(projectId));
      setProject(
        (prevProject) =>
          prevProject && { ...prevProject, memberships: membersResponse.data }
      );
      setIsModalOpen(false);
      setLoading(false); 
    } catch (error) {
      console.error("Failed to add member", error);
    }
  };

  const handleRemoveMember = async (email: string) => {
    try {
      await removeProjectMember(Number(projectId), { email });
      const membersResponse = await getProjectMemberships(Number(projectId));
      setProject(
        (prevProject) =>
          prevProject && { ...prevProject, memberships: membersResponse.data }
      );
    } catch (error) {
      console.error("Failed to remove member", error);
    }
  };

  const isAdmin = project?.memberships.some(
    (membership) =>
      membership.user_email === user?.email && membership.role === "admin"
  );

  return (
    <div className="login-container">
      {loading && (
        <div className={`${styles.overlay} ${loading ? styles["fade-in"] : styles.hidden}`}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    <Container className={styles.container}>
      {project && (
        <>
          <Row className="justify-content-center text-center mb-4">
            <Col md={8}>
              {isEditing ? (
                <>
                  <Form.Control
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <Form.Control
                    as="textarea"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                  <Button onClick={handleEdit}>Save</Button>
                </>
              ) : (
                <>
                  <h1 className={styles.title}>{project.name}</h1>
                  <p className={styles.description}>{project.description}</p>
                  {isAdmin && (
                    <Button onClick={() => setIsEditing(true)}>
                      <FaEdit />
                    </Button>
                  )}
                </>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Manage Members</h2>
              <ListGroup>
                {project.memberships.map((membership) => (
                  <ListGroup.Item key={membership.user}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {membership.user_email}
                        <Badge
                          bg={
                            membership.role === "admin" ? "danger" : "secondary"
                          }
                          className="ms-2"
                        >
                          {membership.role}
                        </Badge>
                      </div>
                      {isAdmin && membership.role !== "admin" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            handleRemoveMember(membership.user_email)
                          }
                        >
                          <FaUserMinus /> Remove
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {isAdmin && (
                <Button className="mt-3" onClick={() => setIsModalOpen(true)}>
                  <FaUserPlus className="me-2" />
                  Add Members
                </Button>
              )}
            </Col>
          </Row>
          <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
            <AddMembersModal
              onClose={() => setIsModalOpen(false)}
              onAddMember={handleAddMembers}
            />
          </Modal>
        </>
      )}
    </Container>
    </div>
  );
};

export default ProjectDetailsPage;
