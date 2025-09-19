import React, { useState, useEffect } from 'react';
import { getLogs } from '../services/api';
import './Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch dispensing logs. Please try again later.');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch {
      return {
        date: 'Invalid Date',
        time: 'Invalid Time'
      };
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toString().toLowerCase();
    
    if (normalizedStatus === 'true' || normalizedStatus === 'yes' || normalizedStatus === '1') {
      return { text: 'Dispensed', class: 'success' };
    } else if (normalizedStatus === 'false' || normalizedStatus === 'no' || normalizedStatus === '0') {
      return { text: 'Not Dispensed', class: 'error' };
    } else {
      return { text: 'Unknown', class: 'warning' };
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'dispensed') {
      const status = log.pill_dispensed?.toString().toLowerCase();
      return status === 'true' || status === 'yes' || status === '1';
    }
    if (filter === 'not-dispensed') {
      const status = log.pill_dispensed?.toString().toLowerCase();
      return status === 'false' || status === 'no' || status === '0';
    }
    return true;
  });

  const sortedLogs = filteredLogs.sort((a, b) => {
    const dateA = new Date(a.time || a.timestamp);
    const dateB = new Date(b.time || b.timestamp);
    
    if (sortOrder === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const refreshLogs = () => {
    fetchLogs();
  };

  if (loading) {
    return (
      <div className="logs-page">
        <div className="logs-header">
          <h1>Dispensing Logs</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dispensing logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-page">
      <div className="logs-header">
        <h1>Dispensing Logs</h1>
        <p className="logs-subtitle">Track all medication dispensing activities</p>
        <div className="header-actions">
          <button className="refresh-btn" onClick={refreshLogs}>
            <span className="refresh-icon">🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button className="retry-btn" onClick={refreshLogs}>
            Try Again
          </button>
        </div>
      )}

      <div className="logs-controls">
        <div className="filter-group">
          <label htmlFor="filter" className="filter-label">Filter by Status:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Logs</option>
            <option value="dispensed">Dispensed Only</option>
            <option value="not-dispensed">Not Dispensed Only</option>
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort" className="sort-label">Sort by Date:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <div className="logs-count">
          <span className="count-text">
            {filteredLogs.length} of {logs.length} logs
          </span>
        </div>
      </div>

      <div className="logs-container">
        {sortedLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Logs Found</h3>
            <p>
              {filter === 'all' 
                ? 'No dispensing logs are available yet.' 
                : `No logs found for the selected filter: ${filter.replace('-', ' ')}.`
              }
            </p>
            {filter !== 'all' && (
              <button 
                className="clear-filter-btn" 
                onClick={() => setFilter('all')}
              >
                Clear Filter
              </button>
            )}
          </div>
        ) : (
          <div className="logs-list">
            {sortedLogs.map((log, index) => {
              const statusBadge = getStatusBadge(log.pill_dispensed);
              const dateTime = formatDateTime(log.time || log.timestamp);
              
              return (
                <div key={log.id || index} className="log-card">
                  <div className="log-header">
                    <div className="log-id">
                      <span className="id-label">Log #</span>
                      <span className="id-value">{log.id || index + 1}</span>
                    </div>
                    <div className={`status-badge ${statusBadge.class}`}>
                      <span className="status-icon">
                        {statusBadge.class === 'success' ? '✅' : 
                         statusBadge.class === 'error' ? '❌' : '⚠️'}
                      </span>
                      {statusBadge.text}
                    </div>
                  </div>

                  <div className="log-details">
                    <div className="detail-row">
                      <span className="detail-label">User ID:</span>
                      <span className="detail-value">{log.user_id || 'Unknown'}</span>
                    </div>

                    {log.pill_name && (
                      <div className="detail-row">
                        <span className="detail-label">Medication:</span>
                        <span className="detail-value pill-name">
                          💊 {log.pill_name}
                        </span>
                      </div>
                    )}

                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{dateTime.date}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">{dateTime.time}</span>
                    </div>

                    {log.notes && (
                      <div className="detail-row">
                        <span className="detail-label">Notes:</span>
                        <span className="detail-value">{log.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="log-footer">
                    <span className="log-timestamp">
                      Logged {new Date(log.time || log.timestamp).toRelativeTimeString?.() || 'recently'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;