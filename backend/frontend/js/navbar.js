/**
 * Navbar Component
 * Common navigation bar for all pages
 */

function renderNavbar() {
  const user = getUser();
  const isLoggedIn = isAuthenticated();

  const navbar = `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <a href="index.html">🎵 Music App</a>
        </div>
        <ul class="nav-menu">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="search.html" class="nav-link">Search</a></li>
          ${isLoggedIn ? `
            <li><a href="favorites.html" class="nav-link">Favorites</a></li>
            <li><a href="profile.html" class="nav-link">Profile</a></li>
            ${isAdmin() ? `<li><a href="/admin/index.html" class="nav-link">Admin</a></li>` : ''}
            <li><a href="#" onclick="logout(); return false;" class="nav-link">Logout</a></li>
          ` : `
            <li><a href="login.html" class="nav-link">Login</a></li>
            <li><a href="register.html" class="nav-link">Register</a></li>
          `}
        </ul>
      </div>
    </nav>
  `;

  // Insert navbar at the beginning of body
  document.body.insertAdjacentHTML('afterbegin', navbar);
}

// Initialize navbar when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderNavbar);
} else {
  renderNavbar();
}

