/**
 * Register Page Script
 */

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  if (isAuthenticated()) {
    window.location.href = 'index.html';
  }

  // Handle form submission
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

// Handle registration
async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const alertContainer = document.getElementById('alertContainer');

  // Show loading
  alertContainer.innerHTML = '<div class="alert">Registering...</div>';

  try {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    // Save token and user
    saveToken(data.token);
    saveUser(data.user);

    // Show success
    alertContainer.innerHTML = '<div class="alert alert-success">Registration successful! Redirecting...</div>';

    // Redirect to home
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    alertContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

