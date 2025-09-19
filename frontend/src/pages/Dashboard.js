import React, { useState, useEffect } from 'react';
import { getReminders } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReminders();
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch pill reminders. Please try again later.');
      console.error('Error fetching reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const getTimeStatus = (timeString) => {
    try {
      const now = new Date();
      const reminderTime = new Date(`${now.toDateString()} ${timeString}`);
      const currentTime = new Date();
      
      if (reminderTime < currentTime) {
        return 'overdue';
      } else if (reminderTime - currentTime <= 60 * 60 * 1000) { // Within 1 hour
        return 'upcoming';
      }
      return 'scheduled';
    } catch {
      return 'scheduled';
    }
  };

  const refreshReminders = () => {
    fetchReminders();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your pill reminders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Your medication reminders for today</p>
        <button className="refresh-btn" onClick={refreshReminders}>
          <span className="refresh-icon">🔄</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button className="retry-btn" onClick={refreshReminders}>
            Try Again
          </button>
        </div>
      )}

      <div className="reminders-container">
        {reminders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <h3>No Reminders Today</h3>
            <p>You don't have any pill reminders scheduled for today.</p>
          </div>
        ) : (
          <div className="reminders-grid">
            {reminders.map((reminder, index) => (
              <div 
                key={reminder.id || index} 
                className={`reminder-card ${getTimeStatus(reminder.time)}`}
              >
                <div className="reminder-header">
                  <div className="pill-info">
                    <span className="pill-emoji">💊</span>
                    <h3 className="pill-name">{reminder.pill_name || reminder.name || 'Unknown Medication'}</h3>
                  </div>
                  <div className={`status-badge ${getTimeStatus(reminder.time)}`}>
                    {getTimeStatus(reminder.time) === 'overdue' && '⏰ Overdue'}
                    {getTimeStatus(reminder.time) === 'upcoming' && '🔔 Soon'}
                    {getTimeStatus(reminder.time) === 'scheduled' && '📅 Scheduled'}
                  </div>
                </div>
                
                <div className="reminder-details">
                  <div className="time-info">
                    <span className="time-label">Time:</span>
                    <span className="time-value">{formatTime(reminder.time)}</span>
                  </div>
                  
                  {reminder.dosage && (
                    <div className="dosage-info">
                      <span className="dosage-label">Dosage:</span>
                      <span className="dosage-value">{reminder.dosage}</span>
                    </div>
                  )}
                  
                  {reminder.instructions && (
                    <div className="instructions-info">
                      <span className="instructions-label">Instructions:</span>
                      <span className="instructions-value">{reminder.instructions}</span>
                    </div>
                  )}
                </div>
                
                <div className="reminder-actions">
                  <button className="mark-taken-btn">
                    ✓ Mark as Taken
                  </button>
                  <button className="snooze-btn">
                    ⏰ Snooze 15min
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;