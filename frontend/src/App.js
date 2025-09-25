// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import Navbar from './component/Navbar';
import AddItemForm from './admin/AddItemForm';
import Dashboard from './admin/Dashboard';
import './App.css';
import Welcome from './user/Welcome';
import POS from './user/POS';
import Product from './admin/Product';
import Sales from './admin/Sales';
import Signup from './user/Signup';
import Login from './user/Login';

function AppContent() {
  const location = useLocation();

  // Don't show Sidebar on Welcome, POS, or Signup pages
  const hideSidebar = location.pathname === '/Welcome' || location.pathname === '/pos' || location.pathname === '/signup' || location.pathname === '/login';

  return (
    <div className="App">
      <Navbar />
      {!hideSidebar && <Sidebar />}

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-item" element={<AddItemForm />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/products" element={<Product />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
