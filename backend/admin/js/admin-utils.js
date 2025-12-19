/**
 * Admin Utility Functions
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Get token from localStorage
function getToken() {
  return localStorage.getItem('adminToken');
}

// Save token to localStorage
function saveToken(token) {
  localStorage.setItem('adminToken', token);
}

// Remove token from localStorage
function removeToken() {
  localStorage.removeItem('adminToken');
}

// Get user data from localStorage
function getUser() {
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Save user data to localStorage
function saveUser(user) {
  localStorage.setItem('adminUser', JSON.stringify(user));
}

// Remove user data from localStorage
function removeUser() {
  localStorage.removeItem('adminUser');
}

// Check if admin is authenticated
function isAuthenticated() {
  return !!getToken();
}

// Make API request with authentication
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Logout function
function logout() {
  removeToken();
  removeUser();
  window.location.href = 'login.html';
}

