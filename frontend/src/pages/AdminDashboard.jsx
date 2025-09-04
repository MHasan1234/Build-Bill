import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAllInvoices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/invoices/all-invoices", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch all invoices");
        }

        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllInvoices();
    }
  }, [token]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading all invoices...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>⚠️ {error}</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h2>Admin Panel: All Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices have been created by any user yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {invoices.map((invoice) => (
            <li key={invoice._id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10, borderRadius: 5 }}>
              <p><strong>Client:</strong> {invoice.clientName}</p>
              <p><strong>Amount:</strong> ₹{invoice.totalAmount}</p>
              <p><strong>Status:</strong> {invoice.status}</p>
              <p><small><em>Invoice ID: {invoice._id}</em></small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}