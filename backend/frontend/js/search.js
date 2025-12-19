/**
 * Search Page Script
 */

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Search on Enter key
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
});

// Perform search
async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  const resultsContainer = document.getElementById('resultsContainer');

  if (!query) {
    resultsContainer.innerHTML = '<p class="search-hint">Please enter a search term</p>';
    return;
  }

  // Show loading
  resultsContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Searching...</p>
    </div>
  `;

  try {
    const data = await apiRequest(`/songs/search?query=${encodeURIComponent(query)}`);
    renderResults(data.songs);
  } catch (error) {
    resultsContainer.innerHTML = `
      <div class="alert alert-error">
        <p>Error searching: ${error.message}</p>
      </div>
    `;
  }
}

// Render search results
function renderResults(songs) {
  const container = document.getElementById('resultsContainer');

  if (!songs || songs.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <h2>No songs found</h2>
        <p>Try a different search term</p>
      </div>
    `;
    return;
  }

  container.innerHTML = songs.map(song => `
    <div class="result-card">
      <img src="${song.coverImage || '/uploads/images/default-cover.jpg'}" 
           alt="${song.title}" 
           class="result-cover"
           onerror="this.src='/uploads/images/default-cover.jpg'">
      <div class="result-title">${song.title}</div>
      <div class="result-artist">${song.artist}</div>
      <div class="result-actions">
        <button class="btn-play" onclick="playSong('${song._id}')">▶ Play</button>
      </div>
    </div>
  `).join('');
}

// Play song from search results
async function playSong(songId) {
  try {
    // Get all songs to find the one to play
    const allSongsData = await apiRequest('/songs');
    const song = allSongsData.songs.find(s => s._id === songId);
    
    if (song) {
      // Redirect to home page and play the song
      window.location.href = `index.html?play=${songId}`;
    }
  } catch (error) {
    alert('Error playing song: ' + error.message);
  }
}

