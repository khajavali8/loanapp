import React, { useEffect, useState } from "react";
import axios from "axios";

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/users/loans", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setLoans(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching loans:", error);
        setError("Failed to fetch loans. Please log in again.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Loan Details</h2>

      {loading ? (
        <p style={styles.loadingText}>Loading loans...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th>Loan ID</th>
              <th>Farmer</th>
              <th>Farm Name</th>
              <th>Amount</th>
              <th>Interest Rate</th>
              <th>Duration (Months)</th>
              <th>Status</th>
              <th>Repayment Schedule</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} style={styles.row}>
                <td>{loan._id}</td>
                <td>
                  {loan.farm?.farmer?.firstName} {loan.farm?.farmer?.lastName}
                </td>
                <td>{loan.farm?.name || "N/A"}</td>
                <td>{loan.amount.toFixed(2)}</td>
                <td>{loan.interestRate}%</td>
                <td>{loan.duration} months</td>
                <td
                  style={
                    loan.status === "Approved"
                      ? styles.approved
                      : loan.status === "Pending"
                      ? styles.pending
                      : styles.completed
                  }
                >
                  {loan.status}
                </td>
                <td>
                  <details>
                    <summary>View Schedule</summary>
                    <ul>
                      {loan.repaymentSchedule.map((payment, index) => (
                        <li key={index}>
                          {payment.dueDate
                            ? new Date(payment.dueDate).toLocaleDateString()
                            : "No Date"}{" "}
                          - {payment.amount.toFixed(2)} (
                          <span
                            style={
                              payment.status === "paid"
                                ? styles.paid
                                : styles.pending
                            }
                          >
                            {payment.status === "paid" ? "Paid" : "Pending"}
                          </span>
                          )
                        </li>
                      ))}
                    </ul>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "95%",
    margin: "auto",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  loadingText: {
    color: "#555",
    fontSize: "18px",
  },
  errorText: {
    color: "red",
    fontSize: "18px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "5px",
    overflow: "hidden",
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  },
  headerRow: {
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "14px",
    textAlign: "left",
    height: "50px",
  },
  row: {
    borderBottom: "1px solid #ddd",
    height: "50px",
    textAlign: "center",
  },
  approved: {
    color: "#FFA500", 
    fontWeight: "bold",
  },
  pending: {
    color: "red", 
    fontWeight: "bold",
  },
  completed: {
    color: "#28a745", 
    fontWeight: "bold",
  },
  paid: {
    color: "#28a745", 
    fontWeight: "bold",
  },
};

export default AllLoans;