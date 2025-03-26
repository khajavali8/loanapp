// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const VerifyUser = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setError("Unauthorized: Please log in.");
//       return;
//     }

//     axios
//       .get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => setUsers(response.data))
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//         setError("Failed to fetch users. Please log in again.");
//       });
//   }, []);

//   const handleVerify = (id) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setError("Unauthorized: Please log in.");
//       return;
//     }

//     axios
//       .put(
//         `http://localhost:5000/api/users/${id}/verify`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then(() => {
//         setUsers(users.map((user) =>
//           user._id === id ? { ...user, isVerified: true } : user
//         ));
//       })
//       .catch((error) => {
//         console.error("Error verifying user:", error);
//         setError("Failed to verify user.");
//       });
//   };

//   return (
//     <div>
//       <h2>Verify Users</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <ul>
//         {users.map((user) => (
//           <li key={user._id}>
//             {user.name} - {user.email} - {user.isVerified ? "Verified" : "Not Verified"}
//             {!user.isVerified && (
//               <button onClick={() => handleVerify(user._id)}>Verify</button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default VerifyUser;
