import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and authentication
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('The requested resource was not found.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check if the server is running.');
    }
    
    return Promise.reject(error);
  }
);

// UID Checking API
export const checkUID = async (uid) => {
  try {
    const response = await apiClient.get(`/check-uid/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error checking UID:', error);
    throw error;
  }
};

// Reminders API
export const getReminders = async (userId = null) => {
  try {
    const url = userId ? `/reminders/${userId}` : '/reminders';
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};

export const createReminder = async (reminderData) => {
  try {
    const response = await apiClient.post('/reminders', reminderData);
    return response.data;
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

export const updateReminder = async (reminderId, reminderData) => {
  try {
    const response = await apiClient.put(`/reminders/${reminderId}`, reminderData);
    return response.data;
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

export const deleteReminder = async (reminderId) => {
  try {
    const response = await apiClient.delete(`/reminders/${reminderId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

// Users API
export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Logs API
export const getLogs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/logs?${queryParams}` : '/logs';
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};

export const createLog = async (logData) => {
  try {
    const response = await apiClient.post('/logs', logData);
    return response.data;
  } catch (error) {
    console.error('Error creating log:', error);
    throw error;
  }
};

export const getLogsByUser = async (userId) => {
  try {
    const response = await apiClient.get(`/logs/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user logs:', error);
    throw error;
  }
};

// Medication/Pills API
export const getPills = async () => {
  try {
    const response = await apiClient.get('/pills');
    return response.data;
  } catch (error) {
    console.error('Error fetching pills:', error);
    throw error;
  }
};

export const getPill = async (pillId) => {
  try {
    const response = await apiClient.get(`/pills/${pillId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pill:', error);
    throw error;
  }
};

export const createPill = async (pillData) => {
  try {
    const response = await apiClient.post('/pills', pillData);
    return response.data;
  } catch (error) {
    console.error('Error creating pill:', error);
    throw error;
  }
};

// Dispensing API
export const dispensePill = async (dispensingData) => {
  try {
    const response = await apiClient.post('/dispense', dispensingData);
    return response.data;
  } catch (error) {
    console.error('Error dispensing pill:', error);
    throw error;
  }
};

// Health check API
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

// Utility function to test API connectivity
export const testConnection = async () => {
  try {
    await healthCheck();
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Failed to connect to API' 
    };
  }
};

// Export the configured axios instance for custom requests
export { apiClient };

// Export API base URL for reference
export { API_BASE_URL };