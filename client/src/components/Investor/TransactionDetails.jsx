// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function TransactionDetails() {
//     const { id } = useParams();
//     const [transaction, setTransaction] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const token = localStorage.getItem("token");

//         fetch(`http://localhost:5000/api/transactions/${id}`, {
//             method: "GET",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         })
//         .then((res) => {
//             if (!res.ok) throw new Error("Failed to fetch transaction details.");
//             return res.json();
//         })
//         .then((data) => {
//             setTransaction(data);
//             setLoading(false);
//         })
//         .catch((err) => {
//             setError(err.message);
//             setLoading(false);
//         });
//     }, [id]);

//     if (loading) return <p>Loading transaction details...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <div>
//             <h2>Transaction Details</h2>
//             <p><strong>Type:</strong> {transaction.type}</p>
//             <p><strong>Amount:</strong> ${transaction.amount}</p>
//             <p><strong>Status:</strong> {transaction.status}</p>
//             <p><strong>Description:</strong> {transaction.description || "N/A"}</p>
//             <p><strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
//             <p><strong>From:</strong> {transaction.from?.name} ({transaction.from?.email})</p>
//             <p><strong>To:</strong> {transaction.to?.name} ({transaction.to?.email})</p>

//             {transaction.loan && (
//                 <div>
//                     <h3>Loan Details</h3>
//                     <p><strong>Amount:</strong> ${transaction.loan.amount}</p>
//                     <p><strong>Interest Rate:</strong> {transaction.loan.interestRate}%</p>
//                     <p><strong>Status:</strong> {transaction.loan.status}</p>
//                 </div>
//             )}

//             {transaction.farmId && (
//                 <div>
//                     <h3>Farm Details</h3>
//                     <p><strong>Name:</strong> {transaction.farmId.name}</p>
//                     <p><strong>Location:</strong> {transaction.farmId.location}</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default TransactionDetails;
