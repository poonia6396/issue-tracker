// src/pages/ProjectIssues.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIssuesForProject, getProjectMembers } from "../api/api";
import IssueContainer from "../components/IssueContainer";
import {
  Container,
  Row,
  Col,
  FormControl,
  InputGroup,
  Dropdown,
  DropdownButton,
  Pagination,
  Button,
  Form,
} from "react-bootstrap";
import { Issue, Label, User } from "../interfaces/interfaces";
import styles from "./ProjectIssuesPage.module.css";

const ProjectIssues: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<number[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchIssues = async () => {
      if (projectId) {
        const response = await getIssuesForProject(
          Number(projectId),
          selectedLabels,
          selectedAssignees
        );
        setIssues(response.data);
      }
    };
    fetchIssues();
  }, [projectId, selectedLabels, selectedAssignees]);

  // Fetch labels and members for filters
  useEffect(() => {
    const fetchLabelsAndMembers = async () => {
      // Replace with actual API calls to fetch labels and members
      //const labelsResponse = await getLabelsForProject(Number(projectId));
      const membersResponse = await getProjectMembers(Number(projectId));
      //setLabels(labelsResponse.data);
      setMembers(membersResponse.data);
    };
    fetchLabelsAndMembers();
  }, [projectId]);

  const handleLabelChange = (labelId: number) => {
    setSelectedLabels((prevLabels) =>
      prevLabels.includes(labelId)
        ? prevLabels.filter((id) => id !== labelId)
        : [...prevLabels, labelId]
    );
  };

  const handleAssigneeChange = (assigneeId: number) => {
    setSelectedAssignees((prevAssignees) =>
      prevAssignees.includes(assigneeId)
        ? prevAssignees.filter((id) => id !== assigneeId)
        : [...prevAssignees, assigneeId]
    );
  };

  const filteredIssues = useMemo(() => {
    return issues
      .filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "date") {
          return sortOrder === "asc"
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();
        } else if (sortBy === "status") {
          return sortOrder === "asc"
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        } else if (sortBy === "assigned_to") {
          return sortOrder === "asc"
            ? a.assigned_to.email.localeCompare(b.assigned_to.email)
            : b.assigned_to.email.localeCompare(a.assigned_to.email);
        }
        return 0;
      });
  }, [issues, searchTerm, sortBy, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  const handleCreateIssue = () => {
    navigate(`/project/${projectId}/issues/create`);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Project Issues</h1>
        <div className={styles.controlGroup}>
          <InputGroup className={styles.searchInputGroup}>
            <FormControl
              type="search"
              placeholder="Search issues..."
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
            className={styles.createIssueButton}
            onClick={handleCreateIssue}
          >
            Create Issue
          </Button>
        </div>
      </div>
      <Row className="mb-4">
        <Col md={6}>
          <h5>Filter by Labels</h5>
          <Form>
            {labels.map((label) => (
              <Form.Check
                key={label.id}
                type="checkbox"
                id={`label-${label.id}`}
                label={label.name}
                checked={selectedLabels.includes(label.id)}
                onChange={() => handleLabelChange(label.id)}
              />
            ))}
          </Form>
        </Col>
        <Col md={6}>
          <h5>Filter by Assignees</h5>
          <Form>
            {members.map((member) => (
              <Form.Check
                key={member.id}
                type="checkbox"
                id={`assignee-${member.id}`}
                label={member.email}
                checked={selectedAssignees.includes(member.id)}
                onChange={() => handleAssigneeChange(member.id)}
              />
            ))}
          </Form>
        </Col>
      </Row>
      <Row>
        {currentItems.map((issue) => (
          <Col key={issue.id} xs={12} sm={6} md={4}>
            <IssueContainer issue={issue} />
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </Container>
  );
};

export default ProjectIssues;
