import './style.css'

const API_URL = 'https://api.freeapi.app/api/v1/public/randomproducts'

document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('product-container')
  const loadingState = document.getElementById('loading-state')
  const errorState = document.getElementById('error-state')
  const retryBtn = document.getElementById('retry-btn')

  const fetchProducts = async () => {
    // Show loading state
    productContainer.innerHTML = ''
    errorState.classList.add('hidden')
    loadingState.classList.remove('hidden')
    loadingState.classList.add('flex')

    try {
      const response = await fetch(API_URL)
      const result = await response.json()

      if (result.success && result.data && result.data.data) {
        renderProducts(result.data.data)
      } else {
        throw new Error('Invalid data format')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showError()
    } finally {
      // Hide loading state
      loadingState.classList.add('hidden')
      loadingState.classList.remove('flex')
    }
  }

  const showError = () => {
    errorState.classList.remove('hidden')
    errorState.classList.add('flex')
  }

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    let starsHtml = '<div class="flex items-center text-yellow-400 text-sm">'
    
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>'
    }

    if (hasHalfStar) {
      // Simple representation for half star
      starsHtml += '<svg class="w-4 h-4 fill-current opacity-50" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>'
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>'
    }

    starsHtml += `<span class="ml-1 text-xs text-gray-500 font-medium">${rating.toFixed(1)}</span></div>`
    return starsHtml
  }

  const renderProducts = (products) => {
    productContainer.innerHTML = ''
    
    products.forEach(product => {
      // Calculate original price based on discounted price and percentage
      const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
      
      const productCard = document.createElement('div')
      productCard.className = 'product-card group'
      
      // We use product.images[0] if thumbnail is missing, or a placeholder
      const imageSrc = product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400?text=No+Image')

      productCard.innerHTML = `
        <div class="product-image-container">
          <span class="product-badge">${product.discountPercentage.toFixed(0)}% OFF</span>
          <span class="product-stock-badge ${product.stock < 50 ? 'text-orange-600' : 'text-green-600'}">
            ${product.stock < 50 ? 'Low Stock' : 'In Stock'}
          </span>
          <img src="${imageSrc}" onerror="this.onerror=null;this.src='https://placehold.co/400x400?text=${encodeURIComponent(product.title)}';" alt="${product.title}" class="product-image" loading="lazy">
        </div>
        
        <div class="product-content">
          <div class="flex justify-between items-start mb-1">
            <span class="product-brand">${product.brand || 'Generic'}</span>
            ${renderStarRating(product.rating)}
          </div>
          
          <h3 class="product-title" title="${product.title}">${product.title}</h3>
          
          <p class="product-desc" title="${product.description}">${product.description}</p>
          
          <div class="product-footer">
            <div class="product-price-container">
              <div class="flex items-baseline">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <span class="product-original-price">$${originalPrice}</span>
              </div>
            </div>
            
            <button class="add-to-cart-btn" aria-label="Add to cart">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      `
      
      productContainer.appendChild(productCard)
    })
  }

  // Initial fetch
  fetchProducts()

  // Retry event listener
  retryBtn.addEventListener('click', fetchProducts)
})
