import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please log in again.");
        setLoading(false);
      });
  }, []);

  const handleVerify = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map((user) =>
        user._id === id ? { ...user, isVerified: true } : user
      ));
      alert("User successfully verified!");
    } catch (error) {
      console.error("Error verifying user:", error);
      setError("Failed to verify user.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Users</h2>

      {loading ? (
        <p style={styles.loadingText}>Loading users...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={styles.row}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td style={user.isVerified ? styles.verified : styles.notVerified}>
                  {user.isVerified ? "Verified" : "Not Verified"}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {!user.isVerified && (
                    <button
                      onClick={() => handleVerify(user._id)}
                      style={styles.verifyButton}
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "95%",
    margin: "auto",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  loadingText: {
    color: "#555",
    fontSize: "18px",
  },
  errorText: {
    color: "red",
    fontSize: "18px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "5px",
    overflow: "hidden",
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  },
  headerRow: {
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    textAlign: "left",
  },
  row: {
    borderBottom: "1px solid #ddd",
    height: "50px",
  },
  verified: {
    color: "#28a745",
    fontWeight: "bold",
  },
  notVerified: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  verifyButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
    transition: "0.3s",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

styles.verifyButton["onMouseOver"] = (e) => (e.target.style.backgroundColor = "#218838");
styles.verifyButton["onMouseOut"] = (e) => (e.target.style.backgroundColor = "#28a745");
styles.deleteButton["onMouseOver"] = (e) => (e.target.style.backgroundColor = "#c82333");
styles.deleteButton["onMouseOut"] = (e) => (e.target.style.backgroundColor = "#dc3545");

export default ManageUsers;
