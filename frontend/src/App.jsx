import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Invoices from './pages/Invoices.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import NewInvoice from './pages/NewInvoice.jsx';
import InvoiceDetails from './pages/InvoiceDetails.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AccountantDashboard from './pages/AccountantDashboard.jsx'; 

import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AccountantRoute from './components/AccountantRoute.jsx'; 
import Navbar from './components/Navbar.jsx';
import Clients from './pages/Clients.jsx';
import ClientDetails from './pages/ClientDetails.jsx';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
          
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
            <Route path="/invoices/new" element={<PrivateRoute><NewInvoice /></PrivateRoute>} />
            <Route path="/invoices/:id" element={<PrivateRoute><InvoiceDetails /></PrivateRoute>} />
            <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
            <Route path="/clients/:id" element={<PrivateRoute><ClientDetails /></PrivateRoute>} />
            
            <Route 
              path="/admin/dashboard" 
              element={<AdminRoute><AdminDashboard /></AdminRoute>} 
            />

        
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
