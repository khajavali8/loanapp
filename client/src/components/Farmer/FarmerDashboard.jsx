import React from "react";
import { Link } from "react-router-dom";
import "../../styles/FarmITStyles.css";
import Footer from "../Common/Footer";

const FarmerDashboard = () => {
  const dashboardItems = [
    {path:"/farmer/farmer-profile", icon:"👨‍🌾", title:"My Profile", description:"View and update your profile details."},
    { path: "/farmer/farm-form", icon: "🚜", title: "Register a Farm", description: "Add and manage your farm details." },
    { path: "/farmer/my-farms", icon: "🌾", title: "My Farms", description: "View and manage your registered farms." },
    { path: "/farmer/upload-document", icon: "📄", title: "Upload Document", description: "Submit necessary farm-related documents." },
    { path: "/farmer/my-documents", icon: "📂", title: "My Documents", description: "View and download uploaded documents." },
    { path: "/farmer/my-loans", icon: "💳", title: "My Loans", description: "Track your loan requests and approvals." },
    { path: "/farmer/transactions", icon: "💸", title: "My Transactions", description: "Monitor all your financial transactions." },
    {path :"/common/report-issue", icon: "🚨", title: "Report Issue", description: "Report any issues or problems to the admin."},

  ];

  const tips = [
    { title: "🌿 Crop Rotation", description: "Improve soil health and reduce pests by rotating crops each season." },
    { title: "💧 Efficient Irrigation", description: "Use drip irrigation to save water and increase yield." },
    { title: "🌞 Seasonal Planting", description: "Check the best planting time for each crop to maximize growth." },
  ];

  return (
    <div className="page-container">

      <div className="banner">
        <h2>🚜 Grow Your Farm, Grow Your Future! 🌾</h2>
        <p>Manage your farm efficiently, apply for loans, and track all your transactions in one place.</p>
      </div>

      <div className="container">
        <h1 className="dashboard-title">Welcome, Farmer! 👨‍🌾</h1>
        <p className="dashboard-subtitle">
          Explore the tools and features to manage your farm operations smoothly.
        </p>

        <div className="tips-section">
          <h3>📌 Farming Tips & Resources</h3>
          <ul>
            {tips.map((tip, index) => (
              <li key={index}>
                <strong>{tip.title}</strong> - {tip.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-grid">
          {dashboardItems.map((item, index) => (
            <Link to={item.path} key={index} className="dashboard-card">
              <div className="card-content">
                <span className="icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;
