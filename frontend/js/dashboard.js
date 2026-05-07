import { requireAuth, logout, auth } from './auth.js';
import { API_URL } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const CATEGORIES = [
  { name: 'Science', icon: 'science', color: 'tertiary', desc: 'Explore the wonders of biology, physics, and the universe.' },
  { name: 'History', icon: 'history_edu', color: 'primary', desc: 'Journey through time from ancient civilizations to modern era.' },
  { name: 'Technology', icon: 'terminal', color: 'secondary', desc: 'Stay updated with AI, coding, and the latest digital trends.' },
  { name: 'Geography', icon: 'public', color: 'tertiary', desc: 'Discover the world\'s landmarks, cultures, and hidden gems.' },
  { name: 'Mathematics', icon: 'calculate', color: 'primary', desc: 'Sharpen your mind with numbers, algebra, and logic.' },
  { name: 'General', icon: 'auto_awesome', color: 'secondary', desc: 'A mixed bag of trivia from all topics.' },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

async function init() {
  const user = await requireAuth();

  // Update nav user info
  document.getElementById('user-name').textContent = user.displayName || 'Player';
  if (user.photoURL) {
    document.getElementById('user-avatar').src = user.photoURL;
    document.getElementById('user-avatar').alt = user.displayName;
  }

  document.getElementById('btn-logout').addEventListener('click', logout);
  document.getElementById('btn-quick-play').addEventListener('click', () => {
    window.location.href = `quiz.html?category=General&difficulty=Easy`;
  });

  renderCategories();
  loadUserStats(user.uid);
}

function renderCategories() {
  const container = document.getElementById('categories-grid');
  container.innerHTML = CATEGORIES.map(cat => `
    <div
      class="glass-card p-md rounded-xl flex flex-col justify-between group cursor-pointer"
      onclick="startQuiz('${cat.name}','Easy')"
    >
      <div class="flex justify-between items-start mb-md">
        <div class="p-sm rounded-lg bg-${cat.color}-container/20 text-${cat.color}">
          <span class="material-symbols-outlined text-[32px]">${cat.icon}</span>
        </div>
        <div class="flex gap-xs flex-wrap justify-end">
          ${DIFFICULTIES.map(d => `
            <button
              onclick="event.stopPropagation(); startQuiz('${cat.name}','${d}')"
              class="px-sm py-xs rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm border border-outline-variant hover:border-${cat.color}/50 hover:text-${cat.color} transition-colors cursor-pointer"
            >${d}</button>
          `).join('')}
        </div>
      </div>
      <div>
        <h3 class="text-headline-md font-headline-md text-on-surface mb-xs">${cat.name}</h3>
        <p class="text-label-sm text-on-surface-variant">${cat.desc}</p>
      </div>
    </div>
  `).join('');
}

window.startQuiz = function(category, difficulty) {
  window.location.href = `quiz.html?category=${encodeURIComponent(category)}&difficulty=${encodeURIComponent(difficulty)}`;
};

async function loadUserStats(uid) {
  try {
    const res = await fetch(`${API_URL}/leaderboard/user/${uid}`);
    const data = await res.json();
    if (data.totalScore !== undefined) {
      document.getElementById('stat-score').textContent = (data.totalScore || 0).toLocaleString();
      document.getElementById('stat-quizzes').textContent = data.quizzesTaken || 0;
      document.getElementById('stat-rank').textContent = data.rank ? `#${data.rank}` : '-';
    }
  } catch {
    // Stats unavailable, keep defaults
  }
}

init();
