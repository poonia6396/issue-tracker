import React, { useState, useEffect } from "react";
import { getUsers } from "../api/api";
import styles from "./AddMembersModal.module.css";

interface AddMembersModalProps {
  onClose: () => void;
  onAddMember: (email: string, role: string) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({
  onClose,
  onAddMember,
}) => {
  const [users, setUsers] = useState<{ id: number; email: string }[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAdd = () => {
    if (selectedEmail && role) {
      onAddMember(selectedEmail, role);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add Members</h2>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            list="users"
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            className={styles.input}
          />
          <datalist id="users">
            {users.map((user) => (
              <option key={user.id} value={user.email} />
            ))}
          </datalist>
        </div>
        <div className={styles.formGroup}>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.select}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className={styles.formActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleAdd} className={styles.addButton}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
