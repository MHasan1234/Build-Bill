import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './NewInvoice.css'; // We'll add some styles for the new form

export default function NewInvoice() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, hours: 0, type: 'Product' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    // Reset hours if type is changed to Product
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