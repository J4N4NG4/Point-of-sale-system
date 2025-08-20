// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import AddItemForm from './admin/AddItemForm';
import Dashboard from './admin/Dashboard';
import './App.css';
import Welcome from './user/Welcome';
import POS from './user/POS';
import Product from './admin/Product';
import Sales from './admin/Sales';

function AppContent() {
  const location = useLocation();

  // Don't show Sidebar on Welcome or POS pages
  const hideSidebar = location.pathname === '/Welcome' || location.pathname === '/pos';

  return (
    <div className="App">
      {!hideSidebar && <Sidebar />}

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-item" element={<AddItemForm />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/products" element={<Product />} />
        <Route path="/sales" element={<Sales />} />
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
