import './style.css';

const API_BASE_URL = 'https://api.freeapi.app/api/v1/public/randomjokes';
let currentPage = 1;
const LIMIT = 10;
let currentQuery = '';
let totalPages = 1;

// DOM Elements
const fetchBtn = document.getElementById('fetchBtn');
const searchInput = document.getElementById('searchInput');
const jokesContainer = document.getElementById('jokesContainer');
const statusMessage = document.getElementById('statusMessage');
const paginationContainer = document.getElementById('paginationContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageDisplay = document.getElementById('currentPageDisplay');
const totalPagesDisplay = document.getElementById('totalPagesDisplay');

// Initialize
function init() {
  setupEventListeners();
  fetchJokes();
}

// Event Listeners
function setupEventListeners() {
  fetchBtn.addEventListener('click', () => {
    currentPage = 1;
    currentQuery = searchInput.value.trim();
    fetchJokes();
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentPage = 1;
      currentQuery = searchInput.value.trim();
      fetchJokes();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchJokes();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchJokes();
    }
  });
}

// Show Message
function showMessage(msg, type = 'info') {
  statusMessage.textContent = msg;
  statusMessage.classList.remove('hidden', 'bg-red-500/10', 'text-red-400', 'border-red-500/20', 'bg-blue-500/10', 'text-blue-400', 'border-blue-500/20');
  
  if (type === 'error') {
    statusMessage.classList.add('bg-red-500/10', 'text-red-400', 'border-red-500/20');
  } else {
    statusMessage.classList.add('bg-blue-500/10', 'text-blue-400', 'border-blue-500/20');
  }
}

function hideMessage() {
  statusMessage.classList.add('hidden');
}

// Render Loading Skeletons
function renderSkeletons() {
  jokesContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const delay = i * 100;
    jokesContainer.innerHTML += `
      <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm animate-pulse delay-${delay}">
        <div class="h-4 bg-white/10 rounded-full w-24 mb-4"></div>
        <div class="h-5 bg-white/10 rounded-full w-full mb-3"></div>
        <div class="h-5 bg-white/10 rounded-full w-5/6"></div>
      </div>
    `;
  }
}

// Fetch Jokes
async function fetchJokes() {
  renderSkeletons();
  hideMessage();
  paginationContainer.classList.add('hidden');
  
  fetchBtn.disabled = true;
  fetchBtn.classList.add('opacity-70', 'cursor-not-allowed');

  try {
    let url = `${API_BASE_URL}?limit=${LIMIT}&page=${currentPage}`;
    if (currentQuery) {
      url += `&query=${encodeURIComponent(currentQuery)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data && data.data.data) {
      const jokes = data.data.data;
      totalPages = data.data.totalPages || 1;
      
      if (jokes.length === 0) {
        jokesContainer.innerHTML = '';
        showMessage('No jokes found. Try a different search term.', 'info');
      } else {
        renderJokes(jokes);
        updatePagination();
      }
    } else {
      throw new Error('Invalid data format received from API');
    }

  } catch (error) {
    console.error('Error fetching jokes:', error);
    jokesContainer.innerHTML = '';
    showMessage('Failed to fetch jokes. Please try again later.', 'error');
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.classList.remove('opacity-70', 'cursor-not-allowed');
  }
}

// Render Jokes
function renderJokes(jokes) {
  jokesContainer.innerHTML = '';
  
  jokes.forEach((joke, index) => {
    const delay = (index % 5) * 100;
    
    // Process categories
    const categoriesHtml = joke.categories && joke.categories.length > 0 
      ? joke.categories.map(cat => `<span class="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-md border border-indigo-500/30 uppercase tracking-wider">${cat}</span>`).join('')
      : `<span class="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs font-semibold rounded-md border border-slate-700 uppercase tracking-wider">Uncategorized</span>`;

    const card = document.createElement('div');
    card.className = `group relative p-6 md:p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 backdrop-blur-md transition-all duration-300 animate-slide-up delay-${delay} shadow-xl shadow-black/20 overflow-hidden`;
    
    // Decorative element
    const glow = document.createElement('div');
    glow.className = `absolute -inset-px bg-gradient-to-r from-indigo-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none`;
    card.appendChild(glow);

    card.innerHTML += `
      <div class="relative z-10">
        <div class="flex justify-between items-start mb-4">
          <div class="flex flex-wrap gap-2">
            ${categoriesHtml}
          </div>
          <span class="text-xs font-mono text-slate-500 bg-black/20 px-2 py-1 rounded-md">ID: ${joke.id}</span>
        </div>
        <p class="text-lg md:text-xl text-slate-100 font-medium leading-relaxed mt-2 selection:bg-indigo-500 selection:text-white">
          ${joke.content}
        </p>
        
        <div class="mt-6 flex items-center justify-between border-t border-white/5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="flex items-center space-x-2 text-slate-400 text-sm">
            <svg class="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
            <span>Funny</span>
          </div>
          <button class="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors flex items-center" onclick="navigator.clipboard.writeText('${joke.content.replace(/'/g, "\\'")}').then(() => alert('Copied to clipboard!'))">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Copy
          </button>
        </div>
      </div>
    `;

    jokesContainer.appendChild(card);
  });
}

// Update Pagination
function updatePagination() {
  if (totalPages <= 1) {
    paginationContainer.classList.add('hidden');
    return;
  }
  
  paginationContainer.classList.remove('hidden');
  currentPageDisplay.textContent = currentPage;
  totalPagesDisplay.textContent = totalPages;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Run
document.addEventListener('DOMContentLoaded', init);
