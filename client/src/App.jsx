import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Common/Navbar";
// import Footer from "./components/Common/Footer";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import ProtectedRoute from "./components/Common/ProtectedRoute";

// Farmer Components
import FarmerDashboard from "./components/Farmer/FarmerDashboard";
import FarmForm from "./components/Farmer/FarmForm";
import LoanRequest from "./components/Farmer/LoanRequest";
import MyLoans from "./components/Farmer/MyLoans";
import RepayLoan from "./components/Farmer/RepayLoan";
import MyFarms from "./components/Farmer/MyFarms";
import DocumentUpload from "./components/Farmer/DocumentUpload";
import MyDocuments from "./components/Farmer/MyDocuments";
import LoanRepaySchedule from "./components/Farmer/LoanRepaySchedule";
import TransactionsFarmer from "./components/Farmer/Transactions";
import TransactionDetailsFarmer from "./components/Farmer/TransactionDetails";
import Farmerprofile from "./components/Farmer/FarmerProfile";
// Investor Components
import InvestorDashboard from "./components/Investor/InvestorDashboard";
import ViewFarms from "./components/Investor/ViewFarms";
import InvestFarm from "./components/Investor/InvestFarm";
import MyInvestments from "./components/Investor/MyInvestments";
import AvailableLoans from "./components/Investor/AvailableLoans";
import TransactionsInvestor from "./components/Investor/Transactions";
import TransactionDetailsInvestor from "./components/Investor/TransactionDetails";

// Admin Components
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageUsers from "./components/Admin/ManageUsers";
import AllLoans from "./components/Admin/AllLoans";
import AllFarms from "./components/Admin/AllFarms";
import Issues from "./components/Admin/Issues";
import AdminTransactions from "./components/Admin/AdminTransactions";
import VerifyLoans from "./components/Admin/VerifyLoans";
import AllDocuments from "./components/Admin/AdminDocuments";
// Common Components
import ReportIssue from "./components/Common/ReportIssue";
import TransactionAnalytics from "./components/Investor/TransactionAnalytics"; 
import "./styles.css";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                    {/* Farmer Routes */}
                    <Route path="/farmer/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
                    <Route path="/farmer/farm-form" element={<ProtectedRoute><FarmForm /></ProtectedRoute>} />
                    <Route path="/farmer/my-farms" element={<ProtectedRoute><MyFarms /></ProtectedRoute>} />
                    <Route path="/farmer/request-loan" element={<ProtectedRoute><LoanRequest /></ProtectedRoute>} />
                    <Route path="/farmer/my-loans" element={<ProtectedRoute><MyLoans /></ProtectedRoute>} />
                    <Route path="/farmer/repay-loan" element={<ProtectedRoute><RepayLoan /></ProtectedRoute>} />
                    <Route path="/farmer/upload-document" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />
                    <Route path="/farmer/my-documents" element={<ProtectedRoute><MyDocuments /></ProtectedRoute>} />
                    <Route path="/farmer/:id/repayment-schedule" element={<ProtectedRoute><LoanRepaySchedule /></ProtectedRoute>} />
                    <Route path="/farmer/transactions" element={<ProtectedRoute><TransactionsFarmer /></ProtectedRoute>} />
                    <Route path="/farmer/transactions/:id" element={<ProtectedRoute><TransactionDetailsFarmer /></ProtectedRoute>} />
                    <Route path="/farmer/farmer-profile" element={<ProtectedRoute><Farmerprofile /></ProtectedRoute>} />
                    {/* <Route path="/farmer/analytics" element={<ProtectedRoute><TransactionAnalytics /></ProtectedRoute>} /> */}

                    {/* Investor Routes */}

                    <Route path="/investor/dashboard" element={<ProtectedRoute><InvestorDashboard /></ProtectedRoute>} />
                    <Route path="/investor/view-farms" element={<ProtectedRoute><ViewFarms /></ProtectedRoute>} />
                    <Route path="/investor/invest-farm" element={<ProtectedRoute><InvestFarm /></ProtectedRoute>} />
                    <Route path="/investor/my-investments" element={<ProtectedRoute><MyInvestments /></ProtectedRoute>} />
                    <Route path="/investor/available-loans" element={<ProtectedRoute><AvailableLoans /></ProtectedRoute>} />
                    <Route path="/invest/:loanId" element={<ProtectedRoute><InvestFarm /></ProtectedRoute>} />
                    <Route path="/investor/transactions" element={<ProtectedRoute><TransactionsInvestor /></ProtectedRoute>} />
                    <Route path="/investor/transactions/:id" element={<ProtectedRoute><TransactionDetailsInvestor /></ProtectedRoute>} />
                    <Route path="/investor/transactions/analytics" element={<ProtectedRoute><TransactionAnalytics /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
                    <Route path="/admin/loans" element={<ProtectedRoute><AllLoans /></ProtectedRoute>} />
                    <Route path="/admin/farms" element={<ProtectedRoute><AllFarms /></ProtectedRoute>} />
                    <Route path="/admin/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
                    {/* <Route path="/admin/analytics" element={<ProtectedRoute><TransactionAnalytics /></ProtectedRoute>} /> */}
                    <Route path="/admin/transactions" element={<ProtectedRoute><AdminTransactions /></ProtectedRoute>} />
                    <Route path="/admin/verify-investments" element={<ProtectedRoute><VerifyLoans /></ProtectedRoute>} />
                    <Route path="/admin/documents" element={<ProtectedRoute><AllDocuments /></ProtectedRoute>} />
                
                    {/* Common Routes */}
                    <Route path="/common/report-issue" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
                </Routes>
                {/* <Footer /> */}
            </Router>
        </AuthProvider>
    );
}

export default App;
