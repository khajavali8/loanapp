import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyLoans = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInvestments = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Unauthorized: Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/loans/pending-investments", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setInvestments(response.data);
            } catch (err) {
                console.error("Error fetching investments:", err.response || err);
                setError("Failed to fetch investments.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    const verifyInvestment = async (loanId, investorId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://localhost:5000/api/loans/verify-investment`,
                { loanId, investorId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Investment verified!");
            setInvestments((prev) => prev.filter((loan) =>
                loan.investors.some(inv => inv._id !== investorId)
            ));
        } catch (error) {
            console.error("Verification failed:", error.response || error);
            alert("Failed to verify investment.");
        }
    };

    const creditInvestment = async (loanId, investorId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://localhost:5000/api/loans/credit-investment`,
                { loanId, investorId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Investment credited successfully!");
            setInvestments((prev) =>
                prev.filter((loan) =>
                    loan.investors.some(inv => inv._id !== investorId)
                )
            );
        } catch (error) {
            console.error("Crediting failed:", error.response || error);
            alert("Failed to credit investment.");
        }
    };

    return (
        <div>
            <h2>Verify & Credit Investments</h2>

            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : investments.length === 0 ? (
                <p>No pending investments.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Investor</th>
                            <th>Farm</th>
                            <th>Amount</th>
                            <th>Loan ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
    {investments.map((loan) =>
        loan.investors
            .filter((inv) => inv.status === "pending")
            .map((investment) => (
                <tr key={investment._id}>
                    <td>{investment.investor?.email}</td> {/* Display email instead of name */}
                    <td>{loan.farm?.name}</td>
                    <td>₹{investment.amount}</td>
                    <td>{loan._id}</td>
                    <td>
                        <button onClick={() => verifyInvestment(loan._id, investment.investor._id)}>✅ Verify</button>
                        <button onClick={() => creditInvestment(loan._id, investment.investor._id)}>💰 Credit</button>
                    </td>
                </tr>
            ))
    )}
</tbody>
                </table>
            )}
        </div>
    );
};

export default VerifyLoans;
