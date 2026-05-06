import { requireAuth, getToken, logout } from './auth.js';
import { API_URL } from './firebase-config.js';

let editingId = null;

async function init() {
  await requireAuth();

  document.getElementById('btn-logout')?.addEventListener('click', logout);
  document.getElementById('question-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('btn-cancel-edit').addEventListener('click', cancelEdit);

  await loadQuestions();
  loadStats();
}

async function loadQuestions() {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/questions/admin/all?limit=20`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.status === 403) {
      showAdminError();
      return;
    }
    const questions = await res.json();
    renderTable(questions);
    document.getElementById('stat-total').textContent = questions.length;
  } catch {
    renderTableError();
  }
}

function renderTable(questions) {
  const tbody = document.getElementById('questions-tbody');
  if (!questions.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="px-md py-lg text-center text-on-surface-variant">No questions yet. Add one using the form.</td></tr>`;
    return;
  }
  tbody.innerHTML = questions.map(q => `
    <tr class="hover:bg-surface-container transition-colors group">
      <td class="px-md py-md">
        <p class="text-body-md font-medium text-on-surface">${escHtml(q.text)}</p>
        <p class="text-label-sm text-on-surface-variant mt-xs">${q.options?.filter(o => o.isCorrect).map(o => `✓ ${o.text}`).join('') || ''}</p>
      </td>
      <td class="px-md py-md">
        <span class="px-sm py-xs rounded-full border border-primary/30 text-primary text-label-sm bg-primary/5">${escHtml(q.category)}</span>
      </td>
      <td class="px-md py-md">
        <span class="px-sm py-xs rounded-full border border-tertiary/30 text-tertiary text-label-sm bg-tertiary/5">${escHtml(q.difficulty)}</span>
      </td>
      <td class="px-md py-md text-right">
        <div class="flex justify-end gap-sm">
          <button onclick="editQuestion('${q.id}')" class="p-sm text-on-surface-variant hover:text-primary transition-colors" title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button onclick="deleteQuestion('${q.id}')" class="p-sm text-on-surface-variant hover:text-error transition-colors" title="Delete">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const text = document.getElementById('q-text').value.trim();
  const options = [
    document.getElementById('q-opt-a').value.trim(),
    document.getElementById('q-opt-b').value.trim(),
    document.getElementById('q-opt-c').value.trim(),
    document.getElementById('q-opt-d').value.trim(),
  ];
  const correctIndex = Number(document.getElementById('q-correct').value);
  const category = document.getElementById('q-category').value;
  const difficulty = document.getElementById('q-difficulty').value;

  if (!text || options.some(o => !o)) {
    alert('Please fill in the question and all 4 options.');
    return;
  }

  const token = await getToken();
  const url = editingId ? `${API_URL}/questions/${editingId}` : `${API_URL}/questions`;
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text, options, correctIndex, category, difficulty }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Failed to save question.');
      return;
    }
    cancelEdit();
    await loadQuestions();
  } catch {
    alert('Network error. Is the backend running?');
  }
}

window.editQuestion = async function(id) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/questions/admin/all`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const questions = await res.json();
  const q = questions.find(x => x.id === id);
  if (!q) return;

  editingId = id;
  document.getElementById('q-text').value = q.text;
  q.options.forEach((opt, i) => {
    document.getElementById(`q-opt-${['a','b','c','d'][i]}`).value = opt.text;
    if (opt.isCorrect) document.getElementById('q-correct').value = i;
  });
  document.getElementById('q-category').value = q.category;
  document.getElementById('q-difficulty').value = q.difficulty;
  document.getElementById('form-title').textContent = 'Edit Question';
  document.getElementById('btn-submit-form').textContent = 'Update Question';
  document.getElementById('btn-cancel-edit').classList.remove('hidden');
  document.getElementById('question-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteQuestion = async function(id) {
  if (!confirm('Delete this question permanently?')) return;
  try {
    const token = await getToken();
    await fetch(`${API_URL}/questions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    await loadQuestions();
  } catch {
    alert('Delete failed.');
  }
};

function cancelEdit() {
  editingId = null;
  document.getElementById('question-form').reset();
  document.getElementById('form-title').textContent = 'New Question';
  document.getElementById('btn-submit-form').textContent = 'Publish Question';
  document.getElementById('btn-cancel-edit').classList.add('hidden');
}

async function loadStats() {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/questions/admin/all?limit=100`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const qs = await res.json();
    document.getElementById('stat-total').textContent = qs.length.toLocaleString();
    const cats = new Set(qs.map(q => q.category));
    document.getElementById('stat-categories').textContent = cats.size;
  } catch { /* ignore */ }
}

function showAdminError() {
  document.getElementById('questions-tbody').innerHTML =
    `<tr><td colspan="4" class="px-md py-lg text-center text-error">Access denied. Your UID must be added to ADMIN_UIDS in the backend .env file.</td></tr>`;
}

function renderTableError() {
  document.getElementById('questions-tbody').innerHTML =
    `<tr><td colspan="4" class="px-md py-lg text-center text-on-surface-variant">Failed to load. Is the backend running?</td></tr>`;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

init();
