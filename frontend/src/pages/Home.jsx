import { Link } from 'react-router-dom';
import './Home.css';



export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to <b>BuildBill</b></h1>
        <p>Your simple, fast, and modern solution for creating and managing professional invoices.</p>
        <div className="home-buttons">
          <Link to="/login" className="btn-primary">Continue work</Link>
          <Link to="/register" className="btn-success">Start here</Link>
        </div>
      </div>
      <div className="home-icon">
        <img src="/invoice.png" alt="Invoice illustration" />
      </div>
    </div>
  );
}