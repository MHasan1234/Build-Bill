import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
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
          setError(data.message || "Failed to fetch stats");
          return;
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
    return <div style={{ padding: 20, color: "red" }}>⚠️ {error}</div>;
  }

  if (!stats) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>Welcome, {user?.name}</h2>
      <h3>📊 Your Invoice Summary</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>Total Invoices: {stats.totalInvoices}</li>
        <li>Paid Invoices: {stats.paidInvoices}</li>
        <li>Unpaid Invoices: {stats.unpaidInvoices}</li>
        <li>Total Income: ₹{stats.totalIncome}</li>
      </ul>

      <button 
        onClick={logout}
        style={{ marginTop: 20, padding: "10px 14px" }}
      >
        Logout
      </button>
    </div>
  );
}
