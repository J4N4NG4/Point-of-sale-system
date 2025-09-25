import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Signup.css';

const roles = ['Cashier', 'Manager', 'Admin'];

const Signup = () => {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    role: 'Cashier',
    password: '',
    confirmPassword: '',
  });
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

    if (!form.fullName || !form.username || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      // NOTE: Backend signup route not yet implemented. Adjust path when available.
      const payload = {
        fullName: form.fullName,
        username: form.username,
        role: form.role,
        password: form.password,
      };
      await axios.post('http://localhost:8070/api/users/signup', payload);
      setMessage('User registered successfully. You can now log in.');
      setForm({ fullName: '', username: '', role: 'Cashier', password: '', confirmPassword: '' });
    } catch (err) {
      const apiErr = err?.response?.data?.error || 'Registration failed. Please try again.';
      setError(apiErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        {(error || message) && (
          <div className={`alert ${error ? 'error' : 'success'}`}>{error || message}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

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
            />
          </div>

          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
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

          <div className="form-row">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
