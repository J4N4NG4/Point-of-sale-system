// components/Sidebar.js
import React from 'react';
import '../styles/Sidebar.css';
import { FaTachometerAlt, FaBoxOpen, FaChartLine, FaUsers, FaPlus, FaCashRegister } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        Admin Panel
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/"><FaTachometerAlt className="icon" /> Dashboard</Link></li>
        <li><Link to="/products"><FaBoxOpen className="icon" /> Products</Link></li>
        <li><Link to="/pos"><FaCashRegister className="icon" /> POS</Link></li>
        <li><Link to="/sales"><FaChartLine className="icon" /> Sales</Link></li>
        <li><Link to="/users"><FaUsers className="icon" /> Users</Link></li>
        <li><Link to="/add-item"><FaPlus className="icon" /> Add Item</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
