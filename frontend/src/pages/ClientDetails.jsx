import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ClientDetails.css';

export default function ClientDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [client, setClient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !id) return;

    const fetchClientDetails = async () => {
      try {
        // Fetch client details
        const clientRes = await fetch(`http://localhost:5000/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientRes.ok) throw new Error('Failed to fetch client details.');
        const clientData = await clientRes.json();
        setClient(clientData);

        // Fetch invoices for this client
        const invoicesRes = await fetch(`http://localhost:5000/api/invoices/client/${encodeURIComponent(clientData.name)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!invoicesRes.ok) throw new Error('Failed to fetch client invoices.');
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id, token]);

  if (loading) return <div className="container">Loading client details...</div>;
  if (error) return <div className="container error-message">{error}</div>;
  if (!client) return <div className="container">Client not found.</div>;

  return (
    <div className="container">
      <div className="card client-header">
        <h2>{client.name}</h2>
        <p>{client.email}</p>
        <p>{client.phone}</p>
        <p>{client.address}</p>
      </div>

      <div className="card">
        <h3>Invoice History</h3>
        {invoices.length > 0 ? (
          <div className="invoices-list">
            {invoices.map((invoice) => (
              <div key={invoice._id} className="invoice-card-small">
                <div className="invoice-info-small">
                  <span>ID: {invoice._id.slice(-6).toUpperCase()}</span>
                  <span>Amount: ₹{invoice.totalAmount.toFixed(2)}</span>
                  <span className={`invoice-status status-${invoice.status.toLowerCase()}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="invoice-actions-small">
                  <Link to={`/invoices/${invoice._id}`}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No invoices found for this client.</p>
        )}
      </div>
    </div>
  );
}