// ── Noted. PWA App ──
'use strict';

const CAT_LABELS = {
  personal: '🌿 Personal',
  work: '💼 Work',
  ideas: '💡 Ideas',
  urgent: '🔥 Urgent'
};

let todos = JSON.parse(localStorage.getItem('noted-todos') || '[]');
let currentFilter = 'all';

// ── DOM refs ──
const input       = document.getElementById('todo-input');
const addBtn      = document.getElementById('add-btn');
const catSelect   = document.getElementById('category-select');
const todoList    = document.getElementById('todo-list');
const emptyState  = document.getElementById('empty-state');
const listFooter  = document.getElementById('list-footer');
const clearBtn    = document.getElementById('clear-done-btn');
const dateDisplay = document.getElementById('date-display');
const offlineBadge= document.getElementById('offline-badge');
const statTotal   = document.getElementById('stat-total');
const statActive  = document.getElementById('stat-active');
const statDone    = document.getElementById('stat-done');

// ── Date ──
function updateDate() {
  const now = new Date();
  dateDisplay.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
updateDate();

// ── Offline badge ──
function updateOnlineStatus() {
  offlineBadge.classList.toggle('visible', !navigator.onLine);
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// ── Save ──
function save() {
  localStorage.setItem('noted-todos', JSON.stringify(todos));
}

// ── Stats ──
function updateStats() {
  const total  = todos.length;
  const done   = todos.filter(t => t.done).length;
  const active = total - done;
  statTotal.textContent  = total;
  statActive.textContent = active;
  statDone.textContent   = done;
  listFooter.style.display = done > 0 ? 'block' : 'none';
}

// ── Filter ──
function getFiltered() {
  if (currentFilter === 'active') return todos.filter(t => !t.done);
  if (currentFilter === 'done')   return todos.filter(t => t.done);
  return todos;
}

// ── Render ──
function render() {
  const filtered = getFiltered();
  todoList.innerHTML = '';

  emptyState.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');
    li.dataset.id  = todo.id;
    li.dataset.cat = todo.category;

    const timeStr = new Date(todo.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    li.innerHTML = `
      <button class="check-btn" aria-label="Toggle done">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
      <div class="todo-content">
        <div class="todo-text">${escapeHTML(todo.text)}</div>
        <div class="todo-meta">
          <span class="cat-badge">${CAT_LABELS[todo.category] || todo.category}</span>
          <span class="todo-time">${timeStr}</span>
        </div>
      </div>
      <button class="delete-btn" aria-label="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button>
    `;

    li.querySelector('.check-btn').addEventListener('click', () => toggleDone(todo.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id, li));

    todoList.appendChild(li);
  });

  updateStats();
}

// ── Add ──
function addTodo() {
  const text = input.value.trim();
  if (!text) { input.focus(); shakeInput(); return; }

  const todo = {
    id: Date.now().toString(),
    text,
    category: catSelect.value,
    done: false,
    createdAt: new Date().toISOString()
  };

  todos.unshift(todo);
  save();
  render();
  input.value = '';
  input.focus();
}

function shakeInput() {
  input.style.animation = 'none';
  input.offsetHeight; // reflow
  input.style.animation = 'shake 0.3s ease';
  setTimeout(() => input.style.animation = '', 400);
}

// ── Toggle ──
function toggleDone(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) { todo.done = !todo.done; save(); render(); }
}

// ── Delete ──
function deleteTodo(id, el) {
  el.classList.add('removing');
  el.addEventListener('animationend', () => {
    todos = todos.filter(t => t.id !== id);
    save();
    render();
  }, { once: true });
}

// ── Clear done ──
clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

// ── Filters ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ── Events ──
addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });

// ── Helpers ──
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Shake animation (CSS inject) ──
const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }`;
document.head.appendChild(styleEl);

// ── Service Worker ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW error:', err));
  });
}

// ── Init ──
render();
