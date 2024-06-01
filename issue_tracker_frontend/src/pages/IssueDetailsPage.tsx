import React, { useEffect, useState } from "react";
import { getIssueDetails, getComments, addComment } from "../api/api";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";
import { Issue, Comment } from "../interfaces/interfaces";

interface Params extends Record<string, string | undefined> {
  issueId: string;
}

const IssueDetailsPage: React.FC = () => {
  const { issueId } = useParams<Params>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchIssueDetails = async () => {
      const response = await getIssueDetails(Number(issueId));
      setIssue(response.data);
    };

    const fetchComments = async () => {
      const response = await getComments(Number(issueId));
      setComments(response.data);
    };

    fetchIssueDetails();
    fetchComments();
  }, [issueId]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addComment(Number(issueId), { text: newComment });
      setNewComment("");
      const response = await getComments(Number(issueId));
      setComments(response.data);
    } catch (error) {
      console.error("Add comment failed", error);
    }
  };

  return (
    <Container>
      {issue && (
        <>
          <Card>
            <Card.Body>
              <Card.Title>{issue.title}</Card.Title>
              <Card.Text>{issue.description}</Card.Text>
              <Card.Text>
                Created by: {issue.created_by.name} ({issue.created_by.email})
              </Card.Text>
              <Card.Text>
                Assigned to: {issue.assigned_to.name} ({issue.assigned_to.email}
                )
              </Card.Text>
              <Card.Text>Status: {issue.status}</Card.Text>
              <Card.Text>Priority: {issue.priority}</Card.Text>
              <Card.Text>
                Updated at: {new Date(issue.updated_at).toLocaleString()}
              </Card.Text>
              <Card.Text>
                Due date:{" "}
                {issue.due_date
                  ? new Date(issue.due_date).toLocaleDateString()
                  : "N/A"}
              </Card.Text>
              <div>
                Labels:{" "}
                {issue.labels.map((label) => (
                  <span
                    key={label.id}
                    style={{
                      marginRight: "5px",
                      padding: "3px 7px",
                      backgroundColor: "#007bff",
                      color: "white",
                      borderRadius: "3px",
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </Card.Body>
          </Card>
          <div style={{ marginTop: "20px" }}>
            <h5>Comments</h5>
            {comments.map((comment) => (
              <Card key={comment.id} style={{ marginBottom: "10px" }}>
                <Card.Body>{comment.text}</Card.Body>
              </Card>
            ))}
          </div>
          <Form onSubmit={handleCommentSubmit} style={{ marginTop: "20px" }}>
            <Form.Group controlId="commentText">
              <Form.Label>Add a Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={handleCommentChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Comment
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default IssueDetailsPage;
