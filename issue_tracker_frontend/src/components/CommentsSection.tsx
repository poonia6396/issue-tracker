import React, { useState } from "react";
import { Card, Button, Form, Dropdown } from "react-bootstrap";
import Avatar from "react-avatar";
import { Comment } from "../interfaces/interfaces";
import styles from "../pages/IssueDetailsPage.module.css";

interface CommentsSectionProps {
  comments: Comment[];
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCommentSubmit: (e: React.FormEvent) => void;
  handleEditComment: (commentId: number, newText: string) => void;
  handleDeleteComment: (commentId: number) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  newComment,
  handleCommentChange,
  handleCommentSubmit,
  handleEditComment,
  handleDeleteComment,
}) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");

  const handleEdit = (index: number, text: string) => {
    setEditIndex(index);
    setEditedText(text);
  };

  const handleUpdate = (commentId: number) => {
    if (editedText.trim() !== "") {
      handleEditComment(commentId, editedText);
      setEditIndex(null);
      setEditedText("");
    }
  };

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      {comments.map((comment, index) => (
        <Card key={comment.id} className={styles.cardMarginBottom}>
          <div className={styles.commentStrip}>
            <Avatar
              name={comment.created_by.email}
              size="30"
              round
              className={styles.commentAvatar}
            />
            <span className={styles.commentEmail}>
              {comment.created_by.email}
            </span>
            <span className={styles.commentDate}>
              {new Date(comment.created_at).toLocaleString()}
            </span>
            <Dropdown className={styles.commentActionsDropdown}>
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                size="sm"
                className={styles.threeDotButton}
              >
                &#x22EE;
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleEdit(index, comment.text)}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Card.Body>
            {editIndex === index ? (
              <Form.Group controlId="editCommentText">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={() => handleUpdate(comment.id)}
                >
                  Update
                </Button>
              </Form.Group>
            ) : (
              <Card.Text>{comment.text}</Card.Text>
            )}
          </Card.Body>
        </Card>
      ))}
      <Form onSubmit={handleCommentSubmit} className="mt-4">
        <Form.Group controlId="commentText">
          <Form.Label>Add a Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={handleCommentChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">
          Add Comment
        </Button>
      </Form>
    </div>
  );
};

export default CommentsSection;
