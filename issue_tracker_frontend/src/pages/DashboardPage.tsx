import React, { useEffect, useState } from "react";
import { getProjects } from "../api/api";
import ProjectList from "../components/ProjectList";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaFilter, FaListOl, FaSearch, FaSignal } from "react-icons/fa";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import styles from "./DashboardPage.module.css";
import { Project } from "../interfaces/interfaces";
import { useUser } from "../contexts/UserContext";

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const firstNameLetter = user ? user.email.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getProjects();
      setProjects(response.data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="d-flex h-100">
      <div className={`bg-light p-3 ${styles.sidebar}`}>
        <Button
          onClick={() => navigate("/create-project")}
          variant="primary"
          className="w-100 mb-3"
        >
          <FaPlus className="me-2" />
          Create Project
        </Button>
        <div className="d-flex flex-column gap-2">
          <Button variant="outline-secondary" className="w-100">
            <FaFilter />
          </Button>
          <Button variant="outline-secondary" className="w-100">
            <FaListOl />
          </Button>
          <Button variant="outline-secondary" className="w-100">
            <FaSearch />
          </Button>
        </div>
      </div>
      <div className="flex-grow-1 bg-white p-4 overflow-auto">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Projects</h1>
          <div className="d-flex align-items-center gap-3">
            <InputGroup>
              <FormControl placeholder="Search projects..." />
            </InputGroup>
            <Button variant="outline-secondary">
              <FaSignal />
            </Button>
            <Button className="profileImage" variant="outline-secondary">
              {firstNameLetter}
            </Button>
          </div>
        </header>
        <ProjectList projects={projects} />
      </div>
    </div>
  );
};

export default DashboardPage;
