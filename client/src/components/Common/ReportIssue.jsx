import React, { useState } from "react";

const ReportIssue = () => {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token"); 

    try {
      const response = await fetch("http://localhost:5000/api/issues/add-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ issueTitle, issueDescription: issueDescription }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Issue reported successfully!");
        setIssueTitle("");
        setIssueDescription("");
      } else {
        setMessage(data.message || "Failed to report issue.");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Report an Issue</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Issue Title:</label>
        <input
          type="text"
          value={issueTitle}
          onChange={(e) => setIssueTitle(e.target.value)}
          required
          style={styles.input}
        />

        <label>Issue Description:</label>
        <textarea
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "8px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
  textarea: { padding: "8px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "80px" },
  button: { padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  message: { color: "green", fontWeight: "bold" },
};

export default ReportIssue;
