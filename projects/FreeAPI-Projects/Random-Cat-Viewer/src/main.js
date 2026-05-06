const API_URL = 'https://api.freeapi.app/api/v1/public/cats/cat/random';

const dom = {
  card: document.getElementById('cat-card'),
  image: document.getElementById('cat-image'),
  origin: document.getElementById('cat-origin'),
  name: document.getElementById('cat-name'),
  description: document.getElementById('cat-description'),
  lifespan: document.getElementById('cat-lifespan'),
  weight: document.getElementById('cat-weight'),
  temperament: document.getElementById('cat-temperament'),
  fetchBtn: document.getElementById('fetch-btn'),
  cardContent: document.getElementById('card-content')
};

async function fetchRandomCat() {
  setLoading(true);
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    if (result.success && result.data) {
      updateUI(result.data);
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching cat data:', error);
    showError();
  } finally {
    // Adding a slight delay to ensure smooth transition of images and data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    dom.card.classList.add('loading');
    dom.fetchBtn.classList.add('fetching');
    dom.fetchBtn.disabled = true;
  } else {
    dom.card.classList.remove('loading');
    dom.fetchBtn.classList.remove('fetching');
    dom.fetchBtn.disabled = false;
  }
}

function updateUI(cat) {
  // Reset any error messages if any
  if (dom.cardContent.querySelector('.error-message')) {
    dom.cardContent.innerHTML = `
      <div class="image-container">
        <img id="cat-image" src="" alt="A random cat" />
        <div class="origin-badge" id="cat-origin"></div>
      </div>
      <div class="cat-info">
        <h2 id="cat-name"></h2>
        <p class="cat-description" id="cat-description"></p>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Life Span</span>
            <span class="stat-value" id="cat-lifespan"></span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Weight</span>
            <span class="stat-value" id="cat-weight"></span>
          </div>
        </div>
        
        <div class="temperament-section">
          <h3>Temperament</h3>
          <div class="tags" id="cat-temperament">
            <!-- Tags will be injected here -->
          </div>
        </div>
      </div>
    `;
    
    // Re-bind dom elements since we overwrote innerHTML
    dom.image = document.getElementById('cat-image');
    dom.origin = document.getElementById('cat-origin');
    dom.name = document.getElementById('cat-name');
    dom.description = document.getElementById('cat-description');
    dom.lifespan = document.getElementById('cat-lifespan');
    dom.weight = document.getElementById('cat-weight');
    dom.temperament = document.getElementById('cat-temperament');
  }

  // Update image
  dom.image.src = cat.image || 'https://via.placeholder.com/600x400?text=No+Image+Available';
  dom.image.alt = `A picture of a ${cat.name || 'cat'}`;
  
  // Basic info
  dom.name.textContent = cat.name || 'Unknown Breed';
  dom.origin.textContent = cat.origin ? `🌍 ${cat.origin}` : '🌍 Unknown Origin';
  dom.description.textContent = cat.description || 'No description available for this breed.';
  
  // Stats
  dom.lifespan.textContent = cat.life_span ? `${cat.life_span} years` : 'Unknown';
  
  // Weight handling
  if (cat.weight) {
    const weightStr = cat.weight.metric ? `${cat.weight.metric} kg` : (cat.weight.imperial ? `${cat.weight.imperial} lbs` : 'Unknown');
    dom.weight.textContent = weightStr;
  } else {
    dom.weight.textContent = 'Unknown';
  }
  
  // Temperament tags
  dom.temperament.innerHTML = '';
  if (cat.temperament) {
    const traits = cat.temperament.split(',').map(t => t.trim());
    traits.forEach(trait => {
      if (trait) {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = trait;
        dom.temperament.appendChild(span);
      }
    });
  } else {
    dom.temperament.innerHTML = '<span class="tag">Unknown</span>';
  }
}

function showError() {
  dom.cardContent.innerHTML = `
    <div class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p>Failed to summon a cat. Please try again later.</p>
    </div>
  `;
}

// Event Listeners
dom.fetchBtn.addEventListener('click', fetchRandomCat);

// Initial fetch
document.addEventListener('DOMContentLoaded', fetchRandomCat);
