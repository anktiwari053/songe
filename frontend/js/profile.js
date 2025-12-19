/**
 * Profile Page Script
 */

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  loadProfile();
});

// Load user profile
async function loadProfile() {
  try {
    const data = await apiRequest('/profile');
    const user = data.user;
    
    // Update UI
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('profileFavorites').textContent = user.totalFavorites;
    
    // Format date
    const date = new Date(user.createdAt);
    document.getElementById('profileDate').textContent = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    document.querySelector('.profile-card').innerHTML = `
      <div class="alert alert-error">
        <p>Error loading profile: ${error.message}</p>
      </div>
    `;
  }
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    logout();
  }
}

