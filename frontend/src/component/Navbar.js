import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pos_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  }, [location.pathname]);

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = () => {
    localStorage.removeItem('pos_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <Link to="/dashboard" className="brand-link">POS System</Link>
        </div>
        <ul className="nav-links">
          <li className={isActive('/Welcome')}>
            <Link to="/Welcome">Home</Link>
          </li>
          {!user && (
            <>
              <li className={isActive('/signup')}>
                <Link to="/signup">Signup</Link>
              </li>
              <li className={isActive('/login')}>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
        <div className="nav-user">
          {user && (
            <Link to="/dashboard" className="nav-admin-btn">Admin Panel</Link>
          )}
          {user ? (
            <>
              <span className="nav-username">{user.fullName} ({user.role})</span>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span className="nav-username muted">Guest</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
