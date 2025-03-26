import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import "../../styles/FarmITStyles.css";

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("/documents/my-documents", config);
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch documents");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/documents/${id}`, config);
      alert("Document deleted successfully!");
      fetchDocuments(); // Refresh the document list
    } catch (error) {
      console.error("Error deleting document:", error);
      alert(error.response?.data?.message || "Failed to delete document");
    }
  };

  return (
    <div className="document-container">
      <h2>My Documents</h2>
      {documents.length === 0 ? (
        <p className="no-documents">No documents uploaded.</p>
      ) : (
        <div className="document-grid">
          {documents.map((doc) => (
            <div key={doc._id} className="document-card">
              <h3 className="document-title">{doc.title}</h3>
              <p><strong>Type:</strong> {doc.type}</p>
              <p><strong>Uploaded:</strong> {new Date(doc.uploadedAt).toLocaleDateString()}</p>

              <div className="document-actions">
                <a
                  href={`http://localhost:5000/${doc.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  View
                </a>
                <button className="delete-button" onClick={() => handleDelete(doc._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDocuments;
