import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Spinner } from "react-bootstrap";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TransactionAnalytics = () => {
  const [analytics, setAnalytics] = useState({ investments: [], repayments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get("/transactions/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAnalytics(response.data);
      } catch (error) {
        setError(error.message || "Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
        <p style={styles.loadingText}>Fetching analytics...</p>
      </div>
    );
  }

  if (error) {
    return <p style={styles.errorText}>{error}</p>;
  }

  const investmentData = analytics.investments.map((inv) => inv.totalAmount);
  const repaymentData = analytics.repayments.map((rep) => rep.totalAmount);
  const months = analytics.investments.map((inv) => `Month ${inv._id}`);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Investments",
        data: investmentData,
        backgroundColor: "#4CAF50", 
        borderRadius: 5,
      },
      {
        label: "Repayments",
        data: repaymentData,
        backgroundColor: "#FF5733", 
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Monthly Investments & Repayments",
        font: { size: 18 },
        color: "#333",
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 }, color: "#555" },
        grid: { display: false },
      },
      y: {
        ticks: { font: { size: 12 }, color: "#555" },
        grid: { color: "#ddd" },
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Transaction Analytics</h2>
        <div style={styles.chartContainer}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  card: {
    width: "90%",
    maxWidth: "900px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  chartContainer: {
    height: "400px",
    position: "relative",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
  },
  loadingText: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#555",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: "16px",
  },
};

export default TransactionAnalytics;
