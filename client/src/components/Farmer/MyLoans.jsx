import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import "../../styles/FarmITStyles.css";

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [error, setError] = useState("");
  const [repaymentAmounts, setRepaymentAmounts] = useState({});
  const [showRepayLoan, setShowRepayLoan] = useState({});
  const [showRepaymentSchedule, setShowRepaymentSchedule] = useState({});

  useEffect(() => {
    fetchLoans();
  }, []);

  // Fetch user's loans
  const fetchLoans = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("/loans/my-loans", config);
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
      alert("Failed to fetch loans");
    }
  };

  // Fetch repayment schedule
  const fetchSchedule = async (loanId) => {
    setLoadingSchedule(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized: No token found.");
      }

      const response = await axios.get(`/loans/${loanId}/repayment-schedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSchedule((prev) => ({
        ...prev,
        [loanId]: response.data,
      }));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch repayment schedule.");
    } finally {
      setLoadingSchedule(false);
    }
  };

  // Handle loan repayment
  const handleRepayment = async (loanId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }
  
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const amount = repaymentAmounts[loanId];
  
    if (!amount) {
      alert("Please enter an amount to repay.");
      return;
    }
  
    try {
      const response = await axios.post(`/loans/${loanId}/repay`, { amount }, config);
  
      alert("Loan repayment successful!");
  
      // Update the repayment schedule and loan status
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [loanId]: response.data.loan.repaymentSchedule,
      }));
  
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === loanId ? { ...loan, status: response.data.loan.status } : loan
        )
      );
  
      setRepaymentAmounts((prev) => ({ ...prev, [loanId]: "" }));
    } catch (error) {
      console.error("Repayment error:", error);
      alert(error.response?.data?.message || "Repayment failed");
    }
  };
  // Toggle repayment schedule
  const toggleRepaymentSchedule = (loanId) => {
    setShowRepaymentSchedule((prev) => ({
      ...prev,
      [loanId]: !prev[loanId],
    }));

    if (!schedule[loanId]) {
      fetchSchedule(loanId);
    }
  };

  return (
    <div className="form-container">
      <h2>My Loans</h2>

      {loans.length > 0 ? (
        <ul>
          {loans.map((loan) => (
            <li key={loan._id} className="loan-card">
              <strong>Loan ID:</strong> {loan._id} <br />
              <strong>Amount:</strong> {loan.amount} <br />
              <strong>Status:</strong> {loan.status} <br />
              <strong>Duration:</strong> {loan.duration} months <br />

              <button onClick={() => toggleRepaymentSchedule(loan._id)}>
                {showRepaymentSchedule[loan._id] ? "Hide Repayment Schedule" : "View Repayment Schedule"}
              </button>

              {showRepaymentSchedule[loan._id] && (
                <div className="repayment-schedule">
                  <h3>Repayment Schedule</h3>
                  {loadingSchedule ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                  ) : schedule[loan._id] && schedule[loan._id].length > 0 ? (
                    <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
                      <thead>
                        <tr>
                          <th>Due Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
  {schedule[loan._id].map((item, index) => {
    const expectedAmount = parseFloat(item.amount); // Full floating value
    const dueDate = new Date(item.dueDate).toLocaleDateString();
    
    // Find out how much has been paid up to this installment
    let totalPaid = 0;
    for (let i = 0; i <= index; i++) {
      totalPaid += schedule[loan._id][i]?.amount || 0;
    }

    const status = totalPaid <= loan.amountPaid ? "paid" : item.status;

    return (
      <tr key={index}>
        <td>{dueDate}</td>
        <td>{expectedAmount}</td> {/* Exact floating-point value */}
        <td>{status}</td>
      </tr>
    );
  })}
</tbody>


                    </table>
                  ) : (
                    <p>No repayment schedule available.</p>
                  )}
                </div>
              )}

              <button onClick={() => setShowRepayLoan((prev) => ({ ...prev, [loan._id]: !prev[loan._id] }))}>
                {showRepayLoan[loan._id] ? "Hide Repay Loan" : "Show Repay Loan"}
              </button>

              {showRepayLoan[loan._id] && (
                <div className="repayment-form">
                  <input
                    type="number"
                    placeholder="Amount to Repay"
                    value={repaymentAmounts[loan._id] || ""}
                    onChange={(e) =>
                      setRepaymentAmounts({ ...repaymentAmounts, [loan._id]: e.target.value })
                    }
                    required
                  />
                  <button onClick={() => handleRepayment(loan._id)}>Repay Loan</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No loans found</p>
      )}
    </div>
  );
};

export default MyLoans;
