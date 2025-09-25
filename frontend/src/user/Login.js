import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Signup.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!form.username || !form.password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8070/api/users/login', {
        username: form.username,
        password: form.password,
      });

      // Store minimal session info (in real apps, use JWT)
      const user = res.data;
      localStorage.setItem('pos_user', JSON.stringify(user));

      setMessage(`Welcome ${user.fullName}! Redirecting...`);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      const apiErr = err?.response?.data?.error || 'Login failed. Please try again.';
      setError(apiErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Login</h2>
        {(error || message) && (
          <div className={`alert ${error ? 'error' : 'success'}`}>{error || message}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="username">Username / Employee ID</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g., EMP001"
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 14 }}>
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
