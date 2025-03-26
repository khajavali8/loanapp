import React, { useState } from "react";
import axios from "../../services/api";
import "../../styles/FarmITStyles.css";

const DocumentUpload = () => {
  const [document, setDocument] = useState({
    title: "",
    type: "farm_certificate",
    relatedToModel: "",
    relatedToId: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setDocument({ ...document, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", document.title);
      formData.append("type", document.type);
      formData.append("document", file);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post("/documents/upload", formData, config);
      alert("Document uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to upload document");
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2 className="upload-title">Upload Document</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            name="title"
            placeholder="Document Title"
            onChange={handleChange}
            required
            className="upload-input"
          />
          <select name="type" onChange={handleChange} required className="upload-select">
            <option value="farm_certificate">Farm Certificate</option>
            <option value="loan_agreement">Loan Agreement</option>
            <option value="identity_proof">Identity Proof</option>
            <option value="other">Other</option>
          </select>
          <div className="file-input-container">
            <label htmlFor="file-upload" className="file-input-label">
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              required
              className="file-input"
            />
            {file && <p className="file-name">{file.name}</p>}
          </div>
          <button type="submit" className="upload-button">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
