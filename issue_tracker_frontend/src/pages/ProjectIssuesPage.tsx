// src/pages/ProjectIssues.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getIssuesForProject } from "../api/api";
import IssueContainer from "../components/IssueContainer";
import {
  Container,
  Row,
  Col,
  Form,
  Dropdown,
  DropdownButton,
  Pagination,
} from "react-bootstrap";
import { Issue } from "../interfaces/interfaces";

const ProjectIssues: React.FC = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchIssues = async () => {
      if (projectId) {
        const response = await getIssuesForProject(Number(projectId));
        setIssues(response.data);
      }
    };
    fetchIssues();
  }, [projectId]);

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

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Project Issues</h1>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search issues..."
            className="me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownButton
            id="sort-by-dropdown"
            title={`Sort by: ${sortBy}`}
            className="me-2"
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
          >
            <Dropdown.Item onClick={() => setSortOrder("asc")}>
              Ascending
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOrder("desc")}>
              Descending
            </Dropdown.Item>
          </DropdownButton>
        </Form>
      </div>
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
