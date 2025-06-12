// components/lyrics.js

export function showLyrics(text) {
  const box = document.querySelector('#lyrics-box');
  box.innerText = text;
  box.classList.add('visible');
}

export function hideLyrics() {
  document.querySelector('#lyrics-box')?.classList.remove('visible');
}
