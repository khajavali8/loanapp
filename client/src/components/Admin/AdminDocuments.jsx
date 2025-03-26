import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AdminDocuments.css';

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/all-documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Documents fetched:', response.data); // ✅ Add this to debug
      setDocuments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error); // ✅ Add this to catch errors
      setError(error.response?.data?.message || 'Failed to fetch documents');
      setLoading(false);
    }
  };
  

  const handleVerify = async (documentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/documents/${documentId}/verify`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchDocuments(); // Re-fetch the documents after verification
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to verify document');
    }
  };

  const handleViewDocument = (documentUrl) => {
    const baseUrl = 'http://localhost:5000/';
    const fixedUrl = documentUrl.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    const completeUrl = `${baseUrl}${fixedUrl}`;
    console.log('Opening URL:', completeUrl);
    window.open(completeUrl, '_blank');
  };
  

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-documents">
      <h2>All User Documents</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {documents.length > 0 ? (
    documents.map((doc, index) => (
      <tr key={doc._id || index}>
        <td>{doc.title || 'No title'}</td>
        <td>{doc.type || 'No type'}</td>
        <td>{doc.owner?.firstName} {doc.owner?.lastName}</td>
        <td>{doc.isVerified ? 'Verified' : 'Pending'}</td>
        <td>
          <button onClick={() => handleViewDocument(doc.filePath)} className="view-btn">
            View Document
          </button>
          {!doc.isVerified && (
            <button onClick={() => handleVerify(doc._id)} className="verify-btn">
              Verify
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5">No documents found</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default AdminDocuments;
