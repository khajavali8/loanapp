import React, { useEffect, useState } from "react";

const AvailableLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated. Please log in.");
        }
  
        const response = await fetch("http://localhost:5000/api/loans/available-loans", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch loans: ${errorText}`);
        }
  
        const data = await response.json();
  
        // Fetch user's investments
        const investmentResponse = await fetch("http://localhost:5000/api/loans/my-investments", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const investments = await investmentResponse.json();
  
        // Get IDs of loans the user has already invested in
        const investedLoanIds = new Set(investments.map((inv) => inv.loan));
  
        // Filter out loans where the user has already invested
        const filteredLoans = data.filter((loan) => !investedLoanIds.has(loan._id));
  
        setLoans(filteredLoans);
      } catch (error) {
        console.error("Error fetching loans:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLoans();
  }, []);
  

  if (loading) return <p style={styles.loading}>Loading available loans...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Available Loans</h1>
      {loans.length === 0 ? (
        <p style={styles.noLoans}>No available loans at the moment.</p>
      ) : (
        <div style={styles.loansGrid}>
          {loans.map((loan) => (
            <div
              key={loan._id}
              style={styles.loanCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h3 style={styles.loanTitle}>
                {loan.farm?.name || "Unknown Farm"} - {loan.amount}
              </h3>
              <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
              <p><strong>Duration:</strong> {loan.duration} months</p>
              <p><strong>Status:</strong> {loan.status || "N/A"}</p>
              <p><strong>Invested Amount:</strong> {loan.investedAmount || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  heading: {
    color: "#333",
    marginBottom: "30px",
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  loansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    justifyContent: "center",
    padding: "20px",
  },
  loanCard: {
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ddd",
    textAlign: "left",
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer",
  },
  loanTitle: {
    fontSize: "1.5rem",
    color: "#007bff",
    marginBottom: "15px",
    fontWeight: "600",
  },
  noLoans: {
    color: "#666",
    fontSize: "1.2rem",
  },
  loading: {
    color: "#555",
    fontSize: "1.2rem",
    textAlign: "center",
    marginTop: "50px",
  },
  error: {
    color: "red",
    fontSize: "1.2rem",
    textAlign: "center",
    marginTop: "50px",
  },
};

export default AvailableLoans;