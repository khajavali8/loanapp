import React, { useState } from "react";
import axios from "../../services/api"; 
import "../../styles/FarmITStyles.css";

const RepayLoan = () => {
  const [repayment, setRepayment] = useState({ loanId: "", amount: "" });

  const handleChange = (e) => {
    setRepayment({ ...repayment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`/loans/${repayment.loanId}/repay`, { amount: repayment.amount }, config);
      
      alert("Loan repayment successful!");
      setRepayment({ loanId: "", amount: "" }); 
    } catch (error) {
      console.error("Repayment error:", error);
      alert(error.response?.data?.message || "Repayment failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Repay Loan</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="loanId" placeholder="Loan ID" onChange={handleChange} value={repayment.loanId} required />
        <input type="number" name="amount" placeholder="Amount to Repay" onChange={handleChange} value={repayment.amount} required />
        <button type="submit">Repay Loan</button>
      </form>
    </div>
  );
};

export default RepayLoan;
