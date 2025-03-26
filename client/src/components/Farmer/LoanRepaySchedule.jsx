// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const LoanRepaySchedule = () => {
//   const { id } = useParams(); // Extract loan ID from URL params
//   const [schedule, setSchedule] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!id || id.length !== 24) {
//       setError("Invalid loan ID.");
//       setLoading(false);
//       return;
//     }

//     const fetchSchedule = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("Unauthorized: No token found.");
//         }

//         const response = await fetch(
//           `http://localhost:5000/api/loans/${id}/repayment-schedule`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           const errorMessage = await response.text();
//           throw new Error(`Error ${response.status}: ${errorMessage}`);
//         }

//         const data = await response.json();
//         setSchedule(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchedule();
//   }, [id]);

//   return (
//     <div>
//       <h2>Loan Repayment Schedule</h2>
//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loading && !error && schedule.length > 0 && (
//         <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
//           <thead>
//             <tr>
//               <th>Due Date</th>
//               <th>Amount</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {schedule.map((item, index) => (
//               <tr key={index}>
//                 <td>{new Date(item.dueDate).toLocaleDateString()}</td>
//                 <td>${item.amount.toFixed(2)}</td>
//                 <td>{item.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {!loading && !error && schedule.length === 0 && <p>No repayment schedule available.</p>}
//     </div>
//   );
// };

// export default LoanRepaySchedule;
