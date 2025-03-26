import React, { useEffect, useState } from "react";
import axios from "axios";

const AllFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredFarm, setHoveredFarm] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/users/farms", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setFarms(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching farms:", error);
        setError("Failed to fetch farms. Please log in again.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Farms</h2>

      {loading ? (
        <p style={styles.loadingText}>Loading farms...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : farms.length === 0 ? (
        <p style={styles.noDataText}>No farms available.</p>
      ) : (
        <div style={styles.farmList}>
          {farms.map((farm) => (
            <div
              key={farm._id}
              style={{
                ...styles.farmCard,
                ...(hoveredFarm === farm._id ? styles.farmCardHover : {}),
              }}
              onMouseEnter={() => setHoveredFarm(farm._id)}
              onMouseLeave={() => setHoveredFarm(null)}
            >
              <h3 style={styles.farmTitle}>{farm.name}</h3>

              {farm.images?.length > 0 && (
                <img
                  src={`http://localhost:5000/${farm.images[0]}`}
                  alt="Farm"
                  style={styles.image}
                />
              )}

              <p>
                <strong>📍 Location:</strong> {farm.location}
              </p>
              <p>
                <strong>🌾 Type:</strong> {farm.farmType}
              </p>
              <p>
                <strong>📏 Size:</strong> {farm.size} acres
              </p>
              <p>
                <strong>🛠 Status:</strong> {farm.status}
              </p>
              <p>
                <strong>👤 Owner:</strong> {farm.farmer?.firstName} {farm.farmer?.lastName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "95%",
    margin: "auto",
  },
  heading: {
    fontSize: "26px",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  loadingText: {
    color: "#555",
    fontSize: "18px",
  },
  errorText: {
    color: "red",
    fontSize: "18px",
    fontWeight: "bold",
  },
  noDataText: {
    color: "#777",
    fontSize: "18px",
  },
  farmList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  farmCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#fff",
    textAlign: "left",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  farmCardHover: {
    transform: "scale(1.05)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
  farmTitle: {
    color: "#007bff",
    fontSize: "20px",
    marginBottom: "10px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
    marginBottom: "10px",
  },
};

export default AllFarms;
