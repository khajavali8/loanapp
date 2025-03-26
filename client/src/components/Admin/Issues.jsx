import React, { useEffect, useState } from "react";
import axios from "axios";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError(" Unauthorized: Please log in.");
      return;
    }

    axios
      .get("http://localhost:5000/api/issues/all-issues", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setIssues(response.data))
      .catch((error) => {
        console.error("Error fetching issues:", error);
        setError(" Failed to fetch issues. Please log in again.");
      });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📌 Reported Issues</h2>
      {error && <p style={styles.errorText}>{error}</p>}

      {issues.length === 0 ? (
        <p style={styles.noIssuesText}>✅ No issues reported.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Reported By</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} style={styles.row}>
                <td style={styles.td}>{issue.issueTitle}</td>
                <td style={styles.td}>{issue.issueDescription}</td>
                <td style={styles.td}>
                  {issue.user?.firstName} {issue.user?.lastName} <br />
                  <span style={styles.email}>📧 {issue.user?.email}</span>
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
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "90%",
    margin: "auto",
  },
  heading: {
    fontSize: "26px",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: "18px",
    fontWeight: "bold",
  },
  noIssuesText: {
    color: "#555",
    fontSize: "18px",
    fontStyle: "italic",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "white",
  },
  th: {
    padding: "12px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
  },
  row: {
    transition: "background 0.3s",
  },
  rowHover: {
    backgroundColor: "#f1f1f1",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  email: {
    fontSize: "14px",
    color: "#555",
  },
};

export default Issues;
