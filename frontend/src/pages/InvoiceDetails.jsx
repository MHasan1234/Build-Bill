import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function InvoiceDetails() {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/invoices/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch invoice details");
        }

        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInvoice();
    }
  }, [id, token]);
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/invoices/${id}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to delete invoice");
        }

        navigate("/invoices");
      } catch (err) {
        setError(err.message);
      }
    }
  };

   // New function to handle sending the email
  const handleSendEmail = async () => {
    setEmailStatus('Sending...');
    try {
      const res = await fetch(`http://localhost:5000/api/invoices/${id}/send`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send email");
      }
      
      setEmailStatus(`Email sent! Preview: ${data.previewUrl}`);
      // In a real app, you might just show "Email Sent!"
      // We show the preview URL here for development convenience.
      
    } catch (err) {
      setEmailStatus(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading invoice details...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>⚠️ {error}</div>;
  }

  if (!invoice) {
    return <div style={{ padding: 20 }}>Invoice not found.</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20, border: "1px solid #ccc", borderRadius: 5 }}>
      <h2>Invoice Details</h2>
      <p><strong>Client:</strong> {invoice.clientName}</p>
      <p><strong>Email:</strong> {invoice.clientEmail}</p>
      <p><strong>Status:</strong> {invoice.status}</p>
      <p><strong>Total Amount:</strong> ₹{invoice.totalAmount}</p>
      
      <h3 style={{ marginTop: 20 }}>Items</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {invoice.items.map((item, index) => (
          <li key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.description}</span>
            <span>{item.quantity} x ₹{item.rate} = ₹{item.quantity * item.rate}</span>
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("/invoices")} style={{ marginRight: 10 }}>Back to Invoices</button>
        <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete Invoice</button>
      </div>
    </div>
  );
}