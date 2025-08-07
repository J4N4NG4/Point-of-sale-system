// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import AddItemForm from './admin/AddItemForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/add-item" />} />
          <Route path="/add-item" element={<AddItemForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
