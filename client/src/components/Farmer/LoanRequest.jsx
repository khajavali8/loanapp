import React, { useState } from 'react';
import axios from '../../services/api';
import "../../styles/FarmITStyles.css";

const LoanRequest = () => {
  const [loan, setLoan] = useState({
    amount: '',
    interestRate: '',
    duration: '',
    farm: '', 
  });

  const handleChange = (e) => {
    setLoan({ ...loan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in first.');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('/loans/create', loan, config);
      alert('Loan request submitted!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to request loan');
    }
  };

  return (
    <div className="form-container">
      <h2>Request a Loan</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="number" name="amount" placeholder="Loan Amount" onChange={handleChange} required />
        <input type="number" name="interestRate" placeholder="Interest Rate (%)" onChange={handleChange} required />
        <input type="number" name="duration" placeholder="Duration (months)" onChange={handleChange} required />
        <input type="text" name="farm" placeholder="Farm ID" onChange={handleChange} required />
        <button type="submit">Request Loan</button>
      </form>
    </div>
  );
};

export default LoanRequest;
