/* ── main.js ────────────────────────────────────────────────────── */

// Smooth anchor fix
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    link.blur();

    const y = target.getBoundingClientRect().top + window.pageYOffset - 6;
    window.scrollTo({ top: y, behavior: 'smooth' });

    window.setTimeout(() => {
      history.replaceState(null, '', href);
      document.activeElement && document.activeElement.blur && document.activeElement.blur();
    }, 450);
  });
});

// Custom Audio Player
const audio = document.getElementById('audioAmbiente');
const playBtn = document.getElementById('playPauseBtn');
const progressFill = document.getElementById('progressFill');
const progressWrap = document.getElementById('progressWrap');
const volSlider = document.getElementById('volumen');

if (audio && playBtn && progressFill && progressWrap && volSlider) {
  const iconPlay = playBtn.querySelector('.icon-play');
  const iconPause = playBtn.querySelector('.icon-pause');

  audio.volume = parseFloat(volSlider.value);

  function setPlaying(playing) {
    if (!iconPlay || !iconPause) return;

    if (playing) {
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
    } else {
      iconPause.classList.add('hidden');
      iconPlay.classList.remove('hidden');
    }
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('play', () => setPlaying(true));

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
  });

  progressWrap.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressWrap.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  });

  volSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volSlider.value);
  });
}
