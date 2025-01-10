// IssueSidePanel.tsx

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Label, User, Issue } from "../interfaces/interfaces";
import styles from "../pages/IssueDetailsPage.module.css";

interface IssueSidePanelProps {
  labels: Label[];
  newLabel: string;
  setNewLabel: React.Dispatch<React.SetStateAction<string>>;
  handleAddLabel: () => void;
  handleRemoveLabel: (labelId: number) => void;
  projectMembers: User[];
  newAssignee: User | null;
  setNewAssignee: React.Dispatch<React.SetStateAction<User | null>>;
  handleAddAssignee: () => void;
  onUpdateDueDate: (dueDate: Date | null) => void;
  issue: Issue;
}

const IssueSidePanel: React.FC<IssueSidePanelProps> = ({
  labels,
  newLabel,
  setNewLabel,
  handleAddLabel,
  handleRemoveLabel,
  projectMembers,
  newAssignee,
  setNewAssignee,
  handleAddAssignee,
  onUpdateDueDate,
  issue,
}) => {
  const isIssueOpen = issue.status === "Open";

  return (
    <div className={styles.sidePanel}>
      <div className={styles.detailSection}>
        <h5>Details</h5>
        <p>
          <strong>Created by:</strong> {issue.created_by.name} (
          {issue.created_by.email})
        </p>
        <p>
          <strong>Assigned to:</strong>{" "}
          {issue.assigned_to
            ? `${issue.assigned_to.name} (${issue.assigned_to.email})`
            : "Unassigned"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={styles.status}>{issue.status}</span>
        </p>
        <p>
          <strong>Priority:</strong>{" "}
          <span className={styles.priority}>{issue.priority}</span>
        </p>
        <p>
          <strong>Updated at:</strong>{" "}
          {new Date(issue.updated_at).toLocaleString()}
        </p>
        <p>
          <strong>Due date:</strong>{" "}
          {isIssueOpen ? (
            <DatePicker
              className={`${styles.dueDate} form-control` }
              selected={issue.due_date}
              onChange={(date: Date | null) => onUpdateDueDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          ) : issue.due_date ? (
            new Date(issue.due_date).toLocaleDateString()
          ) : (
            "N/A"
          )}
        </p>
      </div>

      <div className={styles.labelSection}>
        <h5>Labels</h5>
        {labels.map((label) => (
          <span
            key={label.id}
            className={`${styles.labelSpan} ${
              styles[label.name.toLowerCase()]
            }`}
          >
            {label.name}
            {isIssueOpen && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleRemoveLabel(label.id)}
                className={styles.labelButton}
              >
                X
              </Button>
            )}
          </span>
        ))}
        {isIssueOpen && (
          <InputGroup className={styles.inputGroupMargin}>
            <Form.Control
              type="text"
              placeholder="Add label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={handleAddLabel}>
              Add
            </Button>
          </InputGroup>
        )}
      </div>

      {isIssueOpen && (
        <div className={styles.assigneeSection}>
          <h5>Assignee</h5>
          <Form.Group>
            <Form.Control
              as="select"
              value={newAssignee ? newAssignee.id : ""}
              onChange={(e) => {
                const selectedUser = projectMembers.find(
                  (member) => member.id === Number(e.target.value)
                );
                setNewAssignee(selectedUser || null);
              }}
            >
              {projectMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.email}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button
            variant="outline-secondary"
            onClick={handleAddAssignee}
            className="mr-2"
          >
            Assign
          </Button>
        </div>
      )}
    </div>
  );
};

export default IssueSidePanel;
