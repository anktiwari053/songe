/**
 * Favorites Page Script
 */

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  loadFavorites();
});

// Load favorite songs
async function loadFavorites() {
  try {
    const data = await apiRequest('/favorites');
    renderFavorites(data.songs);
  } catch (error) {
    document.getElementById('favoritesContainer').innerHTML = `
      <div class="alert alert-error">
        <p>Error loading favorites: ${error.message}</p>
      </div>
    `;
  }
}

// Render favorite songs
function renderFavorites(songs) {
  const container = document.getElementById('favoritesContainer');

  if (!songs || songs.length === 0) {
    container.innerHTML = `
      <div class="empty-favorites">
        <h2>No favorite songs yet</h2>
        <p>Start adding songs to your favorites!</p>
        <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Browse Songs</a>
      </div>
    `;
    return;
  }

  container.innerHTML = songs.map(song => `
    <div class="favorite-card">
      <img src="${song.coverImage || '/uploads/images/default-cover.jpg'}" 
           alt="${song.title}" 
           class="favorite-cover"
           onerror="this.src='/uploads/images/default-cover.jpg'">
      <div class="favorite-title">${song.title}</div>
      <div class="favorite-artist">${song.artist}</div>
      <div class="favorite-actions">
        <button class="btn-play" onclick="playSong('${song._id}')">▶ Play</button>
        <button class="btn-remove" onclick="removeFavorite('${song._id}')">Remove</button>
      </div>
    </div>
  `).join('');
}

// Play song
async function playSong(songId) {
  try {
    const allSongsData = await apiRequest('/songs');
    const song = allSongsData.songs.find(s => s._id === songId);
    
    if (song) {
      window.location.href = `index.html?play=${songId}`;
    }
  } catch (error) {
    alert('Error playing song: ' + error.message);
  }
}

// Remove from favorites
async function removeFavorite(songId) {
  if (!confirm('Remove this song from favorites?')) {
    return;
  }

  try {
    await apiRequest(`/favorites/${songId}`, { method: 'DELETE' });
    loadFavorites(); // Reload favorites
  } catch (error) {
    alert('Error removing favorite: ' + error.message);
  }
}

