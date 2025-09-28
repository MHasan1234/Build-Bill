import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="navbar-logo">
          BuildBill
        </Link>
        <ul className="nav-menu">
          {user ? (
            <>
              
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin/dashboard" className="nav-links admin-link">
                    Admin Panel
                  </Link>
                </li>
              )}

            
              {(user.role === 'accountant' || user.role === 'admin') && (
                 <li className="nav-item">
                   <Link to="/accountant/dashboard" className="nav-links accountant-link">
                     Accountant Panel
                   </Link>
                 </li>
              )}

            
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/invoices" className="nav-links">Invoices</Link>
              </li>
              <li className="nav-item">
                <Link to="/clients" className="nav-links">
                  Clients
                </Link>
              </li>
              
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button">Logout</button>
              </li>
            </>
          ) : (
            <>
            
              <li className="nav-item">
                <Link to="/login" className="nav-links">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-button">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}