/**
 * Home Page Script
 * Displays all songs and handles music player
 */

let allSongs = [];
let currentSongIndex = -1;
let isPlaying = false;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication for favorites
  if (!isAuthenticated()) {
    // Hide favorite buttons if not logged in
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-favorite')) {
        e.preventDefault();
        alert('Please login to add favorites');
        window.location.href = 'login.html';
      }
    });
  }

  loadSongs();
  setupPlayerControls();

  // Check if there's a play parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const playSongId = urlParams.get('play');
  if (playSongId) {
    // Wait for songs to load, then play
    setTimeout(() => {
      const songIndex = allSongs.findIndex(s => s._id === playSongId);
      if (songIndex !== -1) {
        playSong(songIndex);
      }
    }, 500);
  }
});

// Load all songs
async function loadSongs() {
  try {
    const data = await apiRequest('/songs');
    allSongs = data.songs;
    renderSongs(allSongs);
  } catch (error) {
    document.getElementById('songsContainer').innerHTML = `
      <div class="alert alert-error">
        <p>Error loading songs: ${error.message}</p>
      </div>
    `;
  }
}

// Render songs
function renderSongs(songs) {
  const container = document.getElementById('songsContainer');
  
  if (!songs || songs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No songs available</h2>
        <p>Check back later for new music!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = songs.map((song, index) => `
    <div class="song-card" data-index="${index}">
      <img src="${song.coverImage || '/uploads/images/default-cover.jpg'}" 
           alt="${song.title}" 
           class="song-cover"
           onerror="this.src='/uploads/images/default-cover.jpg'">
      <div class="song-title">${song.title}</div>
      <div class="song-artist">${song.artist}</div>
      <div class="song-actions">
        <button class="btn-play" onclick="playSong(${index})">▶ Play</button>
        ${isAuthenticated() ? `
          <button class="btn-favorite" 
                  data-song-id="${song._id}" 
                  onclick="toggleFavorite('${song._id}', this)">
            ♡
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Load favorite status for authenticated users
  if (isAuthenticated()) {
    loadFavoriteStatus();
  }
}

// Play song
function playSong(index) {
  if (index < 0 || index >= allSongs.length) return;

  currentSongIndex = index;
  const song = allSongs[index];
  const audioPlayer = document.getElementById('audioPlayer');
  const musicPlayer = document.getElementById('musicPlayer');

  // Update player UI
  document.getElementById('playerTitle').textContent = song.title;
  document.getElementById('playerArtist').textContent = song.artist;
  document.getElementById('playerCover').src = song.coverImage || '/uploads/images/default-cover.jpg';
  
  // Set audio source
  audioPlayer.src = `http://localhost:3000${song.audioUrl}`;
  
  // Show player
  musicPlayer.style.display = 'block';
  
  // Play audio
  audioPlayer.play();
  isPlaying = true;
  updatePlayPauseButton();

  // Start animations
  startMusicAnimations();

  // Scroll to player
  musicPlayer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Start music animations
function startMusicAnimations() {
  const musicPlayer = document.getElementById('musicPlayer');
  const body = document.body;
  
  // Add playing classes
  musicPlayer.classList.add('playing', 'pulse');
  body.classList.add('music-playing');
  
  // Show "Now Playing" text if it exists
  const nowPlaying = musicPlayer.querySelector('.now-playing');
  if (nowPlaying) {
    nowPlaying.classList.add('show');
  } else {
    // Create "Now Playing" element if it doesn't exist
    const playerDetails = document.querySelector('.player-details');
    if (playerDetails && !playerDetails.querySelector('.now-playing')) {
      const nowPlayingEl = document.createElement('div');
      nowPlayingEl.className = 'now-playing show';
      nowPlayingEl.textContent = 'Now Playing';
      playerDetails.insertBefore(nowPlayingEl, playerDetails.firstChild);
    }
  }
  
  // Trigger vibration on mobile devices
  if ('vibrate' in navigator) {
    navigator.vibrate(100);
  }
}

// Stop music animations
function stopMusicAnimations() {
  const musicPlayer = document.getElementById('musicPlayer');
  const body = document.body;
  
  // Remove playing classes
  musicPlayer.classList.remove('playing', 'pulse');
  body.classList.remove('music-playing');
  
  // Hide "Now Playing" text
  const nowPlaying = musicPlayer.querySelector('.now-playing');
  if (nowPlaying) {
    nowPlaying.classList.remove('show');
  }
}

// Setup player controls
function setupPlayerControls() {
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Play/Pause button
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      stopMusicAnimations();
    } else {
      audioPlayer.play();
      isPlaying = true;
      startMusicAnimations();
    }
    updatePlayPauseButton();
  });

  // Audio events
  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    updatePlayPauseButton();
    startMusicAnimations();
  });

  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayPauseButton();
    stopMusicAnimations();
  });

  audioPlayer.addEventListener('ended', () => {
    stopMusicAnimations();
    playNext();
  });

  // Previous button
  prevBtn.addEventListener('click', () => {
    if (currentSongIndex > 0) {
      playSong(currentSongIndex - 1);
    }
  });

  // Next button
  nextBtn.addEventListener('click', () => {
    playNext();
  });
}

// Play next song
function playNext() {
  if (currentSongIndex < allSongs.length - 1) {
    playSong(currentSongIndex + 1);
  }
}

// Update play/pause button
function updatePlayPauseButton() {
  const btn = document.getElementById('playPauseBtn');
  btn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
}

// Toggle favorite
async function toggleFavorite(songId, button) {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    // Check current status
    const checkData = await apiRequest(`/favorites/check/${songId}`);
    const isFavorite = checkData.isFavorite;

    if (isFavorite) {
      // Remove from favorites
      await apiRequest(`/favorites/${songId}`, { method: 'DELETE' });
      button.classList.remove('active');
      button.textContent = '♡';
    } else {
      // Add to favorites
      await apiRequest(`/favorites/${songId}`, { method: 'POST' });
      button.classList.add('active');
      button.textContent = '♥';
    }
  } catch (error) {
    alert('Error updating favorite: ' + error.message);
  }
}

// Load favorite status for all songs
async function loadFavoriteStatus() {
  try {
    const favoriteData = await apiRequest('/favorites');
    const favoriteIds = favoriteData.songs.map(song => song._id);

    // Update favorite buttons
    document.querySelectorAll('.btn-favorite').forEach(button => {
      const songId = button.getAttribute('data-song-id');
      if (favoriteIds.includes(songId)) {
        button.classList.add('active');
        button.textContent = '♥';
      }
    });
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
}

