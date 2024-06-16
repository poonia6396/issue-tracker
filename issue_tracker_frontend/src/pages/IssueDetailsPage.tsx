// IssueDetailsPage.tsx

import React, { useEffect, useState } from "react";
import {
  getIssueDetails,
  getComments,
  addComment,
  updateIssueLabels,
  updateIssueAssignee,
  updateIssueStatus,
  getProjectMembers,
  updateComment,
  deleteComment,
  updateIssueDueDate,
} from "../api/api";
import { useParams } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { User, Issue, Comment } from "../interfaces/interfaces";
import IssueDetails from "../components/IssueDetails";
import IssueSidePanel from "../components/IssueSidePanel";
import CommentsSection from "../components/CommentsSection";
import styles from "./IssueDetailsPage.module.css";

const IssueDetailsPage: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [newAssignee, setNewAssignee] = useState<User | null>(null);

  useEffect(() => {
    const fetchIssueDetails = async () => {
      const response = await getIssueDetails(Number(issueId));
      setIssue(response.data);
    };

    const fetchComments = async () => {
      const response = await getComments(Number(issueId));
      setComments(response.data);
    };

    const fetchProjectMembers = async () => {
      const projectId = 1; // You may need to get the projectId from the issue details or other context
      const response = await getProjectMembers(projectId);
      setProjectMembers(response.data);
    };

    fetchIssueDetails();
    fetchComments();
    fetchProjectMembers();
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

  const handleEditComment = async (commentId: number, newText: string) => {
    try {
      await updateComment(commentId, { text: newText });
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, text: newText } : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Edit comment failed", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId);
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const handleAddLabel = async () => {
    if (newLabel.trim() !== "") {
      const updatedLabels = [
        ...(issue?.labels || []),
        { id: Date.now(), name: newLabel.trim() },
      ];
      try {
        await updateIssueLabels(Number(issueId), {
          labels: updatedLabels.map((label) => ({ name: label.name })),
        });
        setIssue((prevIssue) =>
          prevIssue ? { ...prevIssue, labels: updatedLabels } : prevIssue
        );
        setNewLabel("");
      } catch (error) {
        console.error("Add label failed", error);
      }
    }
  };

  const handleRemoveLabel = async (labelId: number) => {
    const updatedLabels =
      issue?.labels.filter((label) => label.id !== labelId) || [];
    try {
      await updateIssueLabels(Number(issueId), {
        labels: updatedLabels.map((label) => ({ name: label.name })),
      });
      setIssue((prevIssue) =>
        prevIssue ? { ...prevIssue, labels: updatedLabels } : prevIssue
      );
    } catch (error) {
      console.error("Remove label failed", error);
    }
  };

  const handleAddAssignee = async () => {
    if (newAssignee) {
      try {
        await updateIssueAssignee(Number(issueId), {
          assigned_to_id: newAssignee.id,
        });
        setIssue((prevIssue) =>
          prevIssue ? { ...prevIssue, assigned_to: newAssignee } : prevIssue
        );
      } catch (error) {
        console.error("Add assignee failed", error);
      }
    }
  };

  const handleUpdateDueDate = async (dueDate: Date | null) => {
    if (dueDate) {
      try {
        await updateIssueDueDate(Number(issueId), {
          due_date: dueDate.toISOString().split("T")[0],
        });
        setIssue((prevIssue) =>
          prevIssue ? { ...prevIssue, due_date: dueDate } : prevIssue
        );
      } catch (error) {
        console.error("Add due date failed", error);
      }
    }
  };

  const handleStatusToggle = async () => {
    if (issue) {
      const newStatus = issue.status === "Open" ? "Closed" : "Open";
      await updateIssueStatus(issue.id, newStatus);
      setIssue({ ...issue, status: newStatus });
    }
  };

  if (!issue) return <div>Loading...</div>;

  return (
    <Container className={styles.container}>
      <div className={styles.mainContent}>
        <IssueDetails issue={issue} />
        <Button onClick={handleStatusToggle} className="mt-3">
          {issue.status === "Open" ? "Close Issue" : "Open Issue"}
        </Button>
        <CommentsSection
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleCommentChange={handleCommentChange}
          handleCommentSubmit={handleCommentSubmit}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          isIssueOpen={issue.status === "Open"}
        />
      </div>
      <IssueSidePanel
        labels={issue.labels}
        newLabel={newLabel}
        setNewLabel={setNewLabel}
        handleAddLabel={handleAddLabel}
        handleRemoveLabel={handleRemoveLabel}
        projectMembers={projectMembers}
        newAssignee={newAssignee}
        setNewAssignee={setNewAssignee}
        handleAddAssignee={handleAddAssignee}
        onUpdateDueDate={handleUpdateDueDate}
        issue={issue}
      />
    </Container>
  );
};

export default IssueDetailsPage;
