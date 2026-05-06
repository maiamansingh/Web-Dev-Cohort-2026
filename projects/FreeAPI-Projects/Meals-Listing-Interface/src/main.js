import './style.css';

const API_URL = 'https://api.freeapi.app/api/v1/public/meals';

// State
let state = {
  meals: [],
  page: 1,
  limit: 10,
  query: '',
  isLoading: false,
  error: null,
  totalPages: 1,
  hasNext: false,
  hasPrev: false
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const mealsGrid = document.getElementById('mealsGrid');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('errorState');
const emptyState = document.getElementById('emptyState');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicators = document.getElementById('pageIndicators');
const yearSpan = document.getElementById('year');

// Initialize
function init() {
  yearSpan.textContent = new Date().getFullYear();
  
  // Event Listeners
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  
  retryBtn.addEventListener('click', fetchMeals);
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.query = '';
    state.page = 1;
    fetchMeals();
  });
  
  prevBtn.addEventListener('click', () => {
    if (state.hasPrev) {
      state.page--;
      fetchMeals();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (state.hasNext) {
      state.page++;
      fetchMeals();
    }
  });

  // Initial fetch
  fetchMeals();
}

async function fetchMeals() {
  updateState({ isLoading: true, error: null });
  render();

  try {
    const url = new URL(API_URL);
    url.searchParams.append('page', state.page);
    url.searchParams.append('limit', state.limit);
    if (state.query) {
      url.searchParams.append('query', state.query);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      updateState({
        meals: data.data.data || [],
        isLoading: false,
        totalPages: data.data.totalPages || 1,
        hasNext: data.data.nextPage,
        hasPrev: data.data.previousPage
      });
    } else {
      throw new Error(data.message || 'Failed to fetch meals');
    }
  } catch (error) {
    console.error('Error fetching meals:', error);
    updateState({ 
      isLoading: false, 
      error: error.message || 'An unexpected error occurred while fetching meals.' 
    });
  }
}

function handleSearch() {
  const query = searchInput.value.trim();
  state.query = query;
  state.page = 1; // Reset to page 1 on new search
  fetchMeals();
}

function updateState(newState) {
  state = { ...state, ...newState };
  render();
}

function render() {
  // Update visibility of states
  loadingState.classList.toggle('hidden', !state.isLoading);
  
  const hasError = !!state.error && !state.isLoading;
  errorState.classList.toggle('hidden', !hasError);
  if (hasError) errorMessage.textContent = state.error;

  const isEmpty = !state.isLoading && !hasError && state.meals.length === 0;
  emptyState.classList.toggle('hidden', !isEmpty);
  
  const showGrid = !state.isLoading && !hasError && !isEmpty;
  mealsGrid.classList.toggle('hidden', !showGrid);

  // Render Grid
  if (showGrid) {
    mealsGrid.innerHTML = state.meals.map(meal => `
      <a href="${meal.strSource || '#'}" target="_blank" rel="noopener noreferrer" class="meal-card">
        <div class="meal-image-wrapper">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-image" loading="lazy" />
          <span class="meal-badge">${meal.strCategory}</span>
        </div>
        <div class="meal-content">
          <h3 class="meal-title" title="${meal.strMeal}">${meal.strMeal}</h3>
          <div class="meal-area">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${meal.strArea}
          </div>
        </div>
      </a>
    `).join('');
  } else {
    mealsGrid.innerHTML = '';
  }

  // Update Pagination
  prevBtn.disabled = !state.hasPrev || state.isLoading;
  nextBtn.disabled = !state.hasNext || state.isLoading;
  pageIndicators.textContent = `Page ${state.page} of ${state.totalPages}`;
}

// Start application
init();
