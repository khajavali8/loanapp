import React, { useEffect, useState } from 'react';
import FarmerDashboard from '../components/Farmer/FarmerDashboard';
import InvestorDashboard from '../components/Investor/InvestorDashboard';
import AdminDashboard from '../components/Admin/AdminDashboard';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {user.role === 'farmer' && <FarmerDashboard />}
            {user.role === 'investor' && <InvestorDashboard />}
            {user.role === 'admin' && <AdminDashboard />}
        </div>
    );
};

export default Dashboard;
