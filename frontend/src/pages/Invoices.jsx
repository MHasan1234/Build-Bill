import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Invoices.css'; // New CSS file for styling

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  
  // New state for filtering and searching
  const [statusFilter, setStatusFilter] = useState(''); // 'Paid', 'Unpaid', or '' for all
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      // Build the query string based on filters
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      try {
        const res = await fetch(`http://localhost:5000/api/invoices?${params.toString()}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch invoices");
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
      fetchInvoices();
    }
  }, [token, statusFilter, searchTerm]); // Re-run effect when filters change

  return (
    <div className="container">
      <div className="invoices-header">
        <h2>Your Invoices</h2>
        <Link to="/invoices/new" className="btn-primary">+ New Invoice</Link>
      </div>

      <div className="filters-container card">
        <input
          type="text"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {loading && <p>Loading invoices...</p>}
      {error && <div className="error-message">⚠️ {error}</div>}

      {!loading && !error && (
        <div className="invoices-list">
          {invoices.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No invoices found that match your criteria.</p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice._id} className="invoice-card">
                <div className="invoice-info">
                  <span className="client-name">{invoice.clientName}</span>
                  <span className="invoice-amount">₹{invoice.totalAmount.toFixed(2)}</span>
                  <span className={`invoice-status status-${invoice.status.toLowerCase()}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="invoice-actions">
                  <Link to={`/invoices/${invoice._id}`}>View Details</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}