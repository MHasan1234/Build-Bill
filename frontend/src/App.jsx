import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/Login.jsx';
import Invoices from './pages/Invoices.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  

  return (
   <Router>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
      <Route path="/invoices" element={<PrivateRoute><Invoices/></PrivateRoute>} />
      <Route path="/invoices/new" element={<PrivateRoute><Home/></PrivateRoute>} />
    </Routes>
    </AuthProvider>
   </Router>
  )
}

export default App
