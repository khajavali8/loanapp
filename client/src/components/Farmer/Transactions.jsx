import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TransactionsFarmer = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/transactions/my-transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          console.error("Error fetching transactions:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <h2 style={{ textAlign: "center", color: "#555" }}>Loading transactions...</h2>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", background: "#fff", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
      <h2 style={{ color: "#007bff", textAlign: "center", marginBottom: "20px" }}>My Transactions</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>ID</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Amount</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Type</th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction._id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{transaction._id}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{transaction.amount}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{transaction.type}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                <Link to={`/farmer/transactions/${transaction._id}`} style={{ textDecoration: "none", backgroundColor: "#007bff", color: "white", padding: "5px 10px", borderRadius: "5px", display: "inline-block" }}>
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsFarmer;
