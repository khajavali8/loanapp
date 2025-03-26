import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const TransactionDetailsFarmer = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setTransaction(data);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: "center", color: "#555" }}>Loading transaction details...</h2>;
  if (!transaction) return <h2 style={{ textAlign: "center", color: "#d9534f" }}>Transaction not found</h2>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", background: "#fff", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
      <h2 style={{ color: "#007bff", textAlign: "center", marginBottom: "20px" }}>Transaction Details</h2>
      <p><strong>ID:</strong> {transaction._id}</p>
      <p><strong>Amount:</strong> {transaction.amount}</p>
      <p><strong>Type:</strong> {transaction.type}</p>
      <p><strong>Status:</strong> {transaction.status}</p>
      <p><strong>From:</strong> {transaction.from.firstName} {transaction.from.lastName} ({transaction.from.email})</p>
      <p><strong>To:</strong> {transaction.to.firstName} {transaction.to.lastName} ({transaction.to.email})</p>
      {transaction.farmId && <p><strong>Farm:</strong> {transaction.farmId.name} - {transaction.farmId.location}</p>}
      <Link to="/farmer/transactions" style={{ display: "block", textAlign: "center", textDecoration: "none", background: "#007bff", color: "white", padding: "10px 15px", borderRadius: "5px", marginTop: "15px" }}>
        Back to Transactions
      </Link>
    </div>
  );
};

export default TransactionDetailsFarmer;
