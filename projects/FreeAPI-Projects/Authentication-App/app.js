// --- Constants & API Configuration ---
const BASE_URL = 'https://api.freeapi.app/api/v1/users';

// State
let currentUser = null;

// --- DOM Elements ---
// Views
const authView = document.getElementById('auth-view');
const dashboardView = document.getElementById('dashboard-view');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');

// Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Buttons
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');

// Profile Elements
const profileUsername = document.getElementById('profile-username');
const profileEmail = document.getElementById('profile-email');
const profileRole = document.getElementById('profile-role');
const profileAvatarImg = document.getElementById('profile-avatar-img');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

// --- UI Toggles ---
window.toggleAuthMode = () => {
    loginContainer.classList.toggle('hidden');
    loginContainer.classList.toggle('active');
    registerContainer.classList.toggle('hidden');
    registerContainer.classList.toggle('active');
};

const showDashboard = () => {
    authView.classList.remove('active');
    authView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    dashboardView.classList.add('active');
    populateUserProfile();
};

const showAuth = () => {
    dashboardView.classList.remove('active');
    dashboardView.classList.add('hidden');
    authView.classList.remove('hidden');
    authView.classList.add('active');
    // Default to login view
    loginContainer.classList.remove('hidden');
    loginContainer.classList.add('active');
    registerContainer.classList.add('hidden');
    registerContainer.classList.remove('active');
};

const populateUserProfile = () => {
    if (currentUser) {
        profileUsername.textContent = currentUser.username || 'User';
        profileEmail.textContent = currentUser.email || 'No email provided';
        profileRole.textContent = currentUser.role || 'USER';
        
        // Generate an avatar based on username
        const name = encodeURIComponent(currentUser.username || 'User');
        profileAvatarImg.src = `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&size=128`;
    }
};

const setLoading = (button, isLoading) => {
    const textSpan = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner');
    
    if (isLoading) {
        button.disabled = true;
        textSpan.classList.add('hidden');
        spinner.classList.remove('hidden');
    } else {
        button.disabled = false;
        textSpan.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
};

// --- Toast Notifications ---
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `<span class="toast-content">${message}</span>`;
    
    container.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
};

// --- API Helpers ---
const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    // Add token if it exists in local storage
    const token = localStorage.getItem('accessToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// --- API Calls & Handlers ---

// Check if user is already logged in
const checkAuthStatus = async () => {
    const token = localStorage.getItem('accessToken');
    // If no token, maybe relying on cookies, let's still try to fetch current user
    try {
        const response = await fetch(`${BASE_URL}/current-user`, {
            method: 'GET',
            headers: getHeaders(),
            // include credentials for cookies if the API uses them
            credentials: 'omit' // Change to 'include' if API is same-site, but freeapi often relies on Bearer token
        });

        const data = await response.json();

        if (response.ok && data.success) {
            currentUser = data.data;
            showDashboard();
        } else {
            // Clear invalid token
            localStorage.removeItem('accessToken');
            showAuth();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        showAuth();
    }
};

// Handle Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    
    setLoading(registerBtn, true);
    
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, username, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showToast('Registration successful! Please log in.', 'success');
            registerForm.reset();
            toggleAuthMode(); // Switch to login view
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('An error occurred during registration', 'error');
        console.error(error);
    } finally {
        setLoading(registerBtn, false);
    }
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    setLoading(loginBtn, true);
    
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Save token if returned in response body
            if (data.data && data.data.accessToken) {
                localStorage.setItem('accessToken', data.data.accessToken);
            }
            
            // Set current user data
            currentUser = data.data.user;
            
            showToast('Login successful!', 'success');
            loginForm.reset();
            showDashboard();
        } else {
            showToast(data.message || 'Invalid credentials', 'error');
        }
    } catch (error) {
        showToast('An error occurred during login', 'error');
        console.error(error);
    } finally {
        setLoading(loginBtn, false);
    }
});

// Handle Logout
logoutBtn.addEventListener('click', async () => {
    setLoading(logoutBtn, true);
    
    try {
        const response = await fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            headers: getHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showToast('Logged out successfully', 'success');
        } else {
            // Even if api fails, we should clear local state
            showToast(data.message || 'Logout requested', 'success');
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear state and redirect to login
        localStorage.removeItem('accessToken');
        currentUser = null;
        setLoading(logoutBtn, false);
        showAuth();
    }
});
