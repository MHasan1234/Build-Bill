import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function InvoiceDetails() {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailStatus, setEmailStatus] = useState(''); 
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
        if (!res.ok) throw new Error("Failed to fetch invoice details");
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchInvoice();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/invoices/${id}`, {
          method: 'DELETE',
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to delete invoice");
        navigate("/invoices");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSendEmail = async () => {
    setEmailStatus('Sending...');
    try {
      const res = await fetch(`http://localhost:5000/api/email/${id}/send`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send email");
      setEmailStatus(`Email sent! Preview at: ${data.previewUrl}`);
    } catch (err) {
      setEmailStatus(`Error: ${err.message}`);
    }
  };

  const handleDownloadPDF = () => {
    window.open(`http://localhost:5000/api/pdf/${id}/pdf?token=${token}`, '_blank');
  };


  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error-message"> {error}</div>;
  if (!invoice) return <div className="container">Invoice not found.</div>;

  return (
    <div className="container">
      <div className="card">
        <h2>Invoice Details</h2>
        <p><strong>Client:</strong> {invoice.clientName}</p>
        <p><strong>Email:</strong> {invoice.clientEmail}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Total Amount:</strong> ₹{invoice.totalAmount}</p>
        
        <h3 style={{ marginTop: 20 }}>Items</h3>
        <ul>
          {invoice.items.map((item, index) => (
            <li key={index}>
              {item.description} - {item.quantity} x ₹{item.rate}
            </li>
          ))}
        </ul>
        
        <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate("/invoices")}>Back</button>
          <button onClick={handleSendEmail} className="btn-primary">Send Email</button>
          <button onClick={handleDownloadPDF} className="btn-secondary">Download PDF</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
        
        {emailStatus && <p style={{ marginTop: '1rem' }}>{emailStatus}</p>}
      </div>
    </div>
  );
}