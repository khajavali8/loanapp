import React from "react";
import { Link } from "react-router-dom";
import "../../styles/FarmITStyles.css"; 
import Footer from "../Common/Footer";

const AdminDashboard = () => {
  const adminItems = [
    { path: "/admin/users", title: "Manage Users", icon: "👥", description: "View and manage all users." },
    {path:"/admin/documents", title:"All Documents", icon:"📄", description:"View all user documents."},
    { path: "/admin/verify-investments", title: "Verify Investments", icon: "✅", description: "Approve pending investments." },
    { path: "/admin/loans", title: "All Loans", icon: "💳", description: "Review all loan requests." },
    { path: "/admin/farms", title: "All Farms", icon: "🌾", description: "View all registered farms." },
    {path: "/admin/transactions", title: "All Transactions", icon: "💸", description: "View all financial transactions."},
    { path: "/admin/issues", title: "Reported Issues", icon: "⚠️", description: "Monitor and resolve reported issues." },
  ];

  const adminInsights = [
    { title: "🚀 Streamlined Management", description: "Easily manage users, farms, and loans from one place." },
    { title: "🛠 Efficient Issue Handling", description: "Quickly respond to reported problems to maintain platform integrity." },
    { title: "📊 Data-Driven Decisions", description: "Access insights and reports to improve the platform." },
  ];

  return (
    <div className="page-container" style={styles.pageContainer}>
      <div style={styles.overlay}></div>
      <div style={styles.banner}>
        <h2>📌 Admin Control Panel</h2>
        <p>Manage users, loans, and farms efficiently from one central hub.</p>
      </div>

      <div className="container" style={styles.container}>
        <h1 style={styles.header}>Welcome, Admin! ⚡</h1>
        <p style={styles.subHeader}>Take control and manage the platform effectively.</p>

        <div style={styles.insightsSection}>
          <h3>💡 Key Insights</h3>
          <ul>
            {adminInsights.map((insight, index) => (
              <li key={index}>
                <strong>{insight.title}</strong> - {insight.description}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.cardGrid}>
          {adminItems.map((item, index) => (
            <Link to={item.path} key={index} style={styles.card}>
              <div style={styles.cardContent}>
                <span style={styles.icon}>{item.icon}</span>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardDesc}>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    background: "linear-gradient(rgba(198, 200, 200, 0.5), rgba(184, 224, 238, 0.5))",
  },
  banner: {
    backgroundColor: "skyblue",
    color: "white",
    textAlign: "center",
    padding: "20px 10px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    fontSize: "26px",
    marginBottom: "10px",
    color: "#333",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  insightsSection: {
    background: "#fff3cd",
    padding: "15px",
    borderLeft: "5px solid #ffa000",
    marginBottom: "20px",
    borderRadius: "5px",
    textAlign: "left",
  },
  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    display: "block",
    textDecoration: "none",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    width: "240px",
    boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    color: "inherit",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    fontSize: "45px",
    marginBottom: "10px",
  },
  cardTitle: {
    fontSize: "20px",
    margin: "10px 0",
    color: "#007bff",
    fontWeight: "bold",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#555",
  },
};

export default AdminDashboard;
