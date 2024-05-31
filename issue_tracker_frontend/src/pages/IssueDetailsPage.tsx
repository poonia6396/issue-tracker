import React, { useEffect, useState } from "react";
import { getIssueDetails, getComments, addComment } from "../api/api";
import { useParams } from "react-router-dom";
import styles from "./IssueDetailsPage.module.css";

interface Comment {
  id: number;
  text: string;
}

interface Issue {
  title: string;
  description: string;
}

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
    <div className={styles.container}>
      {issue && (
        <>
          <h1 className={styles.title}>{issue.title}</h1>
          <p className={styles.description}>{issue.description}</p>
          <div className={styles.comments}>
            <h2>Comments</h2>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                {comment.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Add a comment"
              className={styles.textarea}
            />
            <button type="submit" className={styles.button}>
              Add Comment
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default IssueDetailsPage;
