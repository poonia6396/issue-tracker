import React, { useEffect, useState } from "react";
import {
  getIssueDetails,
  getComments,
  addComment,
  updateIssueLabels,
  updateIssueAssignee,
  getProjectMembers,
  updateComment,
  deleteComment,
} from "../api/api";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { User, Issue, Comment } from "../interfaces/interfaces";
import IssueDetails from "../components/IssueDetails";
import IssueSidePanel from "../components/IssueSidePanel";
import CommentsSection from "../components/CommentsSection";
import styles from "./IssueDetailsPage.module.css";

interface Params extends Record<string, string | undefined> {
  issueId: string;
}

const IssueDetailsPage: React.FC = () => {
  const { issueId } = useParams<Params>();
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

  useEffect(() => {
    setNewAssignee(issue?.assigned_to ?? null);
  }, [issue]);

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
    try {
      await deleteComment(commentId);
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Delete comment failed", error);
    }
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

  return (
    <Container className={styles.container}>
      {issue && (
        <>
          <div className={styles.mainContent}>
            <IssueDetails issue={issue} />
            <CommentsSection
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              handleCommentChange={handleCommentChange}
              handleCommentSubmit={handleCommentSubmit}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
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
            issue={issue}
          />
        </>
      )}
    </Container>
  );
};

export default IssueDetailsPage;
