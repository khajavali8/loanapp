import React from "react";
import { Link } from "react-router-dom";
import "../../styles/FarmITStyles.css";
import Footer from "../Common/Footer";

const InvestorDashboard = () => {
  const insights = [
    { title: "📈 Smart Investing", description: "Diversify your portfolio by investing in multiple farms to reduce risks." },
    { title: "🌾 Sustainable Growth", description: "Invest in organic and eco-friendly farms for long-term profitability." },
    { title: "💰 High Returns", description: "Analyze past farm performances to maximize your investment gains." },
  ];

  const dashboardItems = [
    { path: "/investor/view-farms", icon: "🌿", title: "View Farms", description: "Explore available farms for investment." },
    { path: "/investor/invest-farm", icon: "💰", title: "Invest in a Farm", description: "Make an investment in a promising farm." },
    { path: "/investor/my-investments", icon: "📊", title: "My Investments", description: "Track and manage your investments." },
    // { path: "/investor/available-loans", icon: "🏦", title: "Available Loans", description: "Check available loan opportunities." },
    { path: "/investor/transactions", icon: "💸", title: "My Transactions", description: "View your financial transactions." },
    { path: "/investor/transactions/analytics", icon: "📈", title: "Transaction Analytics", description: "Analyze your transaction trends." },
    {path :"/common/report-issue", icon: "🚨", title: "Report Issue", description: "Report any issues or problems to the admin."}
  ];

  return (
    <div className="page-container">
      {/* Banner Section */}
      <div className="banner">
        <h2>📊 Invest Smart, Grow Your Wealth! 💰</h2>
        <p>Explore farm investment opportunities and maximize your financial growth.</p>
      </div>

      <div className="container">
        {/* Welcome Message */}
        <h1 className="dashboard-title">Welcome, Investor! 🎯</h1>
        <p className="dashboard-subtitle">Unlock new opportunities in sustainable farming investments.</p>

        {/* Investment Insights */}
        <div className="insights-section">
          <h3>💡 Investment Insights</h3>
          <ul>
            {insights.map((insight, index) => (
              <li key={index}>
                <strong>{insight.title}</strong> - {insight.description}
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard Options */}
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

export default InvestorDashboard;
