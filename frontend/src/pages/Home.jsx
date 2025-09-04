import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to BuildBill</h1>
      <p>Your simple solution for creating and managing invoices.</p>
      <div>
        <Link to="/login" style={{ marginRight: '10px', textDecoration: 'none', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>Login</Link>
        <Link to="/register" style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px' }}>Register</Link>
      </div>
    </div>
  );
}