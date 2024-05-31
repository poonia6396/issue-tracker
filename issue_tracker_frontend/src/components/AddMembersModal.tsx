import React, { useState, useEffect } from "react";
import { getUsers, createUser } from "../api/api";
import styles from "./AddMembersModal.module.css";

interface AddMembersModalProps {
  onClose: () => void;
  onAddMembers: (memberIds: number[]) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({
  onClose,
  onAddMembers,
}) => {
  const [users, setUsers] = useState<{ id: number; email: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");

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

  const handleCreateUser = async () => {
    try {
      const response = await createUser({ email: newUserEmail });
      setSelectedUsers([...selectedUsers, response.data.id]);
      setNewUserEmail("");
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  const handleSubmit = () => {
    onAddMembers(selectedUsers);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add Members</h2>
        <div className={styles.formGroup}>
          <label>Existing Users</label>
          <select
            multiple
            onChange={(e) => {
              const options = e.target.options;
              const selected = [];
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                  selected.push(Number(options[i].value));
                }
              }
              setSelectedUsers(selected);
            }}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>New User Email</label>
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <button onClick={handleCreateUser}>Add New User</button>
        </div>
        <div className={styles.formActions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Add Members</button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
