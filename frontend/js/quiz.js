import { requireAuth, getToken } from './auth.js';
import { API_URL } from './firebase-config.js';

const POINTS_PER_CORRECT = 100;
const MAX_TIME_BONUS = 50;
const QUESTION_TIME = 30;

const state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  correctAnswers: 0,
  selectedAnswer: null,
  answered: false,
  timeLeft: QUESTION_TIME,
  timerInterval: null,
  startTime: Date.now(),
  category: 'General',
  difficulty: 'Easy',
};

async function init() {
  await requireAuth();
  const params = new URLSearchParams(window.location.search);
  state.category = params.get('category') || 'General';
  state.difficulty = params.get('difficulty') || 'Easy';

  showLoading(true);
  await loadQuestions();
  showLoading(false);

  if (!state.questions.length) {
    showError('No questions found for this category and difficulty. Please try another.');
    return;
  }

  renderQuestion();
  document.getElementById('btn-submit').addEventListener('click', handleSubmit);
  document.getElementById('btn-skip').addEventListener('click', handleSkip);
}

async function loadQuestions() {
  try {
    const res = await fetch(
      `${API_URL}/questions?category=${encodeURIComponent(state.category)}&difficulty=${encodeURIComponent(state.difficulty)}&limit=10`
    );
    state.questions = await res.json();
  } catch {
    showError('Failed to load questions. Make sure the backend server is running.');
  }
}

function renderQuestion() {
  if (state.currentIndex >= state.questions.length) {
    endQuiz();
    return;
  }

  const q = state.questions[state.currentIndex];
  state.selectedAnswer = null;
  state.answered = false;
  state.timeLeft = QUESTION_TIME;

  // Counter
  document.getElementById('question-counter').textContent =
    `Question ${state.currentIndex + 1} of ${state.questions.length}`;

  // Question text
  document.getElementById('question-text').textContent = q.text;

  // Score
  document.getElementById('score-display').textContent = `Score: ${state.score.toLocaleString()}`;

  // Progress bar
  document.getElementById('progress-bar').style.width =
    `${(state.currentIndex / state.questions.length) * 100}%`;

  // Timer reset
  const timerEl = document.getElementById('timer-display');
  timerEl.textContent = `00:${String(QUESTION_TIME).padStart(2, '0')}`;
  timerEl.closest('[id="timer-wrapper"]')?.classList.remove('bg-error-container');
  timerEl.classList.remove('text-error');

  // Submit button reset
  const submitBtn = document.getElementById('btn-submit');
  submitBtn.textContent = 'Submit Answer';
  submitBtn.disabled = false;

  // Options
  const container = document.getElementById('options-container');
  container.innerHTML = q.options.map((opt, i) => `
    <button
      data-index="${i}"
      class="option-btn group relative flex items-center p-md bg-surface-container border border-outline-variant rounded-lg transition-all duration-200 hover:border-primary hover:bg-surface-container-high active:scale-[0.98] w-full text-left"
    >
      <span class="option-letter flex-shrink-0 w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-label-md font-bold transition-colors">
        ${String.fromCharCode(65 + i)}
      </span>
      <span class="ml-md text-body-md font-medium text-on-surface-variant">${opt}</span>
    </button>
  `).join('');

  container.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(Number(btn.dataset.index)));
  });

  startTimer();
}

function startTimer() {
  clearInterval(state.timerInterval);
  const timerEl = document.getElementById('timer-display');
  const timerWrapper = document.getElementById('timer-wrapper');

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    timerEl.textContent = `00:${String(state.timeLeft).padStart(2, '0')}`;
    if (state.timeLeft <= 10) {
      timerWrapper?.classList.add('bg-error-container');
      timerEl.classList.add('text-error');
    }
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (!state.answered) handleTimeUp();
    }
  }, 1000);
}

function selectAnswer(index) {
  if (state.answered) return;
  state.selectedAnswer = index;

  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.remove('border-primary', 'bg-primary/10', 'border-2');
    btn.querySelector('.option-letter').className =
      'option-letter flex-shrink-0 w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-label-md font-bold transition-colors';
    if (i === index) {
      btn.classList.add('border-primary', 'bg-primary/10', 'border-2');
      btn.querySelector('.option-letter').className =
        'option-letter flex-shrink-0 w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center text-label-md font-bold transition-colors';
    }
  });
}

async function handleSubmit() {
  if (state.answered) {
    state.currentIndex++;
    renderQuestion();
    return;
  }
  if (state.selectedAnswer === null) return;
  await checkAnswer();
}

function handleSkip() {
  clearInterval(state.timerInterval);
  state.currentIndex++;
  renderQuestion();
}

function handleTimeUp() {
  state.answered = true;
  clearInterval(state.timerInterval);
  revealCorrectAnswer(null, null);
  document.getElementById('btn-submit').textContent = 'Next Question →';
}

async function checkAnswer() {
  clearInterval(state.timerInterval);
  state.answered = true;

  const q = state.questions[state.currentIndex];
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/questions/${q.id}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ selectedIndex: state.selectedAnswer }),
    });
    const { correct, correctIndex } = await res.json();

    if (correct) {
      const timeBonus = Math.round((state.timeLeft / QUESTION_TIME) * MAX_TIME_BONUS);
      state.score += POINTS_PER_CORRECT + timeBonus;
      state.correctAnswers++;
    }

    revealCorrectAnswer(state.selectedAnswer, correctIndex);
    document.getElementById('score-display').textContent = `Score: ${state.score.toLocaleString()}`;
    document.getElementById('btn-submit').textContent = 'Next Question →';
  } catch (err) {
    console.error('Answer check failed:', err);
    state.currentIndex++;
    renderQuestion();
  }
}

function revealCorrectAnswer(selectedIndex, correctIndex) {
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    const letter = btn.querySelector('.option-letter');
    if (i === correctIndex) {
      btn.classList.add('border-tertiary', 'bg-tertiary/10', 'border-2');
      letter.className = 'option-letter flex-shrink-0 w-10 h-10 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center text-label-md font-bold';
    } else if (i === selectedIndex && i !== correctIndex) {
      btn.classList.add('border-error', 'bg-error/10', 'border-2');
      letter.className = 'option-letter flex-shrink-0 w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center text-label-md font-bold';
    }
  });
}

async function endQuiz() {
  clearInterval(state.timerInterval);
  const timeTaken = Math.round((Date.now() - state.startTime) / 1000);

  const results = {
    score: state.score,
    totalPossible: state.questions.length * (POINTS_PER_CORRECT + MAX_TIME_BONUS),
    correct: state.correctAnswers,
    incorrect: state.questions.length - state.correctAnswers,
    total: state.questions.length,
    category: state.category,
    difficulty: state.difficulty,
    timeTaken,
    accuracy: state.questions.length
      ? Math.round((state.correctAnswers / state.questions.length) * 100)
      : 0,
  };
  localStorage.setItem('quiz_results', JSON.stringify(results));

  try {
    const token = await getToken();
    await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        score: state.score,
        category: state.category,
        difficulty: state.difficulty,
        correctAnswers: state.correctAnswers,
        totalQuestions: state.questions.length,
        timeTaken,
      }),
    });
  } catch (err) {
    console.error('Score submission error:', err);
  }

  window.location.href = 'results.html';
}

function showLoading(on) {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = on ? 'flex' : 'none';
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

init();
