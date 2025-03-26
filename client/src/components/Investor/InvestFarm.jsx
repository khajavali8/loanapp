import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import "../../styles/FarmITStyles.css";

const InvestFarm = () => {
  const [loans, setLoans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState("");

  // Fetch Available Loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/api/loans/available-loans",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLoans(response.data);
      } catch (error) {
        console.error("Error fetching loans:", error.response?.data || error.message);
      }
    };

    fetchLoans();
  }, []);

  // Fetch User Investments
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/api/loans/my-investments",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInvestments(response.data);
      } catch (error) {
        console.error("Error fetching investments:", error.response?.data || error.message);
      }
    };

    fetchInvestments();
    const interval = setInterval(fetchInvestments, 5000); // Auto-refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  // Open Investment Popup
  const openPopup = (loan) => {
    setSelectedLoan(loan);
    setShowPopup(true);
    setInvestmentAmount("");
  };

  // Close Popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedLoan(null);
  };

  // Handle Investment Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/loans/${selectedLoan._id}/invest`,
        { amount: investmentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Investment request sent for admin approval!");
      closePopup();
    } catch (error) {
      console.error("Investment error:", error);
      alert("Failed to submit investment request.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Invest in a Farm</h2>

      {/* Available Loans */}
      <div style={styles.loanList}>
        <h3 style={styles.subHeading}>Available Loans</h3>
        {loans.length === 0 ? (
          <p style={styles.noLoans}>No available loans at the moment.</p>
        ) : (
          <div style={styles.loanGrid}>
            {loans.map((loan) => (
              <div key={loan._id} style={styles.loanCard}>
                <h3 style={styles.loanTitle}>{loan.farm?.name || "N/A"}</h3>
                <p><strong>📍 Farm ID:</strong> {loan.farm?._id || "N/A"}</p>
                <p><strong>📍 Location:</strong> {loan.farm?.location || "N/A"}</p>
                <p><strong>🔹 Loan ID:</strong> {loan._id}</p>
                <p><strong>💰 Loan Amount:</strong> ₹{loan.amount}</p>
                <p><strong>📈 Interest Rate:</strong> {loan.interestRate || "N/A"}%</p>
                <p><strong>⏳ Duration:</strong> {loan.duration || "N/A"} months</p>
                <p><strong>🔵 Status:</strong> {loan.status || "N/A"}</p>
                <button
                  style={styles.button}
                  onClick={() => openPopup(loan)}
                >
                  Invest
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Investment Requests */}
      <div style={styles.investmentsList}>
        <h3 style={styles.subHeading}>My Investment Requests</h3>
        {investments.length === 0 ? (
          <p style={styles.noLoans}>No investments made yet.</p>
        ) : (
          <div style={styles.loanGrid}>
            {investments.map((inv) => (
              <div key={inv._id} style={styles.loanCard}>
                <h3 style={styles.loanTitle}>Farm: {inv.loan?.farm?.name || "N/A"}</h3>
                <p><strong>📍 Location:</strong> {inv.loan?.farm?.location || "N/A"}</p>
                <p><strong>💰 Investment Amount:</strong> ₹{inv.amount}</p>
                <p><strong>🔹 Loan ID:</strong> {inv.loan?._id || "N/A"}</p>
                <p><strong>🏦 Loan Amount:</strong> ₹{inv.loan?.amount || "N/A"}</p>
                <p><strong>📈 Interest Rate:</strong> {inv.loan?.interestRate || "N/A"}%</p>
                <p><strong>⏳ Duration:</strong> {inv.loan?.duration || "N/A"} months</p>
                <p><strong>📅 Date:</strong> {new Date(inv.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Investment Popup */}
      {showPopup && selectedLoan && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h3>Invest in {selectedLoan.farm?.name || "this Farm"}</h3>
            <p><strong>Loan Amount:</strong> ₹{selectedLoan.amount}</p>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                placeholder="Enter Investment Amount"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                required
                style={styles.input}
              />
              <div style={styles.popupButtons}>
                <button
                  type="submit"
                  style={styles.confirmButton}
                >
                  Confirm Investment
                </button>
                <button
                  type="button"
                  onClick={closePopup}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
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
  loanList: {
    marginTop: "40px",
  },
  subHeading: {
    fontSize: "1.8rem",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  loanGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  loanCard: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  loanTitle: {
    fontSize: "1.5rem",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  investmentsList: {
    marginTop: "40px",
  },
  noLoans: {
    color: "gray",
  },
  popupOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContent: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  popupButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  confirmButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    flex: "1",
    marginRight: "5px",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    flex: "1",
  },
};

export default InvestFarm;