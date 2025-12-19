/**
 * Admin Dashboard Script
 */

let allSongs = [];
let currentEditSong = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  // Load admin name
  const user = getUser();
  if (user) {
    document.getElementById('adminName').textContent = user.name;
  }

  // Setup form handler
  document.getElementById('uploadForm').addEventListener('submit', handleUpload);

  // Load songs
  loadSongs();
});

// Load all songs
async function loadSongs() {
  try {
    const data = await apiRequest('/admin/songs');
    allSongs = data.songs;
    renderSongs(allSongs);
  } catch (error) {
    document.getElementById('songsList').innerHTML = `
      <div class="alert alert-error">
        <p>Error loading songs: ${error.message}</p>
      </div>
    `;
  }
}

// Render songs
function renderSongs(songs) {
  const container = document.getElementById('songsList');

  if (!songs || songs.length === 0) {
    container.innerHTML = '<p>No songs uploaded yet.</p>';
    return;
  }

  container.innerHTML = songs.map(song => `
    <div class="song-item">
      <img src="${song.coverImage || '/uploads/images/default-cover.jpg'}" 
           alt="${song.title}" 
           class="song-cover"
           onerror="this.src='/uploads/images/default-cover.jpg'">
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
        ${song.genre ? `<div class="song-genre">${song.genre}</div>` : ''}
      </div>
      <div class="song-actions">
        <button class="btn btn-warning" onclick="editSong('${song._id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteSong('${song._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Handle song upload
async function handleUpload(e) {
  e.preventDefault();
  const alertContainer = document.getElementById('uploadAlert');

  const formData = new FormData();
  formData.append('title', document.getElementById('songTitle').value);
  formData.append('artist', document.getElementById('songArtist').value);
  formData.append('genre', document.getElementById('songGenre').value || '');
  formData.append('audio', document.getElementById('audioFile').files[0]);

  const coverImage = document.getElementById('coverImage').files[0];
  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  // Show loading
  alertContainer.innerHTML = '<div class="alert">Uploading song...</div>';

  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/songs/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    alertContainer.innerHTML = '<div class="alert alert-success">Song uploaded successfully!</div>';
    
    // Reset form
    document.getElementById('uploadForm').reset();
    
    // Reload songs
    loadSongs();
  } catch (error) {
    alertContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

// Edit song
async function editSong(songId) {
  const song = allSongs.find(s => s._id === songId);
  if (!song) return;

  currentEditSong = song;

  // Create edit modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'editModal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit Song</h3>
        <button class="close" onclick="closeEditModal()">&times;</button>
      </div>
      <form id="editForm">
        <div class="form-group">
          <label class="form-label" for="editTitle">Title *</label>
          <input type="text" id="editTitle" class="form-input" value="${song.title}" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="editArtist">Artist *</label>
          <input type="text" id="editArtist" class="form-input" value="${song.artist}" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="editGenre">Genre</label>
          <input type="text" id="editGenre" class="form-input" value="${song.genre || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" for="editCoverImage">Update Cover Image (Optional)</label>
          <input type="file" id="editCoverImage" class="form-input" accept="image/*">
        </div>
        <div style="display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary">Update Song</button>
          <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'block';

  // Handle form submission
  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateSong(songId);
  });
}

// Update song
async function updateSong(songId) {
  const formData = new FormData();
  formData.append('title', document.getElementById('editTitle').value);
  formData.append('artist', document.getElementById('editArtist').value);
  formData.append('genre', document.getElementById('editGenre').value || '');

  const coverImage = document.getElementById('editCoverImage').files[0];
  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/songs/${songId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Update failed');
    }

    closeEditModal();
    loadSongs();
    alert('Song updated successfully!');
  } catch (error) {
    alert('Error updating song: ' + error.message);
  }
}

// Close edit modal
function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.remove();
  }
}

// Delete song
async function deleteSong(songId) {
  if (!confirm('Are you sure you want to delete this song? This action cannot be undone.')) {
    return;
  }

  try {
    await apiRequest(`/admin/songs/${songId}`, { method: 'DELETE' });
    loadSongs();
    alert('Song deleted successfully!');
  } catch (error) {
    alert('Error deleting song: ' + error.message);
  }
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    logout();
  }
}

