import { useEffect, useState } from "react";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:5000/api/transactions/my-transactions", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch transactions.");
                return res.json();
            })
            .then((data) => {
                setTransactions(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const fetchTransactionDetails = (id) => {
        setSelectedTransaction(null);
        setErrorDetails(null);

        const token = localStorage.getItem("token");

        fetch(`http://localhost:5000/api/transactions/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setSelectedTransaction(data);
            })
            .catch((err) => {
                setErrorDetails(err.message);
            });
    };

    const closeModal = () => {
        setSelectedTransaction(null);
    };

    if (loading) return <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>Loading transactions...</p>;
    if (error) return <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>Error: {error}</p>;

    return (
        <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px", fontSize: "24px", fontWeight: "600" }}>My Transactions</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#007bff", color: "white", textAlign: "left" }}>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Transaction ID</th>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Type</th>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Amount</th>
                        {/* <th style={{ padding: "12px", border: "1px solid #ddd" }}>Status</th> */}
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Sent At</th>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx._id} style={{ transition: "background 0.2s ease" }}>
                            <td style={{ padding: "12px", border: "1px solid #ddd" }}>{tx._id}</td>
                            <td style={{ padding: "12px", border: "1px solid #ddd" }}>{tx.type}</td>
                            <td style={{ padding: "12px", border: "1px solid #ddd" }}>{tx.amount}</td>
                            {/* <td style={{ padding: "12px", border: "1px solid #ddd", color: tx.status === "Completed" ? "#28a745" : "#dc3545", fontWeight: "500" }}>{tx.status}</td> */}
                            <td style={{ padding: "12px", border: "1px solid #ddd" }}>{new Date(tx.createdAt).toLocaleString()}</td>
                            <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                <button
                                    onClick={() => fetchTransactionDetails(tx._id)}
                                    style={{
                                        padding: "8px 12px",
                                        background: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        transition: "background 0.3s ease",
                                    }}
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Popup */}
            {selectedTransaction && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{
                        background: "#fff", padding: "20px", borderRadius: "10px", maxWidth: "500px",
                        width: "100%", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", position: "relative"
                    }}>
                        <h3 style={{ color: "#007bff", marginBottom: "15px", fontSize: "20px", fontWeight: "600" }}>Transaction Details</h3>
                        <p><strong>Type:</strong> {selectedTransaction.type}</p>
                        <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
                        {/* <p><strong>Status:</strong> <span style={{ color: selectedTransaction.status === "Completed" ? "#28a745" : "#dc3545", fontWeight: "500" }}>{selectedTransaction.status}</span></p> */}
                        <p><strong>Sent At:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</p>

                        <h3 style={{ color: "#007bff", marginTop: "20px", marginBottom: "15px", fontSize: "18px", fontWeight: "600" }}>Sender Details</h3>
                        <p><strong>Name:</strong> {selectedTransaction.from ? `${selectedTransaction.from.firstName} ${selectedTransaction.from.lastName}` : "N/A"}</p>
                        <p><strong>Email:</strong> {selectedTransaction.from?.email || "N/A"}</p>

                        {/* <h3 style={{ color: "#007bff", marginTop: "20px", marginBottom: "15px", fontSize: "18px", fontWeight: "600" }}>Receiver Details</h3>
                        <p><strong>Name:</strong> {selectedTransaction.to ? `${selectedTransaction.to.firstName} ${selectedTransaction.to.lastName}` : "N/A"}</p>
                        <p><strong>Email:</strong> {selectedTransaction.to?.email || "N/A"}</p> */}

                        <button onClick={closeModal} style={{
                            marginTop: "15px", padding: "8px 12px", background: "#dc3545",
                            color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
                        }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Transactions;
