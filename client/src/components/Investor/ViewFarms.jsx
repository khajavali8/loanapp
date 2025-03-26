import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const ViewFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredFarm, setHoveredFarm] = useState(null); 
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/farms/all-farms");
        setFarms(response.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
        setError("Failed to load farm data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const handleInvest = async (farmId, loanId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication required. Please log in.");
      return;
    }

    const amount = prompt("Enter investment amount:");
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Invalid amount entered.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/loans/${loanId}/invest`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Investment successful!");
    } catch (error) {
      console.error(error);
      alert("Failed to invest.");
    }
  };

  if (loading) return <p>Loading farms...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Available Farms for Investment</h2>
      <div style={styles.farmList}>
        {farms.length === 0 ? (
          <p>No farms available.</p>
        ) : (
          farms.map((farm) => (
            <div
              key={farm._id}
              style={{
                ...styles.farmCard,
                ...(hoveredFarm === farm._id ? styles.farmCardHover : {}),
              }}
              onMouseEnter={() => setHoveredFarm(farm._id)}
              onMouseLeave={() => setHoveredFarm(null)}
            >
              <h3>{farm.name}</h3>
              {farm.images.length > 0 && (
                <img src={`http://localhost:5000/${farm.images[0]}`} alt="Farm" style={styles.image} />
              )}
              <p><strong>Location:</strong> {farm.location}</p>
              <p><strong>Type:</strong> {farm.farmType}</p>
              <p><strong>Size:</strong> {farm.size} acres</p>
              <p><strong>Status:</strong> {farm.status}</p>
              {farm.loan && (
                <button onClick={() => handleInvest(farm._id, farm.loan._id)}>Invest in Farm</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  farmList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  farmCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    textAlign: "center",
    boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  farmCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
    marginTop: "10px",
  },
};

export default ViewFarms;
