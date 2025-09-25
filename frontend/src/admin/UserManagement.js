import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../styles/UserManagement.css';

const roles = ['Cashier', 'Manager', 'Admin'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [editing, setEditing] = useState(null); // user object being edited
  const [form, setForm] = useState({ fullName: '', username: '', role: 'Cashier', password: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = 'http://localhost:8070';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE}/api/users`);
      setUsers(res.data || []);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return users;
    return users.filter(u =>
      u.fullName.toLowerCase().includes(text) ||
      u.username.toLowerCase().includes(text) ||
      u.role.toLowerCase().includes(text)
    );
  }, [users, search]);

  const startEdit = (user) => {
    setEditing(user);
    setForm({ fullName: user.fullName, username: user.username, role: user.role, password: '' });
    setMessage('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ fullName: '', username: '', role: 'Cashier', password: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveUser = async () => {
    if (!editing) return;
    if (!form.fullName || !form.username) {
      setMessage('Full name and username are required.');
      return;
    }
    try {
      setSaving(true);
      const payload = { fullName: form.fullName, username: form.username, role: form.role };
      if (form.password) payload.password = form.password;
      await axios.put(`${API_BASE}/api/users/${editing._id}`, payload);
      setMessage('User updated successfully.');
      await fetchUsers();
      cancelEdit();
    } catch (err) {
      const apiErr = err?.response?.data?.error || 'Failed to update user.';
      setMessage(apiErr);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE}/api/users/${id}`);
      await fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to delete user.');
    }
  };

  if (loading) return <div className="um-container">Loading users...</div>;
  if (error) return <div className="um-container error">{error}</div>;

  return (
    <div className="um-container">
      <div className="um-header">
        <h2>User Management</h2>
        <input
          className="um-search"
          type="text"
          placeholder="Search by name, username, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length ? (
              filteredUsers.map(u => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="um-btn" onClick={() => startEdit(u)}>Edit</button>
                    <button className="um-btn danger" onClick={() => deleteUser(u._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="no-data">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="um-modal">
          <div className="um-modal-content">
            <h3>Edit User</h3>
            {message && <div className="um-alert">{message}</div>}
            <div className="um-form-row">
              <label>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="um-form-row">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} />
            </div>
            <div className="um-form-row">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="um-form-row">
              <label>Password (leave blank to keep current)</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} />
            </div>
            <div className="um-actions">
              <button className="um-btn" onClick={cancelEdit}>Cancel</button>
              <button className="um-btn primary" onClick={saveUser} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
