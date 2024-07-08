import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIssuesForProject, getProjectMembers } from "../api/api";
import IssueContainer from "../components/IssueContainer";
import Select from 'react-select';
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
  Spinner,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";
import { Issue, Label, User } from "../interfaces/interfaces";
import styles from "./ProjectIssuesPage.module.css";

const ProjectIssues: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [issueStatus, setIssueStatus] = useState("Open"); // Add state for issue status
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchIssues = async () => {
      if (projectId) {
        setLoading(true);
        try {
          const response = await getIssuesForProject(
            Number(projectId),
            selectedLabels,
            selectedAssignees
          );
          setIssues(response.data);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchIssues();
  }, [projectId, selectedLabels, selectedAssignees]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (projectId) {
        const membersResponse = await getProjectMembers(Number(projectId));
        setMembers(membersResponse.data);
      }
    };
    fetchMembers();
  }, [projectId]);

  useEffect(() => {
    const uniqueLabels = new Set<string>();
    issues.forEach(issue => {
      issue.labels.forEach(label => uniqueLabels.add(label.name));
    });
    setLabels(Array.from(uniqueLabels));
  }, [issues]);

  const handleLabelChange = (selectedOptions: any) => {
    setSelectedLabels(selectedOptions.map((option: any) => option.value));
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
          (issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (issueStatus === "all" || issue.status === issueStatus)
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
  }, [issues, searchTerm, sortBy, sortOrder, issueStatus]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  const handleCreateIssue = () => {
    navigate(`/project/${projectId}/issues/create`);
  };

  return (
    <Container className="py-4">
      {loading && (
        <div className={`${styles.overlay} ${loading ? styles["fade-in"] : styles.hidden}`}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
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
          <Select
            className={`${styles.labelsFilter}`}
            isMulti
            options={labels.map(label => ({ value: label, label: label }))}
            onChange={handleLabelChange}
          />
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
      <Row className="mb-4">
        <Col>
          <h5>Filter by Status</h5>
          <ToggleButtonGroup
            type="radio"
            name="status"
            value={issueStatus}
            onChange={(val) => setIssueStatus(val)}
          >
            <ToggleButton id="status-open" value="Open">
              Open
            </ToggleButton>
            <ToggleButton id="status-closed" value="Closed">
              Closed
            </ToggleButton>
            <ToggleButton id="status-all" value="all">
              All
            </ToggleButton>
          </ToggleButtonGroup>
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
