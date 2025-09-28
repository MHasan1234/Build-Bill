import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import './AccountantDashboard.css'; 
export default function AccountantDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports/invoices", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch invoices");
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchInvoices();
  }, [token]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/reports/revenue-summary", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate, endDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate report");
      setReport(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleExportCSV = () => {
 
    window.location.href = `http://localhost:5000/api/reports/export/invoices-csv?token=${token}`;
  };

  return (
    <div className="container">
      <h2>Accountant Panel</h2>

      <div className="card report-section">
        <h3>Financial Reports</h3>
        <form onSubmit={handleGenerateReport} className="report-form">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          <button type="submit" className="btn-primary">Generate Revenue Summary</button>
        </form>
        {report && (
          <div className="report-summary">
            <h4>Summary for {report.startDate} to {report.endDate}</h4>
            <p>Total Revenue: ₹{report.totalRevenue.toFixed(2)}</p>
            <p>Number of Paid Invoices: {report.numberOfInvoices}</p>
          </div>
        )}
      </div>
      
      <div className="card">
        <div className="invoices-header">
            <h3>All Invoices</h3>
            <button onClick={handleExportCSV} className="btn-secondary">Export to CSV</button>
        </div>
        {loading && <p>Loading invoices...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && (
          <ul className="invoice-list">
            {invoices.map((invoice) => (
              <li key={invoice._id} className="invoice-item">
                <span>Client: {invoice.clientName}</span>
                <span>Amount: ₹{invoice.totalAmount}</span>
                <span className={`status-${invoice.status.toLowerCase()}`}>{invoice.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
