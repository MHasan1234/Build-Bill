import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Invoices from './pages/Invoices.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import NewInvoice from './pages/NewInvoice.jsx';
import InvoiceDetails from './pages/InvoiceDetails.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AccountantDashboard from './pages/AccountantDashboard.jsx'; // Import AccountantDashboard

import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AccountantRoute from './components/AccountantRoute.jsx'; // Import AccountantRoute
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
            <Route path="/invoices/new" element={<PrivateRoute><NewInvoice /></PrivateRoute>} />
            <Route path="/invoices/:id" element={<PrivateRoute><InvoiceDetails /></PrivateRoute>} />
            
            {/* Admin Route */}
            <Route 
              path="/admin/dashboard" 
              element={<AdminRoute><AdminDashboard /></AdminRoute>} 
            />

            {/* Accountant Route */}
            <Route
              path="/accountant/dashboard"
              element={<AccountantRoute><AccountantDashboard /></AccountantRoute>}
            />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  )
}

export default App
