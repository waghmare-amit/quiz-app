import { requireAuth, logout } from './auth.js';
import { API_URL } from './firebase-config.js';

const MEDALS = ['medal-gold', 'medal-silver', 'medal-bronze'];
const MEDAL_ICONS = ['🥇', '🥈', '🥉'];

async function init() {
  const user = await requireAuth();

  document.getElementById('btn-logout')?.addEventListener('click', logout);
  if (user.photoURL) document.getElementById('user-avatar').src = user.photoURL;

  await Promise.all([loadLeaderboard(user.uid), loadUserRank(user.uid)]);
}

async function loadLeaderboard(currentUid) {
  try {
    const res = await fetch(`${API_URL}/leaderboard?limit=20`);
    const data = await res.json();
    renderPodium(data.slice(0, 3));
    renderTable(data.slice(3), currentUid, 4);
  } catch {
    document.getElementById('leaderboard-table-body').innerHTML =
      `<tr><td colspan="6" class="px-md py-lg text-center text-on-surface-variant">Failed to load leaderboard. Ensure the backend is running.</td></tr>`;
  }
}

async function loadUserRank(uid) {
  try {
    const res = await fetch(`${API_URL}/leaderboard/user/${uid}`);
    const data = await res.json();
    if (data.rank) {
      document.getElementById('your-rank').textContent = `Your Rank: #${data.rank}`;
      document.getElementById('your-score').textContent = `${(data.totalScore || 0).toLocaleString()} pts`;
    }
  } catch { /* ignore */ }
}

function renderPodium(top3) {
  const order = [1, 0, 2]; // silver, gold, bronze display order
  const ids = ['podium-2nd', 'podium-1st', 'podium-3rd'];
  order.forEach((dataIdx, displayIdx) => {
    const player = top3[dataIdx];
    const el = document.getElementById(ids[displayIdx]);
    if (!el || !player) return;
    el.querySelector('[data-field="name"]').textContent = player.displayName || 'Anonymous';
    el.querySelector('[data-field="score"]').textContent = `${(player.totalScore || 0).toLocaleString()} PTS`;
    if (player.photoURL) {
      const img = el.querySelector('[data-field="avatar"]');
      if (img) img.src = player.photoURL;
    }
  });
}

function renderTable(players, currentUid, startRank) {
  const tbody = document.getElementById('leaderboard-table-body');
  if (!players.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-md py-lg text-center text-on-surface-variant">No more players yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = players.map((p, i) => {
    const rank = startRank + i;
    const isYou = p.uid === currentUid;
    return `
      <tr class="hover:bg-surface-container-high transition-colors ${isYou ? 'bg-primary/5 border-l-2 border-primary' : ''}">
        <td class="px-md py-4 font-bold text-on-surface">#${rank}</td>
        <td class="px-md py-4">
          <div class="flex items-center gap-sm">
            <img src="${p.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(p.displayName || 'A') + '&background=6d3bd7&color=fff'}"
              alt="${p.displayName}" class="w-8 h-8 rounded-full border border-outline-variant"/>
            <div>
              <div class="text-label-md font-bold text-on-surface">${p.displayName || 'Anonymous'} ${isYou ? '<span class="text-primary text-label-sm">(You)</span>' : ''}</div>
              <div class="text-label-sm text-on-surface-variant">${p.quizzesTaken || 0} quizzes</div>
            </div>
          </div>
        </td>
        <td class="px-md py-4 text-tertiary font-bold">${(p.totalScore || 0).toLocaleString()}</td>
        <td class="px-md py-4">${p.quizzesTaken || 0}</td>
        <td class="px-md py-4 text-on-surface-variant">${formatDate(p.updatedAt)}</td>
        <td class="px-md py-4 text-right">
          <span class="material-symbols-outlined text-primary cursor-default">person</span>
        </td>
      </tr>
    `;
  }).join('');
}

function formatDate(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts._seconds * 1000);
  return d.toLocaleDateString();
}

init();
