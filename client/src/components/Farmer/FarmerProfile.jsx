import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import "../../styles/UserProfile.css";

const UserProfile = () => {
  const { user, loading } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [documentStatus, setDocumentStatus] = useState("Pending");

  const fetchUserDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users/all-documents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("All Documents:", response.data);

      const userDocuments = response.data.filter((doc) => {
        const ownerId = doc.owner?._id || doc.owner;
        return ownerId === user?._id;
      });

      const isAnyDocumentVerified = userDocuments.some((doc) => doc.isVerified === true);

      setDocuments(userDocuments);
      setDocumentStatus(isAnyDocumentVerified ? "Verified" : "Pending");
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchUserDocuments();
  }, []);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return <p className="no-user-message">No user data available.</p>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>

      <p>
        <strong>Profile Image:</strong>
        <br />
        <img
          src={user.profilePic ? `http://localhost:5000/${user.profilePic.replace(/\\/g, "/")}` : "/default-profile.png"}
          alt="User Profile"
          width="100px"
        />
      </p>

      <p>
        <strong>First Name:</strong> {user.firstName || "N/A"}
      </p>
      <p>
        <strong>Last Name:</strong> {user.lastName || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {user.email || "N/A"}
      </p>
      <p>
        <strong>Role:</strong> {user.role || "N/A"}
      </p>

      <p>
        <strong>Verified:</strong>
        <span className={`verified-status ${user.isVerified ? "" : "not-verified"}`}>
          {user.isVerified ? "Yes" : "No"}
        </span>
      </p>

      <p>
        <strong>Document Status:</strong>
        <span className={`document-status ${documentStatus === "Verified" ? "verified" : "pending"}`}>
          {documentStatus}
        </span>
      </p>

      {documentStatus !== "Verified" && (
        <div>
          <Link to="/farmer/upload-document" className="upload-btn">
            Upload Documents
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
