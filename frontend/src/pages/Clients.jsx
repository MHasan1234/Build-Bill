import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import './Clients.css';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/clients", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not fetch clients");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClients();
    }
  }, [token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const res = await fetch("http://localhost:5000/api/clients", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, address }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add client");
      }
      
      resetForm();
      fetchClients();

    } catch (err) {
      setFormError(err.message);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setFormError(null);
  };

  return (
    <div className="container">
      <h2>Client Management</h2>

      <div className="card add-client-form">
        <h3>Add New Client</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-row">
            <input type="text" placeholder="Client Name*" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="Client Email*" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-row">
            <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
            <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{alignSelf: 'flex-start'}}>+ Add Client</button>
          {formError && <p className="error-message">{formError}</p>}
        </form>
      </div>

      <div className="card">
        <h3>Your Clients</h3>
        {loading && <p>Loading clients...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && (
          <div className="client-list">
            {clients.length === 0 ? (
              <p>You haven't added any clients yet.</p>
            ) : (
              clients.map(client => (
                <div key={client._id} className="client-item">
                  <div>
                    <h4>{client.name}</h4>
                    <p>{client.email}</p>
                    {client.phone && <p>{client.phone}</p>}
                  </div>
                  <div className="client-actions">
                    <Link to={`/clients/${client._id}`} className="btn-secondary">
                        View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}