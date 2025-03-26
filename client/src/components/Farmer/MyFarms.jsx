import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import "../../styles/FarmITStyles.css";

const MyFarms = () => {
  const [farms, setFarms] = useState([]);
  const [editFarm, setEditFarm] = useState(null);
  const [updatedFarm, setUpdatedFarm] = useState({
    name: "",
    location: "",
    size: "",
    farmType: "",
  });
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [loan, setLoan] = useState({
    amount: "",
    interestRate: "",
    duration: "",
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("/farms/my-farms", config);
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
      alert("Failed to fetch farms");
    }
  };

  const handleEdit = (farm) => {
    setEditFarm(farm);
    setUpdatedFarm({
      name: farm.name || "",
      location: farm.location || "",
      size: farm.size || "",
      farmType: farm.farmType || "",
    });
  };

  const handleChange = (e) => {
    setUpdatedFarm({ ...updatedFarm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      if (!editFarm) return;
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.put(`/farms/${editFarm._id}`, updatedFarm, config);
      alert("Farm updated successfully!");
      setEditFarm(null);
      setUpdatedFarm({ name: "", location: "", size: "", farmType: "" });
      fetchFarms();
    } catch (error) {
      console.error("Error updating farm:", error);
      alert(error.response?.data?.message || "Failed to update farm");
    }
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/farms/${farmId}`, config);
      alert("Farm deleted successfully!");
      fetchFarms();
    } catch (error) {
      console.error("Error deleting farm:", error);
      alert("Failed to delete farm");
    }
  };

  const handleLoanRequest = (farmId) => {
    setSelectedFarmId(farmId);
    setShowLoanModal(true);
  };

  const handleLoanChange = (e) => {
    setLoan({ ...loan, [e.target.name]: e.target.value });
  };

  const handleLoanSubmit = async (e) => {
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

      const loanData = { ...loan, farm: selectedFarmId };
      await axios.post("/loans/create", loanData, config);
      alert("Loan request submitted!");
      setShowLoanModal(false);
      setLoan({ amount: "", interestRate: "", duration: "" });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to request loan");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <h2>My Farms</h2>
      {farms.length === 0 ? (
        <p>No farms found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {farms.map((farm) => (
            <div
              key={farm._id}
              style={{
                width: "300px",
                background: "#f9f9f9",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {farm.images && farm.images.length > 0 && (
                <img
                  src={`http://localhost:5000/${farm.images[0].replace(/\\/g, "/")}`}
                  alt={farm.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              )}

              <h3>{farm.name}</h3>
              <p><strong>Farm ID:</strong> {farm._id}</p>
              <p><strong>Location:</strong> {farm.location}</p>
              <p><strong>Size:</strong> {farm.size} acres</p>
              <p><strong>Type:</strong> {farm.farmType}</p>
              <p><strong>Status:</strong> {farm.status}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => handleEdit(farm)}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "5px",
                    flex: 1,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(farm._id)}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    backgroundColor: "red",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "5px",
                    flex: 1,
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleLoanRequest(farm._id)}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    backgroundColor: "#28a745",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "5px",
                    flex: 1,
                  }}
                >
                  Request Loan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editFarm !== null && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "300px",
            padding: "15px",
            background: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <h2>Edit Farm</h2>
          <label>Farm Name:</label>
          <input
            type="text"
            name="name"
            value={updatedFarm.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={updatedFarm.location}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />

          <label>Size (acres):</label>
          <input
            type="number"
            name="size"
            value={updatedFarm.size}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />

          <label>Farm Type:</label>
          <input
            type="text"
            name="farmType"
            value={updatedFarm.farmType}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />

          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditFarm(null)}>Cancel</button>
        </div>
      )}

      {showLoanModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            padding: "20px",
            background: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <h2>Request Loan</h2>
          <form onSubmit={handleLoanSubmit}>
            <label>Loan Amount:</label>
            <input
              type="number"
              name="amount"
              value={loan.amount}
              onChange={handleLoanChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />

            <label>Interest Rate (%):</label>
            <input
              type="number"
              name="interestRate"
              value={loan.interestRate}
              onChange={handleLoanChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />

            <label>Duration (months):</label>
            <input
              type="number"
              name="duration"
              value={loan.duration}
              onChange={handleLoanChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />

            <button type="submit">Submit</button>
            <button
              type="button"
              onClick={() => setShowLoanModal(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyFarms;