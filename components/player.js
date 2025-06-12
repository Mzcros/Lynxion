// components/player.js

import { playlist } from './playlist.js';

let currentIndex = 0;
const audio = new Audio();

export function playTrack(index) {
  const track = playlist[index];
  if (!track) return;

  audio.src = track.src;
  audio.play();
  currentIndex = index;
}

export function nextTrack() {
  let next = (currentIndex + 1) % playlist.length;
  playTrack(next);
}

export function prevTrack() {
  let prev = (currentIndex - 1 + playlist.length) % playlist.length;
  playTrack(prev);
}

export function pauseTrack() {
  audio.pause();
}// components/player.js

import { playlist } from './playlist.js';

let currentIndex = 0;
const audio = new Audio();

export function playTrack(index) {
  const track = playlist[index];
  if (!track) return;

  audio.src = track.src;
  audio.play();
  currentIndex = index;
}

export function nextTrack() {
  let next = (currentIndex + 1) % playlist.length;
  playTrack(next);
}

export function prevTrack() {
  let prev = (currentIndex - 1 + playlist.length) % playlist.length;
  playTrack(prev);
}

export function pauseTrack() {
  audio.pause();
}
