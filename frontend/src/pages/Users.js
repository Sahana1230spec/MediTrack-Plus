import React, { useState } from 'react';
import { createUser } from '../services/api';
import './Users.css';

const Users = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear success message when form is modified
    if (success) {
      setSuccess(false);
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitMessage('');

    try {
      await createUser(formData);
      setSuccess(true);
      setSubmitMessage('User created successfully! 🎉');
      setFormData({
        username: '',
        email: '',
        password: ''
      });
    } catch (error) {
      setSuccess(false);
      if (error.response?.status === 400) {
        setSubmitMessage('User already exists or invalid data provided.');
      } else if (error.response?.status === 409) {
        setSubmitMessage('Username or email already taken.');
      } else {
        setSubmitMessage('Failed to create user. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      username: '',
      email: '',
      password: ''
    });
    setErrors({});
    setSuccess(false);
    setSubmitMessage('');
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>User Management</h1>
        <p className="users-subtitle">Create new user accounts for MediTrack+</p>
      </div>

      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Create New User</h2>
            <span className="form-icon">👤</span>
          </div>

          <form onSubmit={handleSubmit} className="user-form" noValidate>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Enter username"
                disabled={loading}
                autoComplete="username"
              />
              {errors.username && (
                <span className="error-text">
                  <span className="error-icon">⚠️</span>
                  {errors.username}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && (
                <span className="error-text">
                  <span className="error-icon">⚠️</span>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter password"
                disabled={loading}
                autoComplete="new-password"
              />
              {errors.password && (
                <span className="error-text">
                  <span className="error-icon">⚠️</span>
                  {errors.password}
                </span>
              )}
              <div className="password-requirements">
                <small>Password must contain at least one uppercase letter, lowercase letter, and number</small>
              </div>
            </div>

            {submitMessage && (
              <div className={`submit-message ${success ? 'success' : 'error'}`}>
                <span className="message-icon">
                  {success ? '✅' : '❌'}
                </span>
                {submitMessage}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={clearForm}
                className="clear-btn"
                disabled={loading}
              >
                <span className="btn-icon">🗑️</span>
                Clear Form
              </button>
              
              <button
                type="submit"
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner small"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">👤</span>
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="info-card">
          <h3>User Guidelines</h3>
          <ul className="guidelines-list">
            <li>
              <span className="guideline-icon">📝</span>
              Username must be unique and contain only letters, numbers, and underscores
            </li>
            <li>
              <span className="guideline-icon">📧</span>
              Email address must be valid and unique in the system
            </li>
            <li>
              <span className="guideline-icon">🔒</span>
              Password should be strong with mixed case, numbers, and symbols
            </li>
            <li>
              <span className="guideline-icon">✅</span>
              All fields marked with * are required
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Users;