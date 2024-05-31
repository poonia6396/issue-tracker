import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./IssueForm.module.css";

interface Props {
  onSubmit: (issueData: { title: string; description: string }) => void;
}

const IssueForm: React.FC<Props> = ({ onSubmit }) => {
  const [issueData, setIssueData] = useState({ title: "", description: "" });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIssueData({ ...issueData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(issueData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        name="title"
        value={issueData.title}
        onChange={handleChange}
        placeholder="Title"
        className={styles.input}
      />
      <textarea
        name="description"
        value={issueData.description}
        onChange={handleChange}
        placeholder="Description"
        className={styles.textarea}
      />
      <button type="submit" className={styles.button}>
        Create
      </button>
    </form>
  );
};

export default IssueForm;
