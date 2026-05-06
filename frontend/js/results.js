import { requireAuth } from './auth.js';
import { API_URL } from './firebase-config.js';

async function init() {
  const user = await requireAuth();

  const raw = localStorage.getItem('quiz_results');
  if (!raw) {
    window.location.href = 'dashboard.html';
    return;
  }
  const results = JSON.parse(raw);

  // Personalise heading
  const headings = ['Phenomenal Work!', 'Outstanding!', 'Well Done!', 'Great Effort!'];
  const heading = results.accuracy >= 80
    ? headings[0]
    : results.accuracy >= 60
    ? headings[1]
    : results.accuracy >= 40
    ? headings[2]
    : headings[3];

  document.getElementById('result-heading').textContent = heading;
  document.getElementById('result-user').textContent = user.displayName || 'Player';
  document.getElementById('result-score').textContent = results.score;
  document.getElementById('result-total').textContent = `/ ${results.totalPossible}`;
  document.getElementById('result-correct').textContent = results.correct;
  document.getElementById('result-incorrect').textContent = results.incorrect;
  document.getElementById('result-accuracy').textContent = `${results.accuracy}%`;
  document.getElementById('result-category').textContent = results.category;
  document.getElementById('result-difficulty').textContent = results.difficulty;

  // Time bonus estimate
  const estimatedTimeBonus = Math.round((results.accuracy / 100) * 125);
  document.getElementById('result-time-bonus').textContent = `+${estimatedTimeBonus} pts`;

  // Animated score ring
  const circumference = 2 * Math.PI * 110;
  const offset = circumference - (results.score / results.totalPossible) * circumference;
  const arc = document.getElementById('score-arc');
  if (arc) {
    arc.style.strokeDasharray = circumference;
    arc.style.strokeDashoffset = offset;
  }

  // Fetch global rank
  try {
    const res = await fetch(`${API_URL}/leaderboard/user/${user.uid}`);
    const data = await res.json();
    if (data.rank) {
      document.getElementById('result-rank').textContent = `#${data.rank}`;
    }
  } catch { /* rank unavailable */ }

  // Buttons
  document.getElementById('btn-leaderboard').addEventListener('click', () => {
    window.location.href = 'leaderboard.html';
  });
  document.getElementById('btn-retry').addEventListener('click', () => {
    window.location.href = `quiz.html?category=${results.category}&difficulty=${results.difficulty}`;
  });
  document.getElementById('btn-dashboard').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
}

init();
