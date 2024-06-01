import React, { useState, useEffect } from "react";
import { getProjectMembers } from "../api/api"; // Assuming you have an API to get the users
import styles from "./CreateIssueForm.module.css";

interface CreateIssueFormProps {
  projectId: number;
  onSubmit: (issue: {
    title: string;
    description: string;
    assigned_to_id: number | null;
    labels: { name: string }[];
  }) => void;
}

const CreateIssueForm: React.FC<CreateIssueFormProps> = ({
  projectId,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState<number | null>(null);
  const [labels, setLabels] = useState<{ name: string }[]>([]); // Initialize with an empty array of objects
  const [users, setUsers] = useState<{ user: number; user_email: string }[]>(
    []
  );
  const [labelInput, setLabelInput] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getProjectMembers(Number(projectId));
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [projectId]);

  const handleAddLabel = () => {
    if (labelInput.trim()) {
      setLabels([...labels, { name: labelInput.trim() }]);
      setLabelInput("");
    }
  };

  const handleRemoveLabel = (labelName: string) => {
    setLabels(labels.filter((label) => label.name !== labelName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, assigned_to_id: assignedToId, labels });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Assignee</label>
        <select
          value={assignedToId ?? ""}
          onChange={(e) =>
            setAssignedToId(e.target.value ? Number(e.target.value) : null)
          }
          className={styles.select}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.user} value={user.user}>
              {user.user_email}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Labels</label>
        <div className={styles.labelsContainer}>
          {labels.map((label) => (
            <span key={label.name} className={styles.labelItem}>
              {label.name}
              <button
                type="button"
                onClick={() => handleRemoveLabel(label.name)}
                className={styles.removeLabelButton}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          className={styles.input}
        />
        <button
          type="button"
          onClick={handleAddLabel}
          className={styles.addButton}
        >
          Add Label
        </button>
      </div>
      <button type="submit" className={styles.submitButton}>
        Create Issue
      </button>
    </form>
  );
};

export default CreateIssueForm;
