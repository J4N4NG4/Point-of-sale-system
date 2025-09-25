import React from "react";
import "../styles/Welcome.css"; // Assuming you have a CSS file for styling
import { FaKey, FaStore, FaBook, FaUsers, FaUser, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaKey />, label: "Register", color: "#333" },
    { icon: <FaStore />, label: "Store Status", color: "#ff9800" },
    { icon: <FaBook />, label: "Pricebook", color: "#e53935" },
    { icon: <FaUsers />, label: "Vendors", color: "#8e24aa" },
    { icon: <FaUser />, label: "Users", color: "#2e7d32" },
    { icon: <FaClock />, label: "Time Clock", color: "#90a4ae" },
  ];

  const onCardClick = (label) => {
    if (label === "Store Status") {
      navigate("/pos");
    }
  };

  return (
    <div className="welcome">
      <h1 className="welcome-text">Welcome!</h1>

      <div className="grid">
        {menuItems.map((item, index) => (
          <div
            className="card"
            key={index}
            onClick={() => onCardClick(item.label)}
            style={{ cursor: item.label === "Store Status" ? "pointer" : "default" }}
          >
            <div className="icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      <div className="footer">
        <button className="login-btn">Login</button>
      </div>
    </div>
  );
};

export default Welcome;
