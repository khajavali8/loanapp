import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchInvestments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/loans/my-investments",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Investments data:", response.data);
        setInvestments(response.data);
      } catch (error) {
        console.error("Error fetching investments:", error.response?.data || error.message);
      }
    };

    fetchInvestments();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Investments</h2>
      {investments.length > 0 ? (
        <div style={styles.investmentGrid}>
          {investments.map((investment) => (
            <div key={investment._id} style={styles.investmentCard}>
              <h3 style={styles.farmName}>{investment.loan?.farm?.name || "Unknown Farm"}</h3>
              <p><strong>📍 Location:</strong> {investment.loan?.farm?.location || "N/A"}</p>
              <p><strong>💰 Investment:</strong> ₹{investment.amount}</p>
              <p><strong>🔹 Loan ID:</strong> {investment.loan?._id || "N/A"}</p>
              <p><strong>🏦 Loan Amount:</strong> ₹{investment.loan?.amount || "N/A"}</p>
              <p><strong>📈 Interest Rate:</strong> {investment.loan?.interestRate || "N/A"}%</p>
              <p><strong>⏳ Duration:</strong> {investment.loan?.duration || "N/A"} months</p>
              <p><strong>📅 Date:</strong> {new Date(investment.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noInvestments}>No investments found.</p>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#f8f9fc",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "20px",
    fontWeight: "600",
  },
  investmentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    padding: "0 20px",
  },
  investmentCard: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    textAlign: "left",
  },
  investmentCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
  farmName: {
    fontSize: "1.5rem",
    color: "#27ae60",
    fontWeight: "600",
    marginBottom: "10px",
  },
  noInvestments: {
    fontSize: "1.2rem",
    color: "#7f8c8d",
    fontStyle: "italic",
  },
};

export default MyInvestments;
