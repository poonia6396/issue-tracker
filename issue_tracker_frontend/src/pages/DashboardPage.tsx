import React, { useEffect, useState } from "react";
import { getProjects } from "../api/api";
import ProjectList from "../components/ProjectList";
import { useNavigate } from "react-router-dom";
import {
  Button,
  InputGroup,
  FormControl,
  Dropdown,
  DropdownButton,
  Spinner,
} from "react-bootstrap";
import styles from "./DashboardPage.module.css";
import { Project } from "../interfaces/interfaces";
import { useUser } from "../contexts/UserContext";

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const firstNameLetter = user ? user.email.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Set loading to true before fetching
      const response = await getProjects();
      setProjects(response.data);
      setLoading(false); // Set loading to false after fetching
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Projects</h1>
        <div className={styles.controlGroup}>
          <InputGroup className={styles.searchInputGroup}>
            <FormControl
              type="search"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <DropdownButton
            id="sort-by-dropdown"
            title={`Sort by: ${sortBy}`}
            className={`me-2 ${styles.customDropdown}`}
          >
            <Dropdown.Item onClick={() => setSortBy("date")}>
              Date
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy("status")}>
              Status
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy("assigned_to")}>
              Assignee
            </Dropdown.Item>
          </DropdownButton>
          <DropdownButton
            id="order-by-dropdown"
            title={`Order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            className={`me-2 ${styles.customDropdown}`}
          >
            <Dropdown.Item onClick={() => setSortOrder("asc")}>
              Ascending
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOrder("desc")}>
              Descending
            </Dropdown.Item>
          </DropdownButton>
          <Button
            className={`${styles.createButton} ${styles.customButton}`}
            onClick={handleCreateProject}
          >
            Create Project
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <ProjectList projects={filteredProjects} />
      )}
    </div>
  );
};

export default DashboardPage;
