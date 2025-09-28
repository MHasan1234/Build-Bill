import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './NewInvoice.css'; 

export default function NewInvoice() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, hours: 0, type: 'Product' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/clients", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not fetch clients");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        
        console.error("Failed to fetch clients for dropdown:", err);
      }
    };
    if (token) {
      fetchClients();
    }
  }, [token]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'type' && value === 'Product') {
      newItems[index].hours = 0;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, hours: 0, type: 'Product' }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.type === 'Service' 
        ? item.quantity * item.rate * item.hours 
        : item.quantity * item.rate;
      return total + itemTotal;
    }, 0);
  };

  const handleClientSelect = (clientId) => {
    const selectedClient = clients.find(c => c._id === clientId);
    if (selectedClient) {
      setClientName(selectedClient.name);
      setClientEmail(selectedClient.email);
    } else {
      setClientName("");
      setClientEmail("");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const invoiceData = {
      clientName,
      clientEmail,
      items,
      totalAmount: calculateTotal(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create invoice");
      }
      navigate("/invoices");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create New Invoice</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Select Existing Client:</label>
            <select 
              onChange={(e) => handleClientSelect(e.target.value)} 
              className="client-select"
            >
              <option value="">-- Or Enter Manually Below --</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Client Name:</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Client Email:</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <h3>Items</h3>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <select className="item-input" value={item.type} onChange={(e) => handleItemChange(index, "type", e.target.value)}>
                <option value="Product">Product</option>
                <option value="Service">Service</option>
              </select>
              <input
                type="text"
                className="item-input description"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                required
              />
              <input
                type="number"
                className="item-input"
                placeholder="Quantity"
                value={item.quantity}
                min="1"
                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value, 10))}
                required
              />
              {item.type === 'Service' && (
                <input
                  type="number"
                  className="item-input"
                  placeholder="Hours"
                  value={item.hours}
                  min="0"
                  onChange={(e) => handleItemChange(index, "hours", parseFloat(e.target.value))}
                />
              )}
              <input
                type="number"
                className="item-input"
                placeholder="Rate"
                value={item.rate}
                min="0"
                step="0.01"
                onChange={(e) => handleItemChange(index, "rate", parseFloat(e.target.value))}
                required
              />
              <button type="button" onClick={() => removeItem(index)} className="btn-danger">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addItem} style={{ alignSelf: 'flex-start' }}>+ Add Item</button>

          <h3 className="total-amount">Total: ₹{calculateTotal().toFixed(2)}</h3>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Invoice"}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}