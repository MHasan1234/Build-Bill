import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import './Dashboard.css'; 

export default function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/invoices/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch stats");
        }
        setStats(data);
      } catch (err) {
        setError("Network error, try again later");
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (error) {
    return <div className="container error-message"> {error}</div>;
  }

  if (!stats) {
    return <div className="container">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h2>Welcome, {user?.name}</h2>
      <h3>Your Invoice Summary</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Invoices</h4>
          <p>{stats.totalInvoices}</p>
        </div>
        <div className="stat-card">
          <h4>Paid Invoices</h4>
          <p>{stats.paidInvoices}</p>
        </div>
        <div className="stat-card">
          <h4>Unpaid Invoices</h4>
          <p>{stats.unpaidInvoices}</p>
        </div>
        <div className="stat-card">
          <h4>Total Income</h4>
          <p>₹{stats.totalIncome.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}