/**
 * Global audio player singleton.
 * Persists across page navigations via View Transitions.
 * Pages interact with it via custom events on `window`.
 *
 * Events dispatched BY the player (listen on window):
 *   'audio-state' — { playing, trackId, color } — whenever state changes
 *
 * Events consumed BY the player (dispatch on window):
 *   'audio-play'  — { src, title, color, trackId, playlist? } — play a track
 *   'audio-pause' — pause current track
 *   'audio-stop'  — stop and hide player
 */

import { formatTime as fmt } from './format';

let initialized = false;

export function initGlobalPlayer() {
  if (initialized) return;
  initialized = true;

  const audio = new Audio();
  let isPlaying = false;
  let currentTrackId = '';
  let currentColor = '#c9a84c';
  let playlist: { src: string; title: string; color: string; trackId: string }[] = [];
  let playlistIndex = -1;

  // DOM refs
  const player = document.getElementById('global-player')!;
  const playBtn = document.getElementById('gp-play')!;
  const titleEl = document.getElementById('gp-title')!;
  const fillEl = document.getElementById('gp-fill')!;
  const barEl = document.getElementById('gp-bar')!;
  const timeEl = document.getElementById('gp-time')!;
  const closeBtn = document.getElementById('gp-close')!;
  const loopBtn = document.getElementById('gp-loop')!;

  if (!player) return;

  let looping = false;

  function emitState() {
    window.dispatchEvent(new CustomEvent('audio-state', {
      detail: {
        playing: isPlaying,
        trackId: currentTrackId,
        color: currentColor,
      },
    }));
  }

  function showPlayer() {
    player.classList.remove('hidden');
  }

  function hidePlayer() {
    player.classList.add('hidden');
  }

  function play(detail: { src: string; title: string; color: string; trackId: string; playlist?: any[] }) {
    currentTrackId = detail.trackId;
    currentColor = detail.color;
    audio.src = detail.src;
    audio.play();
    isPlaying = true;

    if (detail.playlist) {
      playlist = detail.playlist;
      playlistIndex = playlist.findIndex(t => t.trackId === detail.trackId);
    }

    player.style.setProperty('--accent', detail.color);
    titleEl.textContent = detail.title;
    playBtn.innerHTML = '&#9646;&#9646;';
    showPlayer();
    emitState();
  }

  // Listen for play requests from pages
  window.addEventListener('audio-play', ((e: CustomEvent) => {
    play(e.detail);
  }) as EventListener);

  // Listen for pause requests
  window.addEventListener('audio-pause', () => {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '&#9654;';
    emitState();
  });

  // Listen for stop requests
  window.addEventListener('audio-stop', () => {
    audio.pause();
    audio.src = '';
    isPlaying = false;
    currentTrackId = '';
    playlist = [];
    playlistIndex = -1;
    playBtn.innerHTML = '&#9654;';
    fillEl.style.width = '0%';
    timeEl.textContent = '0:00 / 0:00';
    hidePlayer();
    emitState();
  });

  // Play/pause toggle
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playBtn.innerHTML = '&#9654;';
    } else {
      audio.play();
      isPlaying = true;
      playBtn.innerHTML = '&#9646;&#9646;';
    }
    emitState();
  });

  // Progress updates
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    fillEl.style.width = pct + '%';
    timeEl.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
  });

  // Seek
  barEl.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = barEl.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // Auto-play next track in playlist (loop mode handles repeat via audio.loop)
  audio.addEventListener('ended', () => {
    if (looping) return; // audio.loop handles it, but guard just in case
    if (playlist.length > 0 && playlistIndex >= 0 && playlistIndex + 1 < playlist.length) {
      playlistIndex++;
      const next = playlist[playlistIndex];
      play({ ...next, playlist });
    } else {
      isPlaying = false;
      playBtn.innerHTML = '&#9654;';
      emitState();
    }
  });

  // Loop toggle
  loopBtn.addEventListener('click', () => {
    looping = !looping;
    audio.loop = looping;
    loopBtn.classList.toggle('active', looping);
  });

  // Close button
  closeBtn.addEventListener('click', () => {
    window.dispatchEvent(new Event('audio-stop'));
  });

  // Expose current state for pages that load after audio is already playing
  (window as any).__audioState = () => ({
    playing: isPlaying,
    trackId: currentTrackId,
    color: currentColor,
  });
}
