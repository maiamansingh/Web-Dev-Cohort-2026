const API_BASE_URL = 'https://api.freeapi.app/api/v1/public/quotes';

// State
let state = {
  quotes: [],
  page: 1,
  limit: 12, // Using 12 for better grid distribution (divisible by 1, 2, 3, 4)
  query: '',
  totalPages: 1,
  isLoading: false,
  error: null
};

// DOM Elements
const elements = {
  quotesGrid: document.getElementById('quotesGrid'),
  searchInput: document.getElementById('searchInput'),
  loadingIndicator: document.getElementById('loadingIndicator'),
  errorState: document.getElementById('errorState'),
  errorMessage: document.getElementById('errorMessage'),
  emptyState: document.getElementById('emptyState'),
  retryButton: document.getElementById('retryButton'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  pageInfo: document.getElementById('pageInfo'),
  paginationControls: document.getElementById('paginationControls')
};

// Initialization
async function init() {
  setupEventListeners();
  await fetchQuotes();
}

// Fetch Quotes
async function fetchQuotes() {
  state.isLoading = true;
  state.error = null;
  updateUI();

  try {
    const url = new URL(API_BASE_URL);
    url.searchParams.append('page', state.page);
    url.searchParams.append('limit', state.limit);
    if (state.query) {
      url.searchParams.append('query', state.query);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' }
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch quotes');
    }

    state.quotes = result.data.data;
    state.totalPages = result.data.totalPages || 1;
    state.page = result.data.page || 1;
    
  } catch (error) {
    console.error('API Error:', error);
    state.error = error.message;
  } finally {
    state.isLoading = false;
    updateUI();
  }
}

// Update UI based on State
function updateUI() {
  // Toggle Visibility
  elements.loadingIndicator.classList.toggle('hidden', !state.isLoading);
  elements.errorState.classList.toggle('hidden', !state.error || state.isLoading);
  elements.emptyState.classList.toggle('hidden', state.quotes.length > 0 || state.isLoading || state.error);
  elements.quotesGrid.classList.toggle('hidden', state.quotes.length === 0 || state.isLoading || state.error);
  elements.paginationControls.classList.toggle('hidden', state.quotes.length === 0 && !state.query || state.error);

  if (state.error) {
    elements.errorMessage.textContent = state.error;
    return;
  }

  if (!state.isLoading && state.quotes.length > 0) {
    renderQuotes(state.quotes);
  }

  // Update Pagination Controls
  elements.prevBtn.disabled = state.page <= 1;
  elements.nextBtn.disabled = state.page >= state.totalPages;
  elements.pageInfo.textContent = `Page ${state.page} of ${state.totalPages}`;
}

// Render Quotes Grid
function renderQuotes(quotes) {
  elements.quotesGrid.innerHTML = quotes.map((quote, index) => {
    // Determine random subtle background gradient for cards
    const bgGradients = [
      'from-indigo-500/10 to-purple-500/10',
      'from-emerald-500/10 to-teal-500/10',
      'from-rose-500/10 to-orange-500/10',
      'from-blue-500/10 to-cyan-500/10',
      'from-fuchsia-500/10 to-pink-500/10'
    ];
    const gradient = bgGradients[index % bgGradients.length];

    const tagsHtml = quote.tags && quote.tags.length > 0 
      ? `<div class="mt-4 flex flex-wrap gap-2">
          ${quote.tags.slice(0,3).map(tag => `<span class="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 backdrop-blur-md">${tag}</span>`).join('')}
         </div>`
      : '';

    return `
      <div class="glass-panel rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between h-full bg-gradient-to-br ${gradient}">
        <!-- Decorative quote icon -->
        <div class="absolute top-4 right-6 text-6xl text-white/5 font-serif pointer-events-none group-hover:scale-110 transition-transform duration-500">"</div>
        
        <div>
          <p class="font-serif text-xl md:text-2xl leading-relaxed text-gray-100 mb-6 italic relative z-10">
            "${quote.content}"
          </p>
        </div>
        
        <div class="mt-auto pt-6 border-t border-white/5 relative z-10 flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              ${quote.author.charAt(0)}
            </div>
            <p class="font-medium text-indigo-300 tracking-wide">${quote.author}</p>
          </div>
          ${tagsHtml}
        </div>
      </div>
    `;
  }).join('');
}

// Event Listeners
function setupEventListeners() {
  // Debounce helper
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Search Input
  elements.searchInput.addEventListener('input', debounce((e) => {
    state.query = e.target.value.trim();
    state.page = 1; // Reset to first page on new search
    fetchQuotes();
  }, 500));

  // Pagination
  elements.prevBtn.addEventListener('click', () => {
    if (state.page > 1) {
      state.page--;
      fetchQuotes();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  elements.nextBtn.addEventListener('click', () => {
    if (state.page < state.totalPages) {
      state.page++;
      fetchQuotes();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Retry Button
  elements.retryButton.addEventListener('click', fetchQuotes);
}

// Start App
init();
