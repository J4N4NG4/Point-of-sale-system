// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import AddItemForm from './admin/AddItemForm';
import './App.css';
import Welcome from './user/Welcome';

function AppContent() {
  const location = useLocation();

  // Don't show Sidebar on Welcome page
  const hideSidebar = location.pathname === '/Welcome';

  return (
    <div className="App">
      {!hideSidebar && <Sidebar />}

      <Routes>
        <Route path="/" element={<Navigate to="/add-item" />} />
        <Route path="/add-item" element={<AddItemForm />} />
        <Route path="/Welcome" element={<Welcome />} />
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
