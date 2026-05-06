const API_URL = 'https://api.freeapi.app/api/v1/public/youtube/videos';
const videoGrid = document.getElementById('videoGrid');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let currentPage = 1;
let currentQuery = 'javascript';
let isLoading = false;
let hasMore = true;

// Utility function to format ISO 8601 duration (e.g., PT19M35S)
function parseDuration(duration) {
    if (!duration) return '0:00';
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    
    let result = '';
    
    if (hours > 0) {
        result += `${hours}:`;
        result += `${minutes.toString().padStart(2, '0')}:`;
    } else {
        result += `${minutes}:`;
    }
    
    result += seconds.toString().padStart(2, '0');
    return result;
}

// Utility function to format view count
function formatViews(views) {
    if (!views) return '0';
    const v = parseInt(views);
    if (v >= 1000000) {
        return (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (v >= 1000) {
        return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return v.toString();
}

// Utility function for relative time
function getRelativeTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
        const value = Math.floor(diffInSeconds / seconds);
        if (value >= 1) {
            return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
        }
    }
    return 'Just now';
}

// Fetch videos from API
async function fetchVideos(query = 'javascript', page = 1) {
    if (isLoading || (!hasMore && page !== 1)) return;
    
    isLoading = true;
    if (page === 1) {
        // If it's a new search and we already have videos, we clear them 
        // to show loading skeletons or empty state
        loader.classList.add('active');
    } else {
        // For infinite scroll, just show loader at bottom
        loader.classList.add('active');
    }
    
    try {
        const url = `${API_URL}?page=${page}&limit=12&query=${encodeURIComponent(query)}&sortBy=latest`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });
        
        const json = await response.json();
        
        if (json.success && json.data && json.data.data) {
            const videos = json.data.data;
            hasMore = json.data.nextPage;
            
            if (page === 1) {
                videoGrid.innerHTML = '';
            }
            
            renderVideos(videos);
        } else {
            if (page === 1) videoGrid.innerHTML = '';
            showError('Failed to load videos.');
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
        if (page === 1) {
            videoGrid.innerHTML = '';
        }
        showError('An error occurred while fetching videos. Please check your connection.');
    } finally {
        isLoading = false;
        loader.classList.remove('active');
    }
}

// Render video cards
function renderVideos(videos) {
    if (videos.length === 0 && currentPage === 1) {
        videoGrid.innerHTML = '<div class="no-results">No videos found for this search. Try a different query.</div>';
        return;
    }
    
    videos.forEach(videoData => {
        // Handle varying response structures (sometimes item is inside items array, sometimes just items object)
        const video = videoData.items;
        if (!video || !video.snippet) return; // Skip invalid items
        
        const snippet = video.snippet;
        const stats = video.statistics || {};
        const details = video.contentDetails || {};
        
        // Find best available thumbnail safely
        let thumbnailUrl = '';
        if (snippet.thumbnails) {
            const t = snippet.thumbnails;
            thumbnailUrl = (t.maxres && t.maxres.url) || 
                           (t.high && t.high.url) || 
                           (t.medium && t.medium.url) || 
                           (t.default && t.default.url) || '';
        }
        
        const channelInitial = snippet.channelTitle ? snippet.channelTitle.charAt(0).toUpperCase() : '?';
        const durationStr = parseDuration(details.duration);
        const viewsStr = formatViews(stats.viewCount);
        const timeStr = getRelativeTime(snippet.publishedAt);
        
        const card = document.createElement('article');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="thumbnail-container">
                ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${snippet.title}" class="thumbnail" loading="lazy">` : '<div class="thumbnail" style="background:#222"></div>'}
                <span class="duration">${durationStr}</span>
            </div>
            <div class="video-info">
                <div class="channel-avatar">${channelInitial}</div>
                <div class="video-details">
                    <h3 class="video-title" title="${snippet.title}">${snippet.title}</h3>
                    <div class="channel-name">${snippet.channelTitle || 'Unknown Channel'}</div>
                    <div class="video-meta">
                        <span>${viewsStr} views</span>
                        <span class="separator">•</span>
                        <span>${timeStr}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add subtle animation delay for stagger effect if needed
        videoGrid.appendChild(card);
    });
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'no-results';
    errorEl.style.color = '#ff3b30';
    errorEl.textContent = message;
    videoGrid.appendChild(errorEl);
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        hasMore = true;
        updateActiveFilter(null); // Clear active filter if searching manually
        fetchVideos(currentQuery, currentPage);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Category Filters
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const query = btn.textContent === 'All' ? 'javascript' : btn.textContent;
        currentQuery = query;
        currentPage = 1;
        hasMore = true;
        
        searchInput.value = ''; // clear search bar
        updateActiveFilter(btn);
        
        // Clear grid and show skeletons immediately for better UX
        videoGrid.innerHTML = `
            ${Array(8).fill(0).map(() => `
            <div class="video-card skeleton-card">
                <div class="thumbnail-container"></div>
                <div class="video-info">
                    <div class="channel-avatar"></div>
                    <div class="video-details" style="width: 100%;">
                        <div class="skeleton-text skeleton-title"></div>
                        <div class="skeleton-text skeleton-channel"></div>
                        <div class="skeleton-text skeleton-meta"></div>
                    </div>
                </div>
            </div>`).join('')}
        `;
        
        fetchVideos(currentQuery, currentPage);
    });
});

function updateActiveFilter(activeBtn) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Infinite Scroll
window.addEventListener('scroll', () => {
    if (isLoading || !hasMore) return;
    
    // Check if user scrolled near the bottom (100px threshold)
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        currentPage++;
        fetchVideos(currentQuery, currentPage);
    }
});

// Logo click goes back to home
document.querySelector('.logo').addEventListener('click', () => {
    const firstFilter = document.querySelector('.filter-btn');
    if (firstFilter) firstFilter.click();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    fetchVideos(currentQuery, currentPage);
});
