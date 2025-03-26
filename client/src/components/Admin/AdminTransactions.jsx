import React, { useState, useEffect } from "react";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/transactions/admin/all-transactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>All Transactions</h2>
      
      {loading && <p style={{ textAlign: "center", fontSize: "16px" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {!loading && transactions.length === 0 && (
        <p style={{ textAlign: "center", fontSize: "16px", color: "#555" }}>No transactions found.</p>
      )}

      {!loading && transactions.length > 0 && (
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#007BFF", color: "white", textAlign: "left" }}>
              <th style={headerStyle}>S.no</th>
              <th style={headerStyle}>Type</th>
              <th style={headerStyle}>Amount</th>
              <th style={headerStyle}>From</th>
              <th style={headerStyle}>To</th>
              {/* <th style={headerStyle}>Farm</th> */}
              <th style={headerStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={txn._id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                <td style={cellStyle}>{index + 1}</td>
                <td style={cellStyle}>{txn.type}</td>
                <td style={cellStyle}>{txn.amount}</td>
                <td style={cellStyle}>
                  {txn.from ? `${txn.from.firstName} ${txn.from.lastName}` : "N/A"}
                </td>
                <td style={cellStyle}>
                  {txn.to ? `${txn.to.firstName} ${txn.to.lastName}` : "N/A"}
                </td>
                {/* <td style={cellStyle}>{txn.farmId ? txn.farmId.name : "N/A"}</td> */}
                <td style={cellStyle}>{new Date(txn.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Inline styles
const headerStyle = {
  padding: "12px",
  fontSize: "16px",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
};

const cellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

export default AdminTransactions;
